import { useEffect, useReducer, useRef, useState } from 'react';
import { roleFitLabMessageContent as copy } from '../../content/roleFitLabContent';
import { maximumJobDescriptionLength, getRolePostingValidationCode, selectRoleFitModelId } from '../../utils/roleFit';
import { buildRoleFitAIRequest, roleFitAIGenerationOptions, runRoleFitAnalyses } from '../../utils/roleFitAI.mjs';
import { createRoleFitRevisionGuard } from '../../utils/roleFitEnhancement.mjs';

const initialState = {
  jobDescription: '', result: null, aiAssessment: null, aiStatus: 'idle',
  errorMessage: '', aiError: '', statusMessage: '', modelId: '', analysisId: 0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'edit': return { ...state, jobDescription: action.value, result: null,
      aiAssessment: null, aiStatus: 'idle', errorMessage: '', aiError: '', statusMessage: '' };
    case 'reset': return { ...initialState, analysisId: state.analysisId };
    case 'invalid': return { ...state, errorMessage: action.value };
    case 'analyzed': return { ...state, result: action.result, aiAssessment: null,
      aiStatus: action.hasModel ? 'running' : 'unavailable', modelId: '', errorMessage: '', aiError: '',
      statusMessage: action.hasModel ? copy.statusMessages.loading : '',
      analysisId: state.analysisId + 1 };
    case 'progress': return { ...state, statusMessage: action.message };
    case 'aiReady': return { ...state, aiAssessment: action.result, aiStatus: action.result.kind === 'empty' ? 'empty' : 'ready',
      statusMessage: '', aiError: '', modelId: action.modelId };
    case 'aiFailed': return { ...state, aiStatus: 'failed', aiError: copy.errors.modelFailed, statusMessage: '' };
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
const assistantText = (content) => typeof content === 'string' ? content.trim()
  : Array.isArray(content) ? content.map((part) => typeof part === 'string' ? part : part?.text ?? '').join('').trim() : '';
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

  useEffect(() => {
    // React StrictMode cleans up and re-runs this effect in development.
    gateReference.current = createRoleFitRevisionGuard();
    setCanRunAI(supportsLocalAI());
    return () => {
      gateReference.current.dispose();
      activeRunReference.current = null;
      stopModel({ workerReference, engineReference, enginePromiseReference });
    };
  }, []);

  const invalidatePendingAI = () => {
    gateReference.current.bump();
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

  const loadEngine = async (revision) => {
    const gate = gateReference.current;
    if (engineReference.current) return {
      engine: engineReference.current.instance,
      modelId: engineReference.current.modelId,
    };
    if (enginePromiseReference.current?.revision === revision) return enginePromiseReference.current.promise;
    const promise = (async () => {
      // This module and its worker are loaded only after an Analyze click.
      const { CreateWebWorkerMLCEngine, prebuiltAppConfig } = await import('@mlc-ai/web-llm');
      if (!gate.isCurrent(revision)) throw new Error('Superseded local-model request');
      const modelId = selectRoleFitModelId(prebuiltAppConfig.model_list);
      if (!modelId) throw new Error(copy.errors.missingModel);
      const worker = new Worker(new URL('./roleFit.worker.js', import.meta.url), { type: 'module' });
      workerReference.current = worker;
      try {
        const engine = await CreateWebWorkerMLCEngine(worker, modelId, {
          initProgressCallback: (report) => {
            if (gate.isCurrent(revision)) dispatch({ type: 'progress', message: progressMessage(report) });
          },
          logLevel: 'ERROR',
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
        throw error;
      }
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
    let selectedModelId = '';
    void runRoleFitAnalyses({
      jobDescription: roleFitState.jobDescription, gate, revision,
      onMechanical: (result) => dispatch({ type: 'analyzed', result, hasModel }),
      producer: hasModel ? async (context) => {
        const { engine, modelId } = await loadEngine(revision);
        selectedModelId = modelId;
        if (!gate.isCurrent(revision)) return '';
        const request = buildRoleFitAIRequest(context);
        const response = await engine.chat.completions.create({
          messages: request.messages,
          ...roleFitAIGenerationOptions,
        });
        return {
          text: assistantText(response?.choices?.[0]?.message?.content),
          finishReason: response?.choices?.[0]?.finish_reason,
        };
      } : undefined,
      onAI: (result) => dispatch({ type: 'aiReady', result, modelId: selectedModelId }),
      onError: () => dispatch({ type: 'aiFailed' }),
    }).finally(() => {
      if (activeRunReference.current === revision) activeRunReference.current = null;
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
