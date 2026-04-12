import { roleFitLabSectionContent } from "../../content/roleFitLabContent";
import Spinner from "../Spinner";
import { emailLink } from "../../utils/profile";
import { useRoleFitLab } from "./useRoleFitLab";

export default function RoleFitSection() {
  const {
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
  } = useRoleFitLab();

  return (
    <div className="roleFitLabShell">
      <div className="roleFitLabIntro">
        <p className="roleFitSectionEyebrow">
          {roleFitLabSectionContent.eyebrow}
        </p>
        <span className="roleFitBadge">{roleFitLabSectionContent.badge}</span>
        <p className="roleFitLead">
          {roleFitLabSectionContent.lead}
        </p>
        {browserSupportMessage ? (
          <div className="roleFitMeta">
            <span className="roleFitMetaLabel">
              {roleFitLabSectionContent.noteLabel}
            </span>
            <span>{browserSupportMessage}</span>
          </div>
        ) : null}
      </div>

      <div className="aiPart roleFitForm">
        <div className="roleFitInputCard">
          <div className="roleFitFieldHeader">
            <label className="roleFitFieldLabel" htmlFor="jobDescription">
              {roleFitLabSectionContent.inputLabel}
            </label>
            <span className="roleFitCounter">
              {roleFitState.jobDescription.length}/{maximumJobDescriptionLength}
            </span>
          </div>
          <p className="roleFitFieldHint">
            {roleFitLabSectionContent.fieldHint}
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
            placeholder={roleFitLabSectionContent.placeholder}
            spellCheck={false}
            value={roleFitState.jobDescription}
          />
          <p className="roleFitFooterMeta">
            {engineStatusMessage}
          </p>
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
          <p className="roleFitResultEyebrow">
            {roleFitLabSectionContent.resultEyebrow}
          </p>
          <pre aria-live="polite" className="roleFitOutput">
            {roleFitState.result}
          </pre>
        </article>
      ) : null}

      <div className="aiPart roleFitFooter">
        <p className="roleFitFooterText">
          {roleFitLabSectionContent.contactPrompt}{" "}
          <a className="roleFitContactLink" href={emailLink}>
            {roleFitLabSectionContent.contactLinkLabel}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
