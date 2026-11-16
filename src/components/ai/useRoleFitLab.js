import { useEffect, useReducer, useRef, useState } from 'react';
import { roleFitLabMessageContent as copy } from '../../content/roleFitLabContent';
import { maximumJobDescriptionLength, getRolePostingValidationCode, selectRoleFitModelCandidates } from '../../utils/roleFit';
import { runRoleFitAnalyses, classifyRoleFitAIError, formatRoleFitAIErrorDetails } from '../../utils/roleFitAI.mjs';
import { buildRoleFitMarkdownRequest, roleFitMarkdownGenerationOptions } from '../../utils/roleFitMarkdown.mjs';
import { resumeRoleFitText } from '../../utils/resumeText';
import { createRoleFitRevisionGuard } from '../../utils/roleFitEnhancement.mjs';
import { streamRoleFitAI, awaitRoleFitModelReady, runRoleFitWithFallback, RoleFitStreamError } from '../../utils/roleFitStreaming.mjs';

const initialState = {
  jobDescription: '', result: null, aiAssessment: null, aiStatus: 'idle',
  errorMessage: '', aiFailure: null, statusMessage: '', modelId: '', analysisId: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'edit': return { ...state, jobDescription: action.value, result: null,
      aiAssessment: null, aiStatus: 'idle', errorMessage: '', aiFailure: null, statusMessage: '' };
    case 'reset': return { ...initialState, analysisId: state.analysisId };
    case 'invalid': return { ...state, errorMessage: action.value };
    case 'analyzed': return { ...state, result: action.result, aiAssessment: null,
      aiStatus: action.hasModel ? 'running' : 'unavailable', modelId: '', errorMessage: '', aiFailure: null,
      statusMessage: action.hasModel ? copy.statusMessages.loading : '',
      analysisId: state.analysisId + 1 };
    case 'progress': return { ...state, statusMessage: action.message };
    case 'aiReady': return { ...state, aiAssessment: action.result,
      aiStatus: ['accepted', 'unstructured'].includes(action.result.kind) ? 'ready' : action.result.kind === 'empty' ? 'empty' : 'invalid',
      statusMessage: '', aiFailure: action.result.failureCode ? { code: action.result.failureCode } : null,
      modelId: action.modelId };
    case 'aiFailed': return { ...state, aiStatus: 'failed',
      aiFailure: action.failure ?? { stage: 'generation', code: 'generation_failed' },
      modelId: action.modelId ?? state.modelId, statusMessage: '' };
    default: return state;
  }
};

const supportsLocalAI = () => typeof window !== 'undefined' &&
  typeof window.Worker !== 'undefined' && typeof navigator !== 'undefined' && Boolean(navigator.gpu);

export const getJobDescriptionErrorMessage = (input) => {
  const code = getRolePostingValidationCode(input);
  return code === 'too_long' ? copy.errors.tooLong
    : code === 'empty' ? copy.errors.missingJobDescription : '';
};
const progressMessage = (report) => {
  const percentage = Number.isFinite(report?.progress) ? ` (${Math.round(report.progress * 100)}%)` : '';
  return `${report?.text || copy.statusMessages.loading}${percentage}`;
};

const stopModel = ({ workerReference, engineReference, enginePromiseReference }) => {
  workerReference.current?.terminate();
  workerReference.current = null;
  const loaded = engineReference.current;
  engineReference.current = null;
  enginePromiseReference.current = null;
  try { void loaded?.instance?.unload?.()?.catch?.(() => undefined); } catch { /* best effort */ }
};

export const useRoleFitLab = () => {
  const [roleFitState, dispatch] = useReducer(reducer, initialState);
  const [canRunAI, setCanRunAI] = useState(false);
  const gateReference = useRef(createRoleFitRevisionGuard());
  const engineReference = useRef(null);
  const enginePromiseReference = useRef(null);
  const workerReference = useRef(null);
  const activeRunReference = useRef(null);
  const activeAbortReference = useRef(null);

  useEffect(() => {
    // React StrictMode cleans up and re-runs this effect in development.
    gateReference.current = createRoleFitRevisionGuard();
    setCanRunAI(supportsLocalAI());
    return () => {
      gateReference.current.dispose();
      activeRunReference.current = null;
      activeAbortReference.current?.abort();
      activeAbortReference.current = null;
      stopModel({ workerReference, engineReference, enginePromiseReference });
    };
  }, []);

  const invalidatePendingAI = () => {
    gateReference.current.bump();
    activeAbortReference.current?.abort();
    activeAbortReference.current = null;
    if (activeRunReference.current !== null) {
      stopModel({ workerReference, engineReference, enginePromiseReference });
      activeRunReference.current = null;
    }
  };
  const updateJobDescription = (event) => {
    invalidatePendingAI();
    dispatch({ type: 'edit', value: event.target.value });
  };
  const resetRoleFit = () => {
    invalidatePendingAI();
    dispatch({ type: 'reset' });
  };

  const loadEngine = async (revision, excludedModelIds = []) => {
    const gate = gateReference.current;
    if (engineReference.current && !excludedModelIds.includes(engineReference.current.modelId)) return {
      engine: engineReference.current.instance,
      modelId: engineReference.current.modelId,
    };
    if (engineReference.current) stopModel({ workerReference, engineReference, enginePromiseReference });
    if (enginePromiseReference.current?.revision === revision) return enginePromiseReference.current.promise;
    const promise = (async () => {
      // Download/load only after explicit Analyze; do not infer GPU memory
      // from system memory. A failed model load can try a smaller catalog entry.
      const { CreateWebWorkerMLCEngine, prebuiltAppConfig } = await import('@mlc-ai/web-llm');
      if (!gate.isCurrent(revision)) throw new Error('Superseded local-model request');
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) throw new Error('WebGPU adapter unavailable');
      const candidates = selectRoleFitModelCandidates(prebuiltAppConfig.model_list, {
        supportsF16: adapter.features.has('shader-f16'),
      }).filter(modelId => !excludedModelIds.includes(modelId));
      if (!candidates.length) throw new Error(copy.errors.missingModel);
      let previousError = null;
      for (const modelId of candidates) {
        if (!gate.isCurrent(revision)) throw new Error('Superseded local-model request');
        dispatch({ type: 'progress', message: 'Preparing local model: ' + modelId });
        const worker = new Worker(new URL('./roleFit.worker.js', import.meta.url), { type: 'module' });
        workerReference.current = worker;
        try {
          const engine = await awaitRoleFitModelReady({
            signal: activeAbortReference.current?.signal,
            start: initProgressCallback => CreateWebWorkerMLCEngine(worker, modelId, {
              initProgressCallback, logLevel: 'ERROR',
            }),
            onProgress: report => {
              if (gate.isCurrent(revision) && workerReference.current === worker) {
                dispatch({ type: 'progress', message: report?.progress >= 1
                  ? 'Finalizing local model initialization…'
                  : progressMessage(report) });
              }
            },
          });
          if (!gate.isCurrent(revision) || workerReference.current !== worker) {
            try { void engine.unload?.()?.catch?.(() => undefined); } catch { /* best effort */ }
            worker.terminate();
            throw new Error('Superseded local-model request');
          }
          engineReference.current = { instance: engine, modelId };
          return { engine, modelId };
        } catch (error) {
          worker.terminate();
          if (workerReference.current === worker) workerReference.current = null;
          previousError = error;
          // Repeated download attempts after a network failure add cost but
          // do not improve accuracy. A smaller model may help with GPU/OOM.
          if (!gate.isCurrent(revision) ||
              classifyRoleFitAIError(error, 'load').code === 'download_failed') throw error;
        }
      }
      throw previousError ?? new Error(copy.errors.missingModel);
    })();
    enginePromiseReference.current = { revision, promise };
    try { return await promise; }
    finally {
      if (enginePromiseReference.current?.promise === promise) enginePromiseReference.current = null;
    }
  };

  const analyzeRole = () => {
    const error = getJobDescriptionErrorMessage(roleFitState.jobDescription);
    if (error) { dispatch({ type: 'invalid', value: error }); return; }
    // A new click always launches a new AI request, even if a previous
    // mechanical assessment or an in-flight AI result already exists.
    invalidatePendingAI();
    const gate = gateReference.current;
    const revision = gate.current();
    const hasModel = supportsLocalAI();
    activeRunReference.current = hasModel ? revision : null;
    const controller = hasModel ? new AbortController() : null;
    activeAbortReference.current = controller;
    let selectedModelId = '';
    void runRoleFitAnalyses({
      jobDescription: roleFitState.jobDescription, gate, revision,
      onMechanical: (result) => dispatch({ type: 'analyzed', result, hasModel }),
      producer: hasModel ? async (context) => {
        let stage = 'input';
        try {
          const request = buildRoleFitMarkdownRequest({
            jobText: context.jobText, resumeMarkdown: resumeRoleFitText,
          });
          const result = await runRoleFitWithFallback({
            signal: controller.signal,
            loadModel: async excludedIds => {
              stage = 'load';
              const loaded = await loadEngine(revision, excludedIds);
              selectedModelId = loaded.modelId;
              return loaded;
            },
            generate: async ({ engine }) => {
              stage = 'generation';
              if (!gate.isCurrent(revision) || controller.signal.aborted) {
                throw new RoleFitStreamError('generation_aborted');
              }
              const generated = await streamRoleFitAI({
                createCompletion: options => engine.chat.completions.create(options),
                request: { messages: request.messages, ...roleFitMarkdownGenerationOptions },
                signal: controller.signal,
                onProgress: message => {
                  if (gate.isCurrent(revision)) dispatch({ type: 'progress', message });
                },
              });
              return {
                text: generated.text,
                finishReason: generated.finishReason,
              };
            },
            dispose: () => stopModel({ workerReference, engineReference, enginePromiseReference }),
            onRetry: () => {
              if (gate.isCurrent(revision)) dispatch({
                type: 'progress',
                message: 'First model was too slow to begin generation. Trying a smaller local model…',
              });
            },
          });
          return result;
        } catch (cause) {
          // A WebLLM Worker may remain blocked after a timeout; do not reuse it.
          if (gate.isCurrent(revision) && (stage === 'generation' || cause?.code === 'first_token_timeout')) {
            stopModel({ workerReference, engineReference, enginePromiseReference });
          }
          throw { stage: cause?.code === 'first_token_timeout' ? 'generation' : stage, cause };
        }
      } : undefined,
      onAI: (result) => dispatch({ type: 'aiReady', result, modelId: selectedModelId }),
      onError: error => {
        const cause = error?.cause ?? error;
        const partial = typeof cause?.partialText === 'string' ? cause.partialText.slice(0, 8000) : '';
        const classification = classifyRoleFitAIError(cause, error?.stage);
        // Keep the complete bounded runtime diagnostic in the local console,
        // not the UI or application state. It may contain job-posting text:
        // never forward it to analytics or remote error reporting.
        console.error('[AI Lab] Local model failure', {
          modelId: selectedModelId, ...classification,
          details: formatRoleFitAIErrorDetails(cause),
        });
        dispatch({ type: 'aiFailed', modelId: selectedModelId,
          failure: { ...classification, ...(partial ? { partialOutput: partial } : {}) } });
      },
    }).finally(() => {
      if (activeRunReference.current === revision) {
        activeRunReference.current = null;
        if (activeAbortReference.current === controller) activeAbortReference.current = null;
      }
    });
  };

  const handleJobDescriptionKeyDown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      analyzeRole();
    }
  };
  return {
    roleFitState,
    maximumJobDescriptionLength,
    updateJobDescription,
    resetRoleFit,
    handleGenerateClick: analyzeRole,
    handleJobDescriptionKeyDown,
    canRunAI,
    submitButtonLabel: copy.buttonLabels.analyze,
    browserSupportMessage: canRunAI ? copy.browserSupport.ready : copy.browserSupport.unavailable,
  };
};
