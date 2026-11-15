import { useEffect, useReducer, useRef, useState } from "react";
import { roleFitLabMessageContent as copy } from "../../content/roleFitLabContent";
import { maximumJobDescriptionLength, buildRoleFitEnhancementRequest,
  validateRoleFitEnhancement, applyRoleFitEnhancement, selectRoleFitModelId,
  getRolePostingValidationCode } from "../../utils/roleFit";
import { normalizeRolePosting, parseRoleRequirements } from "../../utils/roleFitRequirements.mjs";
import { getRoleFitEvidenceCatalog } from "../../utils/roleFitEvidence.mjs";
import { matchRoleRequirements } from "../../utils/roleFitMatching.mjs";
import { buildRoleFitAssessment } from "../../utils/roleFitAssessment.mjs";
import { createRoleFitRevisionGuard, enhanceRoleFitWith } from "../../utils/roleFitEnhancement.mjs";

const initialState = {
  jobDescription: "", result: null, errorMessage: "", statusMessage: "",
  modelId: "", isEnhancing: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "edit": return { ...state, jobDescription: action.value, result: null,
      errorMessage: "", statusMessage: "", isEnhancing: false };
    case "reset": return { ...initialState, modelId: state.modelId };
    case "invalid": return { ...state, errorMessage: action.value };
    case "analyzed": return { ...state, result: action.result, errorMessage: "",
      statusMessage: copy.statusMessages.success, isEnhancing: false };
    case "enhancing": return { ...state, isEnhancing: true, errorMessage: "",
      statusMessage: copy.statusMessages.loading };
    case "progress": return { ...state, statusMessage: action.message };
    case "enhanced": return { ...state, result: action.result, isEnhancing: false,
      modelId: action.modelId, statusMessage: copy.statusMessages.enhanced };
    case "enhancementStopped": return { ...state, isEnhancing: false,
      errorMessage: action.error || "", statusMessage: action.message };
    default: return state;
  }
};

const canRunLocalModel = () => typeof window !== "undefined" &&
  typeof window.Worker !== "undefined" &&
  typeof navigator !== "undefined" && Boolean(navigator.gpu);

export const getJobDescriptionErrorMessage = (input) => {
  const code = getRolePostingValidationCode(input);
  return code === "too_long" ? copy.errors.tooLong
    : code === "empty" ? copy.errors.missingJobDescription : "";
};
const assistantText = (content) => typeof content === "string" ? content.trim()
  : Array.isArray(content) ? content.map((part) => typeof part === "string" ? part : part?.text ?? "").join("").trim() : "";
const progressMessage = (report) => {
  const percentage = Number.isFinite(report?.progress) ? ` (${Math.round(report.progress * 100)}%)` : "";
  return `${report?.text || copy.statusMessages.loading}${percentage}`;
};

export const useRoleFitLab = () => {
  const [roleFitState, dispatch] = useReducer(reducer, initialState);
  const [canEnhance, setCanEnhance] = useState(false);
  const gateReference = useRef(createRoleFitRevisionGuard());
  const engineReference = useRef(null);
  const enginePromiseReference = useRef(null);
  const workerReference = useRef(null);
  const enhancingRevisionReference = useRef(null);

  useEffect(() => {
    // StrictMode invokes cleanup/setup twice in development. The second setup
    // must receive a fresh, active revision gate.
    gateReference.current = createRoleFitRevisionGuard();
    setCanEnhance(canRunLocalModel());
    return () => {
      gateReference.current.dispose();
      enhancingRevisionReference.current = null;
      enginePromiseReference.current = null;
      try { void engineReference.current?.instance?.unload?.(); } catch { /* best effort */ }
      engineReference.current = null;
      workerReference.current?.terminate();
      workerReference.current = null;
    };
  }, []);

  const updateJobDescription = (event) => {
    gateReference.current.bump();
    dispatch({ type: "edit", value: event.target.value });
  };
  const resetRoleFit = () => {
    gateReference.current.bump();
    dispatch({ type: "reset" });
  };
  const analyzeRole = () => {
    const jobDescription = roleFitState.jobDescription;
    const error = getJobDescriptionErrorMessage(jobDescription);
    if (error) { dispatch({ type: "invalid", value: error }); return; }
    gateReference.current.bump();
    const jobText = normalizeRolePosting(jobDescription);
    const requirements = parseRoleRequirements(jobText);
    const evidenceCatalog = getRoleFitEvidenceCatalog();
    const matches = matchRoleRequirements(requirements, evidenceCatalog);
    const result = buildRoleFitAssessment({ jobText, requirements, matches, evidenceCatalog });
    dispatch({ type: "analyzed", result });
  };

  const loadEngine = async (revision) => {
    const gate = gateReference.current;
    if (engineReference.current) return { engine: engineReference.current.instance, modelId: engineReference.current.modelId };
    if (enginePromiseReference.current) return enginePromiseReference.current;
    const promise = (async () => {
      // Dynamic import: the baseline contains no WebGPU or Worker dependency.
      const { CreateWebWorkerMLCEngine, prebuiltAppConfig } = await import("@mlc-ai/web-llm");
      const modelId = selectRoleFitModelId(prebuiltAppConfig.model_list);
      if (!modelId) throw new Error(copy.errors.missingModel);
      const worker = new Worker(new URL("./roleFit.worker.js", import.meta.url), { type: "module" });
      workerReference.current = worker;
      try {
        const engine = await CreateWebWorkerMLCEngine(worker, modelId, {
          initProgressCallback: (report) => {
            if (gate.isCurrent(revision)) dispatch({ type: "progress", message: progressMessage(report) });
          },
          logLevel: "ERROR",
        });
        if (!gate.isCurrent(revision)) {
          void engine.unload?.();
          worker.terminate();
          if (workerReference.current === worker) workerReference.current = null;
          throw new Error("Superseded local-model request");
        }
        // Keep the identifier alongside the engine; no global cache.
        engineReference.current = { instance: engine, modelId };
        return { engine, modelId };
      } catch (error) {
        worker.terminate();
        if (workerReference.current === worker) workerReference.current = null;
        throw error;
      }
    })();
    enginePromiseReference.current = promise;
    try { return await promise; } finally { if (enginePromiseReference.current === promise) enginePromiseReference.current = null; }
  };

  const enhanceRole = async () => {
    if (!roleFitState.result || !canEnhance || roleFitState.isEnhancing) return;
    const gate = gateReference.current;
    const revision = gate.current();
    if (enhancingRevisionReference.current === revision) return;
    enhancingRevisionReference.current = revision;
    const jobText = normalizeRolePosting(roleFitState.jobDescription);
    const requirements = parseRoleRequirements(jobText);
    const evidenceCatalog = getRoleFitEvidenceCatalog();
    const context = { jobText, requirements, evidenceCatalog };
    let chosenModelId = "";
    dispatch({ type: "enhancing" });
    const outcome = await enhanceRoleFitWith({
      baseline: roleFitState.result, gate, revision,
      producer: async () => {
        const loaded = await loadEngine(revision);
        chosenModelId = loaded.modelId;
        if (!gate.isCurrent(revision)) return "";
        const response = await loaded.engine.chat.completions.create({
          messages: buildRoleFitEnhancementRequest(context).messages,
          max_tokens: 420,
          temperature: 0.1,
        });
        return assistantText(response?.choices?.[0]?.message?.content);
      },
      validate: (raw) => validateRoleFitEnhancement(raw, context),
      apply: (baseline, suggestions) => applyRoleFitEnhancement(baseline, suggestions, context),
    });
    if (enhancingRevisionReference.current === revision) enhancingRevisionReference.current = null;
    if (!gate.isCurrent(revision)) return;
    if (outcome.status === "applied") dispatch({ type: "enhanced", result: outcome.assessment, modelId: chosenModelId });
    else dispatch({ type: "enhancementStopped",
      error: outcome.status === "failed" ? copy.errors.enhancementFailed : "",
      message: outcome.status === "failed" ? copy.statusMessages.baselinePreserved : copy.statusMessages.noNewEvidence });
  };

  const handleJobDescriptionKeyDown = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
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
    enhanceRole,
    canEnhance,
    isBusy: roleFitState.isEnhancing,
    submitButtonLabel: copy.buttonLabels.analyze,
    browserSupportMessage: canEnhance ? copy.browserSupport.ready : copy.browserSupport.unavailable,
    engineStatusMessage: roleFitState.statusMessage,
  };
};
