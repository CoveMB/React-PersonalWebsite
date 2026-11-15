import assert from 'node:assert/strict';
import test from 'node:test';
import { streamRoleFitAI, roleFitGenerationLimits } from '../src/utils/roleFitStreaming.mjs';

const request = { messages: [{ role: 'user', content: 'Hello' }], response_format: { type: 'json_object' } };
const smallLimits = { startupMs: 30, firstChunkMs: 30, idleMs: 25, totalMs: 120, maxOutputChars: 8000 };
const never = () => new Promise(() => {});
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

test('transitions to generation immediately after load and streams JSON before validation', async () => {
  const stages = [];
  let receivedOptions;
  const result = await streamRoleFitAI({
    createCompletion: async options => {
      receivedOptions = options;
      return (async function* () {
        yield { choices: [{ delta: { content: '{"direct":[' }, finish_reason: null }] };
        yield { choices: [{ delta: { content: '],"transferable":[],"notEstablished":[]}' }, finish_reason: null }] };
        yield { choices: [{ delta: {}, finish_reason: 'stop' }] };
      })();
    },
    request,
    onProgress: message => stages.push(message),
    limits: smallLimits,
  });
  assert.equal(receivedOptions.stream, true);
  assert.deepEqual(receivedOptions.response_format, { type: 'json_object' });
  assert.equal(result.finishReason, 'stop');
  assert.equal(result.text, '{"direct":[],"transferable":[],"notEstablished":[]}');
  assert.ok(stages[0].includes('Generating'));
  assert.ok(stages.some(s => /received/i.test(s)));
  assert.ok(!stages.some(s => /100%/.test(s)), 'loading 100% must not masquerade as generation completion');
});

test('stalled stream initialization exits with a specific timeout instead of showing loading forever', async () => {
  await assert.rejects(
    streamRoleFitAI({ createCompletion: never, request, limits: { ...smallLimits, startupMs: 12 } }),
    error => error.code === 'stream_startup_timeout' && error.partialText === '',
  );
});

test('generation with no first token exits with a first-token timeout', async () => {
  await assert.rejects(
    streamRoleFitAI({
      createCompletion: async () => ({ [Symbol.asyncIterator]: () => ({ next: never }) }),
      request, limits: { ...smallLimits, firstChunkMs: 12 },
    }),
    error => error.code === 'first_token_timeout' && error.partialText === '',
  );
});

test('generation stalled after producing text retains partial output but not a completed answer', async () => {
  const stages = [];
  let nextCalls = 0;
  const error = await streamRoleFitAI({
    createCompletion: async () => ({
      [Symbol.asyncIterator]: () => ({
        next: () => ++nextCalls === 1
          ? Promise.resolve({ done: false, value: { choices: [{ delta: { content: '{"direct":[' } }] } })
          : never(),
      }),
    }),
    request, onProgress: message => stages.push(message),
    limits: { ...smallLimits, idleMs: 12 },
  }).catch(error => error);
  assert.equal(error.code, 'generation_stalled');
  assert.equal(error.partialText, '{"direct":[');
  assert.ok(stages.some(s => /received/i.test(s)));
});

test('a hard total deadline bounds generation even if chunks continue arriving', async () => {
  await assert.rejects(
    streamRoleFitAI({
      createCompletion: async () => (async function* () {
        while (true) {
          await sleep(9);
          yield { choices: [{ delta: { content: 'a' }, finish_reason: null }] };
        }
      })(),
      request,
      limits: { ...smallLimits, totalMs: 28, firstChunkMs: 80, idleMs: 80 },
    }),
    error => error.code === 'generation_timeout' && error.partialText.length > 0,
  );
});

test('abort cancels pending generation promptly and does not fabricate an AI result', async () => {
  const controller = new AbortController();
  const job = streamRoleFitAI({
    createCompletion: never, request, signal: controller.signal,
    limits: { ...smallLimits, startupMs: 5000 },
  });
  controller.abort();
  await assert.rejects(job, error => error.code === 'generation_aborted' && error.partialText === '');
});

test('oversized output is bounded and labeled as incomplete', async () => {
  await assert.rejects(
    streamRoleFitAI({
      createCompletion: async () => (async function* () {
        yield { choices: [{ delta: { content: 'a'.repeat(8001) }, finish_reason: null }] };
      })(),
      request,
      limits: smallLimits,
    }),
    error => error.code === 'response_too_long' && error.partialText.length === 8000,
  );
});

test('empty stream finishes with empty response rather than manufacturing text', async () => {
  const result = await streamRoleFitAI({
    createCompletion: async () => (async function* () { yield { choices: [{ delta: {}, finish_reason: 'stop' }] }; })(),
    request, limits: smallLimits,
  });
  assert.equal(result.text, '');
  assert.equal(result.finishReason, 'stop');
});

test('default generation limits are finite and preserve a bounded model response', () => {
  assert.ok(roleFitGenerationLimits.startupMs > 0);
  assert.ok(roleFitGenerationLimits.firstChunkMs > 0);
  assert.ok(roleFitGenerationLimits.idleMs > 0);
  assert.ok(roleFitGenerationLimits.totalMs <= 240000);
  assert.equal(roleFitGenerationLimits.maxOutputChars, 8000);
});
