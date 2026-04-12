import { useEffect, useReducer, useRef, useState } from "react";
import {
  CreateWebWorkerMLCEngine,
  prebuiltAppConfig,
} from "@mlc-ai/web-llm";
import {
  roleFitLabMessageContent,
} from "../../content/roleFitLabContent";
import {
  buildRoleFitMessages,
  maximumJobDescriptionLength,
  selectRoleFitModelId,
} from "../../utils/roleFit";

const roleFitActionTypes = {
  fail: "fail",
  ready: "ready",
  reset: "reset",
  setStatus: "setStatus",
  startGeneration: "startGeneration",
  startLoading: "startLoading",
  succeed: "succeed",
  updateJobDescription: "updateJobDescription",
};

const initialRoleFitState = {
  errorMessage: "",
  isEngineReady: false,
  isGenerating: false,
  isLoadingEngine: false,
  jobDescription: "",
  modelId: "",
  result: "",
  statusMessage: roleFitLabMessageContent.statusMessages.default,
};

const normalizeJobDescription = (jobDescription) =>
  jobDescription.replace(/\s+/g, " ").trim();

const getBrowserSupportMessage = () => {
  if (typeof window === "undefined") {
    return roleFitLabMessageContent.statusMessages.default;
  }

  if (typeof window.Worker === "undefined") {
    return roleFitLabMessageContent.browserSupport.missingWorker;
  }

  if (typeof navigator === "undefined" || !navigator.gpu) {
    return roleFitLabMessageContent.browserSupport.missingWebGpu;
  }

  return roleFitLabMessageContent.browserSupport.ready;
};

const getEngineStatusMessage = ({ isEngineReady, modelId, statusMessage }) => {
  if (isEngineReady) {
    return `${roleFitLabMessageContent.labels.loadedModel}: ${modelId}`;
  }

  return statusMessage;
};

const getJobDescriptionErrorMessage = (jobDescription) => {
  const normalizedJobDescription = jobDescription.trim();

  if (!normalizedJobDescription) {
    return roleFitLabMessageContent.errors.missingJobDescription;
  }

  if (normalizedJobDescription.length < 80) {
    return roleFitLabMessageContent.errors.shortJobDescription;
  }

  return "";
};

const createRoleFitWorker = () =>
  new Worker(new URL("./roleFit.worker.js", import.meta.url), {
    type: "module",
  });

const destroyRoleFitWorker = (workerReference) => {
  workerReference.current?.terminate?.();
  workerReference.current = null;
};

const getProgressMessage = ({ progress, text }) => {
  const progressPercentage = Number.isFinite(progress)
    ? ` (${Math.round(progress * 100)}%)`
    : "";

  if (text) {
    return `${text}${progressPercentage}`;
  }

  return `${roleFitLabMessageContent.statusMessages.loading}${progressPercentage}`;
};

const getAssistantText = (responseContent) => {
  if (typeof responseContent === "string") {
    return responseContent.trim();
  }

  if (!Array.isArray(responseContent)) {
    return "";
  }

  return responseContent
    .map((contentPart) => {
      if (typeof contentPart === "string") {
        return contentPart;
      }

      return contentPart?.text ?? "";
    })
    .join("")
    .trim();
};

const getGenerationFailureMessage = (error) => {
  const errorMessage = error instanceof Error ? error.message : "";

  if (/fetch|network/i.test(errorMessage)) {
    return roleFitLabMessageContent.errors.downloadFailed;
  }

  if (/gpu|webgpu|support|shader/i.test(errorMessage)) {
    return roleFitLabMessageContent.errors.incompatibleBrowser;
  }

  return (
    errorMessage || roleFitLabMessageContent.errors.genericGenerationFailure
  );
};

const getSubmitButtonLabel = ({ isGenerating, isLoadingEngine }) => {
  if (isLoadingEngine) {
    return roleFitLabMessageContent.buttonLabels.loading;
  }

  if (isGenerating) {
    return roleFitLabMessageContent.buttonLabels.running;
  }

  return roleFitLabMessageContent.buttonLabels.analyze;
};

const supportsLocalRoleFit = () =>
  typeof window !== "undefined" &&
  typeof window.Worker !== "undefined" &&
  typeof navigator !== "undefined" &&
  Boolean(navigator.gpu);

const reducer = (state, { payload, type }) => {
  switch (type) {
    case roleFitActionTypes.updateJobDescription:
      return { ...state, errorMessage: "", jobDescription: payload };
    case roleFitActionTypes.startLoading:
      return {
        ...state,
        errorMessage: "",
        isLoadingEngine: true,
        statusMessage: payload,
      };
    case roleFitActionTypes.ready:
      return {
        ...state,
        errorMessage: "",
        isEngineReady: true,
        isLoadingEngine: false,
        modelId: payload.modelId,
        statusMessage: payload.statusMessage,
      };
    case roleFitActionTypes.startGeneration:
      return {
        ...state,
        errorMessage: "",
        isGenerating: true,
        result: "",
        statusMessage: payload,
      };
    case roleFitActionTypes.succeed:
      return {
        ...state,
        errorMessage: "",
        isGenerating: false,
        result: payload.result,
        statusMessage: payload.statusMessage,
      };
    case roleFitActionTypes.fail:
      return {
        ...state,
        errorMessage: payload,
        isGenerating: false,
        isLoadingEngine: false,
      };
    case roleFitActionTypes.setStatus:
      return { ...state, statusMessage: payload };
    case roleFitActionTypes.reset:
      return {
        ...state,
        errorMessage: "",
        isGenerating: false,
        jobDescription: "",
        result: "",
        statusMessage: state.isEngineReady
          ? roleFitLabMessageContent.statusMessages.ready
          : roleFitLabMessageContent.statusMessages.default,
      };
    default:
      return state;
  }
};

export const useRoleFitLab = () => {
  const engineReference = useRef(null);
  const engineLoadPromiseReference = useRef(null);
  const generationLockReference = useRef(false);
  const workerReference = useRef(null);
  const [ browserSupportMessage, setBrowserSupportMessage ] =
    useState(roleFitLabMessageContent.statusMessages.default);
  const [ roleFitState, dispatch ] = useReducer(reducer, initialRoleFitState);

  useEffect(() => {
    setBrowserSupportMessage(getBrowserSupportMessage());

    return () => {
      engineReference.current?.unload?.().catch(() => undefined);
      engineLoadPromiseReference.current = null;
      generationLockReference.current = false;
      destroyRoleFitWorker(workerReference);
    };
  }, []);

  const updateJobDescription = (event) => {
    dispatch({
      payload: event.target.value,
      type: roleFitActionTypes.updateJobDescription,
    });
  };

  const resetRoleFit = () => {
    dispatch({ type: roleFitActionTypes.reset });
  };

  const loadRoleFitEngine = async () => {
    if (engineReference.current) {
      return engineReference.current;
    }

    if (engineLoadPromiseReference.current) {
      return engineLoadPromiseReference.current;
    }

    const modelId = selectRoleFitModelId(prebuiltAppConfig.model_list);

    if (!modelId) {
      throw new Error(roleFitLabMessageContent.errors.missingModel);
    }

    const loadPromise = (async () => {
      dispatch({
        payload: roleFitLabMessageContent.statusMessages.loading,
        type: roleFitActionTypes.startLoading,
      });

      destroyRoleFitWorker(workerReference);
      workerReference.current = createRoleFitWorker();

      try {
        const nextEngine = await CreateWebWorkerMLCEngine(
          workerReference.current,
          modelId,
          {
            initProgressCallback: (progressReport) => {
              dispatch({
                payload: getProgressMessage(progressReport),
                type: roleFitActionTypes.setStatus,
              });
            },
            logLevel: "ERROR",
          },
        );

        engineReference.current = nextEngine;

        dispatch({
          payload: {
            modelId,
            statusMessage: roleFitLabMessageContent.statusMessages.ready,
          },
          type: roleFitActionTypes.ready,
        });

        return nextEngine;
      } catch (error) {
        destroyRoleFitWorker(workerReference);
        throw error;
      } finally {
        engineLoadPromiseReference.current = null;
      }
    })();

    engineLoadPromiseReference.current = loadPromise;
    return loadPromise;
  };

  const generateRoleFit = async () => {
    if (generationLockReference.current) {
      return;
    }

    const validationErrorMessage = getJobDescriptionErrorMessage(
      roleFitState.jobDescription,
    );

    if (validationErrorMessage) {
      dispatch({
        payload: validationErrorMessage,
        type: roleFitActionTypes.fail,
      });
      return;
    }

    if (!supportsLocalRoleFit()) {
      dispatch({
        payload: roleFitLabMessageContent.errors.browserUnsupported,
        type: roleFitActionTypes.fail,
      });
      return;
    }

    dispatch({
      payload: roleFitLabMessageContent.statusMessages.generating,
      type: roleFitActionTypes.startGeneration,
    });
    generationLockReference.current = true;

    try {
      const roleFitEngine = await loadRoleFitEngine();
      const normalizedJobDescription = normalizeJobDescription(
        roleFitState.jobDescription,
      );
      const response = await roleFitEngine.chat.completions.create({
        max_tokens: 320,
        messages: buildRoleFitMessages(normalizedJobDescription),
        temperature: 0.3,
      });
      const result = getAssistantText(response?.choices?.[0]?.message?.content);

      if (!result) {
        throw new Error(roleFitLabMessageContent.errors.emptyResponse);
      }

      dispatch({
        payload: {
          result,
          statusMessage: roleFitLabMessageContent.statusMessages.success,
        },
        type: roleFitActionTypes.succeed,
      });
    } catch (error) {
      dispatch({
        payload: getGenerationFailureMessage(error),
        type: roleFitActionTypes.fail,
      });
    } finally {
      generationLockReference.current = false;
    }
  };

  const isBusy = roleFitState.isGenerating || roleFitState.isLoadingEngine;
  const engineStatusMessage = getEngineStatusMessage(roleFitState);
  const submitButtonLabel = getSubmitButtonLabel(roleFitState);

  const handleGenerateClick = () => {
    if (isBusy) {
      return;
    }

    void generateRoleFit();
  };

  const handleJobDescriptionKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    handleGenerateClick();
  };

  return {
    browserSupportMessage,
    engineStatusMessage,
    handleGenerateClick,
    handleJobDescriptionKeyDown,
    isBusy,
    maximumJobDescriptionLength,
    resetRoleFit,
    roleFitState,
    submitButtonLabel,
    updateJobDescription,
  };
};
