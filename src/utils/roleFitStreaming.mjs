// Bound the browser-only WebLLM generation phase independently of model
// loading. Loading progress 100% does not mean a chat completion exists.
export const roleFitGenerationLimits = Object.freeze({
  startupMs: 30000,
  firstChunkMs: 90000,
  idleMs: 45000,
  totalMs: 210000,
  maxOutputChars: 8000,
});

export class RoleFitStreamError extends Error {
  constructor(code, partialText = '', cause) {
    super(code);
    this.name = 'RoleFitStreamError';
    this.code = code;
    this.partialText = partialText;
    if (cause !== undefined) this.cause = cause;
  }
}

function waitForGeneration(operation, timeoutMs, timeoutCode, signal, partialText) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new RoleFitStreamError('generation_aborted', partialText()));
      return;
    }
    let settled = false;
    let timer;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener?.('abort', onAbort);
      fn(value);
    };
    const onAbort = () => finish(reject, new RoleFitStreamError('generation_aborted', partialText()));
    signal?.addEventListener?.('abort', onAbort, { once: true });
    // An abort between the first check and listener registration must not hang.
    if (signal?.aborted) {
      onAbort();
      return;
    }
    timer = setTimeout(() =>
      finish(reject, new RoleFitStreamError(timeoutCode, partialText())), Math.max(1, timeoutMs));
    Promise.resolve().then(() => settled ? undefined : operation()).then(
      value => finish(resolve, value),
      error => finish(reject, error),
    );
  });
}

// Streamed deltas are buffered, not rendered as factual claims. The UI sees
// progress counts only. Completed text still goes through evidence validation.
export async function streamRoleFitAI({
  createCompletion, request, onProgress = () => {}, signal,
  limits = roleFitGenerationLimits, now = Date.now,
}) {
  const startedAt = now();
  let partialText = '';
  let finishReason = null;
  let lastReportedLength = 0;
  let lastReportedAt = startedAt;
  const partial = () => partialText;
  const within = async (operation, phaseMs, phaseCode) => {
    const remainingTotal = limits.totalMs - (now() - startedAt);
    if (remainingTotal <= 0) throw new RoleFitStreamError('generation_timeout', partialText);
    const totalFirst = remainingTotal <= phaseMs;
    return waitForGeneration(operation, Math.min(phaseMs, remainingTotal),
      totalFirst ? 'generation_timeout' : phaseCode, signal, partial);
  };

  onProgress('Generating AI interpretation… waiting for the local model.');
  try {
    // WebLLM 0.2.81 worker engine supports stream: true with JSON output.
    const stream = await within(
      () => createCompletion({ ...request, stream: true }),
      limits.startupMs, 'stream_startup_timeout');
    if (!stream || typeof stream[Symbol.asyncIterator] !== 'function') {
      throw new RoleFitStreamError('invalid_stream', partialText);
    }
    const iterator = stream[Symbol.asyncIterator]();
    if (!iterator || typeof iterator.next !== 'function') {
      throw new RoleFitStreamError('invalid_stream', partialText);
    }
    while (true) {
      if (signal?.aborted) throw new RoleFitStreamError('generation_aborted', partialText);
      const { value, done } = await within(
        () => iterator.next(),
        partialText.length ? limits.idleMs : limits.firstChunkMs,
        partialText.length ? 'generation_stalled' : 'first_token_timeout');
      if (done) break;
      const choice = value?.choices?.[0];
      const delta = choice?.delta?.content;
      if (typeof delta === 'string' && delta.length) {
        const nextLength = partialText.length + delta.length;
        partialText = (partialText + delta).slice(0, limits.maxOutputChars);
        if (nextLength > limits.maxOutputChars) {
          throw new RoleFitStreamError('response_too_long', partialText);
        }
        const current = now();
        if (lastReportedLength === 0 || partialText.length - lastReportedLength >= 100 ||
            current - lastReportedAt >= 2000) {
          lastReportedLength = partialText.length;
          lastReportedAt = current;
          onProgress('Generating AI interpretation… ' + partialText.length +
            ' characters received (not yet validated).');
        }
      }
      if (choice?.finish_reason) finishReason = choice.finish_reason;
    }
    onProgress('Validating the generated AI interpretation…');
    return { text: partialText, finishReason };
  } catch (error) {
    if (error instanceof RoleFitStreamError) throw error;
    throw new RoleFitStreamError('generation_failed', partialText, error);
  }
}

// WebLLM may emit "Finish loading on WebGPU" (progress: 1) while the
// asynchronous worker initialization promise is still unresolved. Bound
// that final handshake; do not impose a short timeout on actual downloads.
export function awaitRoleFitModelReady({
  start, onProgress = () => {}, readyTimeoutMs = 25000, signal,
}) {
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer = null;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      signal?.removeEventListener?.('abort', onAbort);
      fn(value);
    };
    const onAbort = () =>
      finish(reject, new RoleFitStreamError('generation_aborted'));
    if (signal?.aborted) {
      onAbort();
      return;
    }
    signal?.addEventListener?.('abort', onAbort, { once: true });
    if (signal?.aborted) {
      onAbort();
      return;
    }
    Promise.resolve().then(() => settled ? undefined : start(report => {
      if (settled) return;
      onProgress(report);
      if (report?.progress >= 1 && timer === null) {
        timer = setTimeout(() =>
          finish(reject, new RoleFitStreamError('model_ready_timeout')),
        Math.max(1, readyTimeoutMs));
      }
    })).then(engine => finish(resolve, engine), error => finish(reject, error));
  });
}

// A first-token timeout can be slow prompt prefill rather than a broken model.
// Retry once on the next smaller model already registered in the local WebLLM
// catalog. Do not retry mid-response stalls (partial text must be preserved),
// arbitrary errors, or cancelled requests. No server inference is involved.
export async function runRoleFitWithFallback({
  loadModel, generate, dispose, onRetry = () => {}, signal,
}) {
  const excludedIds = [];
  let firstTokenError = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (signal?.aborted) throw new RoleFitStreamError('generation_aborted');
    let loaded;
    try {
      loaded = await loadModel([...excludedIds]);
    } catch (error) {
      // A first model did run but timed out; don't replace that finding with
      // the misleading "no compatible fallback available" explanation.
      if (firstTokenError) throw firstTokenError;
      throw error;
    }
    if (signal?.aborted) throw new RoleFitStreamError('generation_aborted');
    try {
      return { ...await generate(loaded), modelId: loaded.modelId };
    } catch (error) {
      // Release the failed worker before another GPU model is initialized.
      await dispose(loaded);
      if (signal?.aborted) throw new RoleFitStreamError('generation_aborted');
      if (error?.code !== 'first_token_timeout' || attempt > 0) throw error;
      firstTokenError = error;
      excludedIds.push(loaded.modelId);
      onRetry(loaded.modelId);
    }
  }
  throw firstTokenError ?? new RoleFitStreamError('generation_failed');
}
