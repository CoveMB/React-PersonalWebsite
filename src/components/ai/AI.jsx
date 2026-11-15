import { roleFitLabSectionContent } from "../../content/roleFitLabContent";
import { emailLink } from "../../utils/profile";
import RoleFitReport from "./RoleFitReport";
import { useRoleFitLab } from "./useRoleFitLab";

export default function RoleFitSection() {
  const {
    browserSupportMessage, engineStatusMessage, handleGenerateClick,
    handleJobDescriptionKeyDown, isBusy, maximumJobDescriptionLength,
    resetRoleFit, roleFitState, submitButtonLabel, updateJobDescription,
    enhanceRole, canEnhance,
  } = useRoleFitLab();
  const tooLong = roleFitState.jobDescription.length > maximumJobDescriptionLength;
  return (
    <div className="roleFitLabShell">
      <div className="roleFitLabIntro">
        <p className="roleFitSectionEyebrow">{roleFitLabSectionContent.eyebrow}</p>
        <span className="roleFitBadge">{roleFitLabSectionContent.badge}</span>
        <p className="roleFitLead">{roleFitLabSectionContent.lead}</p>
        <div className="roleFitMeta">
          <span className="roleFitMetaLabel">{roleFitLabSectionContent.noteLabel}</span>
          <span>{browserSupportMessage}</span>
        </div>
      </div>
      <div className="aiPart roleFitForm">
        <div className="roleFitInputCard">
          <div className="roleFitFieldHeader">
            <label className="roleFitFieldLabel" htmlFor="jobDescription">{roleFitLabSectionContent.inputLabel}</label>
            <span className={`roleFitCounter${tooLong ? " roleFitCounterOverLimit" : ""}`}>
              {roleFitState.jobDescription.length}/{maximumJobDescriptionLength}
            </span>
          </div>
          <p id="role-fit-hint" className="roleFitFieldHint">{roleFitLabSectionContent.fieldHint}</p>
          <textarea
            aria-describedby="role-fit-hint" aria-invalid={tooLong}
            autoComplete="off" className="roleFitTextarea" id="jobDescription"
            name="jobDescription" onChange={updateJobDescription}
            onKeyDown={handleJobDescriptionKeyDown}
            placeholder={roleFitLabSectionContent.placeholder} spellCheck={false}
            value={roleFitState.jobDescription}
          />
          {engineStatusMessage ? <p className="roleFitFooterMeta" role="status" aria-live="polite">{engineStatusMessage}</p> : null}
          {roleFitState.errorMessage ? <p className="roleFitError" role="alert">{roleFitState.errorMessage}</p> : null}
          <div className="roleFitActions">
            <button className="aiButton roleFitSecondaryButton" onClick={resetRoleFit} type="button">Reset</button>
            <button className="aiButton roleFitPrimaryButton" onClick={handleGenerateClick} type="button">{submitButtonLabel}</button>
          </div>
          {roleFitState.result ? (
            <div className="roleFitEnhanceRow">
              <div><strong>{roleFitLabSectionContent.enhancementTitle}</strong><p>{roleFitLabSectionContent.enhancementNote}</p></div>
              <button className="aiButton roleFitSecondaryButton" type="button"
                onClick={enhanceRole} disabled={!canEnhance || isBusy} aria-busy={isBusy}>
                {isBusy ? "Enhancing locally…" : "Enhance locally"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {roleFitState.result ? <RoleFitReport assessment={roleFitState.result} /> : null}
      <div className="aiPart roleFitFooter">
        <p className="roleFitFooterText">{roleFitLabSectionContent.contactPrompt} <a className="roleFitContactLink" href={emailLink}>{roleFitLabSectionContent.contactLinkLabel}</a>.</p>
      </div>
    </div>
  );
}
