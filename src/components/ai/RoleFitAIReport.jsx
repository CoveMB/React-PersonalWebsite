import { useEffect, useRef } from 'react';
import { roleFitAiFailureMessages } from '../../content/roleFitLabContent';

const groups = [
  { key: 'direct', title: 'Directly demonstrated' },
  { key: 'transferable', title: 'Transferable experience' },
  { key: 'notEstablished', title: 'Not established' },
];

// Render only inert text plus simple inline Markdown styling, never HTML.
function InlineMarkdown({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((chunk, index) =>
    chunk.startsWith('**') && chunk.endsWith('**')
      ? <strong key={index}>{chunk.slice(2, -2)}</strong>
      : chunk);
}

export default function RoleFitAIReport({
  assessment, status, aiFailure, modelId, progress, analysisId,
}) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, [analysisId]);
  const ready = status === 'ready' &&
    (assessment?.kind === 'accepted' || assessment?.kind === 'unstructured');
  const structured = ready && assessment.kind === 'accepted';
  const unstructured = ready && assessment.kind === 'unstructured';
  const hasUnusableResponse = status === 'invalid' && Boolean(assessment?.rawModelOutput);

  return (
    <article className="aiPart roleFitResultCard" aria-labelledby="role-fit-ai-heading">
      <p className="roleFitResultEyebrow">Experimental on-device language model</p>
      <h3 id="role-fit-ai-heading" className="roleFitReportTitle" ref={headingRef} tabIndex={-1}>AI assessment</h3>
      <p className="roleFitEvidenceDisclaimer">
        This is the local model's own unverified reading of the job and published Markdown résumé.
        No claim-level evidence validation is applied to its wording. Compare the independent evidence assessment below.
      </p>
      {modelId ? <p className="roleFitValidationNotice">Local model: {modelId}</p> : null}
      {status === 'running' ? (
        <p className="roleFitAIProgress" role="status" aria-live="polite">
          {progress || 'Preparing the on-device AI assessment…'} The independent evidence report is available below.
        </p>
      ) : null}
      {status === 'unavailable' ? (
        <p className="roleFitAIProgress" role="status">
          On-device AI requires WebGPU and Worker support in this browser. No AI-generated assessment is available.
        </p>
      ) : null}
      {status === 'failed' || status === 'invalid' || status === 'empty' ? (
        <p className="roleFitAIProgress" role="status">
          {roleFitAiFailureMessages[aiFailure?.code] ?? 'The local AI result could not be used.'}
          {' '}The independent evidence report below is unaffected.
        </p>
      ) : null}
      {structured ? (
        <div className="roleFitThreeWayGrid">
          {groups.map(group => (
            <section className="roleFitReportSection roleFitThreeWayGroup" key={group.key} aria-label={group.title}>
              <h4>{group.title}</h4>
              {assessment.sections[group.key].length ? (
                <ul className="roleFitRequirementList">
                  {assessment.sections[group.key].map((note, index) => (
                    <li key={index} className="roleFitRequirementItem">
                      <p className="roleFitModelNote">
                        <span className="roleFitModelNoteLabel">Local AI interpretation · unverified wording</span>
                        <InlineMarkdown text={note} />
                      </p>
                    </li>
                  ))}
                </ul>
              ) : <p className="roleFitEmptyGroup">The model did not provide a statement in this section.</p>}
            </section>
          ))}
        </div>
      ) : null}
      {structured && assessment.missingSections.length ? (
        <p className="roleFitValidationNotice">
          The model left one or more sections empty. This does not establish the absence of relevant experience.
        </p>
      ) : null}
      {unstructured ? (
        <div className="roleFitReportSection">
          <h4>Unstructured model response (unverified)</h4>
          <p className="roleFitEvidenceDisclaimer">
            The model did not follow the requested Markdown headings.
            Its wording is shown without assigning it to an evidence category.
          </p>
          <pre className="roleFitOutput">{assessment.rawModelOutput}</pre>
        </div>
      ) : null}
      {status === 'failed' && aiFailure?.partialOutput ? (
        <details className="roleFitInventory roleFitAiDiagnostic" open>
          <summary>Incomplete model output (unverified)</summary>
          <p className="roleFitEvidenceDisclaimer">
            Generation ended before a complete answer was available. This is unverified partial text.
            It may repeat the pasted job description; review before sharing.
          </p>
          <pre className="roleFitOutput">{aiFailure.partialOutput}</pre>
        </details>
      ) : null}
      {hasUnusableResponse ? (
        <details className="roleFitInventory roleFitAiDiagnostic" open>
          <summary>Incomplete or unusable Markdown output</summary>
          <p className="roleFitEvidenceDisclaimer">
            The model's original text is shown for inspection, not as a verified assessment.
            It may repeat the job description; review before sharing.
          </p>
          <pre className="roleFitOutput">{assessment.rawModelOutput}</pre>
        </details>
      ) : null}
      {(status === 'failed' || status === 'invalid' || status === 'empty') ? (
        <details className="roleFitInventory roleFitAiDiagnostic">
          <summary>Technical diagnostic (error codes only)</summary>
          <p>Failure: <code>{aiFailure?.code ?? 'unknown'}</code>.
            {' '}Stage: <code>{aiFailure?.stage ?? 'validation'}</code>.
            {' '}Detailed local runtime errors are available in the browser console.</p>
        </details>
      ) : null}
    </article>
  );
}
