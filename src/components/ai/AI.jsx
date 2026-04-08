import { useEffect, useReducer, useRef, useState } from "react";
import {
  CreateWebWorkerMLCEngine,
  prebuiltAppConfig,
} from "@mlc-ai/web-llm";
import Spinner from "../Spinner";
import { emailLink } from "../../utils/profile";
import {
  buildRoleFitMessages,
  maximumJobDescriptionLength,
  selectRoleFitModelId,
} from "../../utils/roleFit";

const defaultStatusMessage =
  "";
const readyStatusMessage =
  "Local AI is ready. Press Enter to generate, or use Shift+Enter for a new line.";

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
  statusMessage: defaultStatusMessage,
};

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
          ? readyStatusMessage
          : defaultStatusMessage,
      };
    default:
      return state;
  }
};

const getBrowserSupportMessage = () => {
  if (typeof window === "undefined") {
    return defaultStatusMessage;
  }

  if (typeof window.Worker === "undefined") {
    return "This browser does not support the worker needed for the local AI.";
  }

  if (typeof navigator === "undefined" || !navigator.gpu) {
    return "This feature needs WebGPU, so it works best on recent Chrome or Edge desktop browsers.";
  }

  return "Your pasted job description stays in the browser. The first use need to download the model which may take some time.";
};

const getJobDescriptionErrorMessage = (jobDescription) => {
  const normalizedJobDescription = jobDescription.trim();

  if (!normalizedJobDescription) {
    return "Paste a job description first.";
  }

  if (normalizedJobDescription.length < 80) {
    return "Add a little more detail so the local AI has enough context.";
  }

  return "";
};

const normalizeJobDescription = (jobDescription) =>
  jobDescription.replace(/\s+/g, " ").trim();

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

  return `Loading local AI${progressPercentage}`;
};

const getAssistantText = (responseContent) => {
  if (typeof responseContent === 'string') {
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
    return "The model files could not be downloaded on this connection.";
  }

  if (/gpu|webgpu|support|shader/i.test(errorMessage)) {
    return "This browser could not start the local AI model. Try a recent Chrome or Edge desktop build.";
  }

  return errorMessage || "The local AI could not analyze this role on this device.";
};

const getSubmitButtonLabel = ({ isGenerating, isLoadingEngine }) => {
  if (isLoadingEngine) {
    return "Loading local AI";
  }

  if (isGenerating) {
    return "Analyzing role";
  }

  return "Analyze";
};

const supportsLocalAi = () =>
  typeof window !== "undefined" &&
  typeof window.Worker !== "undefined" &&
  typeof navigator !== "undefined" &&
  Boolean(navigator.gpu);

export default function RoleFitSection() {
  const engineReference = useRef(null);
  const engineLoadPromiseReference = useRef(null);
  const generationLockReference = useRef(false);
  const workerReference = useRef(null);
  const [ browserSupportMessage, setBrowserSupportMessage ] =
    useState(defaultStatusMessage);
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
      throw new Error("No compatible local model was found.");
    }

    const loadPromise = (async () => {
      dispatch({
        payload: "Preparing the local AI model...",
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
            statusMessage: readyStatusMessage,
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

    if (!supportsLocalAi()) {
      dispatch({
        payload:
          "This feature needs WebGPU and a worker-enabled browser, ideally recent Chrome or Edge on desktop.",
        type: roleFitActionTypes.fail,
      });
      return;
    }

    dispatch({
      payload: "Analyzing the role with local AI...",
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
        throw new Error("The model returned an empty response.");
      }

      dispatch({
        payload: {
          result,
          statusMessage:
            "Analysis ready. Paste another role and press Enter to compare a new fit.",
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

  return (
    <div className="cardBox flexColumnMobile">
      <div className="aiPart roleFitIntro">
      <span className="roleFitBadge">Local AI</span>
        <br/>
        <br/>
        <p className="roleFitLead">
          Paste a job description and get a grounded explanation of why I may or not fit
          the role.
        </p>
        <div className="roleFitMeta">
          <span>Note: {browserSupportMessage}</span>
        </div>
      </div>

      <div className="aiPart roleFitForm">
        <div className="roleFitInputCard">
          <div className="roleFitFieldHeader">
            <label className="roleFitFieldLabel" htmlFor="jobDescription">
              Job description
            </label>
            <span className="roleFitCounter">
              {roleFitState.jobDescription.length}/{maximumJobDescriptionLength}
            </span>
          </div>
          <p className="roleFitFieldHint">
            Press Enter to generate. Use Shift+Enter if you need a new line.
          </p>
          <textarea
            aria-label="Job description"
            autoComplete="off"
            className="roleFitTextarea"
            id="jobDescription"
            maxLength={maximumJobDescriptionLength}
            name="jobDescription"
            onChange={updateJobDescription}
            onKeyDown={handleJobDescriptionKeyDown}
            placeholder="Paste the role here. I will generate a concise fit summary grounded in the portfolio projects and resume."
            spellCheck={false}
            value={roleFitState.jobDescription}
          />
          {roleFitState.isEngineReady ? (
          <p className="roleFitFooterMeta">
            Loaded model: {roleFitState.modelId}
          </p>
        ) : <p className="roleFitFooterMeta">{roleFitState.statusMessage}</p>}
        {roleFitState.errorMessage ? (
          <div className="roleFitError" role="status">
            {roleFitState.errorMessage}
          </div>
        ) : null}
          <div className="roleFitActions">
            <button
              className="aiButton roleFitSecondaryButton"
              disabled={isBusy}
              onClick={resetRoleFit}
              type="button"
            >
              Reset
            </button>
            <button
              className="aiButton roleFitPrimaryButton"
              disabled={isBusy}
              onClick={handleGenerateClick}
              type="button"
            >
              <span className="roleFitButtonContent">
                {isBusy ? <Spinner /> : null}
                <span>{submitButtonLabel}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {roleFitState.result ? (
        <article className="aiPart roleFitResultCard">
          <p className="roleFitResultEyebrow">Generated fit</p>
          <pre aria-live="polite" className="roleFitOutput">
            {roleFitState.result}
          </pre>
        </article>
      ) : null}

      <div className="aiPart roleFitFooter">
        <p className="roleFitFooterText">
          Prefer a tailored response instead?{" "}
          <a className="roleFitContactLink" href={emailLink}>
            Send me the role directly
          </a>
          .
        </p>
      </div>
    </div>
  );
}
