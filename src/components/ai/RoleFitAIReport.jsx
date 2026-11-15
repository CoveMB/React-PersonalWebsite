import { useEffect, useRef } from 'react';
import { buildThreeSectionRoleFit } from '../../utils/roleFitAI.mjs';
import { roleFitAiFailureMessages } from '../../content/roleFitLabContent';

const groups = [
  { key: 'direct', title: 'Directly demonstrated' },
  { key: 'transferable', title: 'Transferable experience' },
  { key: 'notEstablished', title: 'Not established' },
];

const rejectedReasonCopy = {
  invalid_json: 'The response is not parseable JSON.',
  invalid_schema: 'The response lacks one or more required category arrays.',
  generation_limit: 'The model reached its output limit before finishing.',
  response_too_long: 'The response exceeded the bounded validation limit.',
  unknown_requirement: 'The requirement ID does not exist in the extracted job posting.',
  requirement_not_provided: 'The model referenced a requirement it was not shown.',
  category_mismatch: 'The claimed category conflicts with the independently sourced classification.',
  duplicate_requirement: 'The same requirement was already accepted.',
  duplicate_note: 'Another accepted statement already makes the same point.',
  invalid_item: 'The model returned an item that was not a valid object.',
  invalid_note_length: 'The statement is missing, too short, or too long.',
  category_limit_exceeded: 'The response exceeded the permitted number of statements for this category.',
  unsupported_technology: 'The statement names technology absent from the requirement and supporting sources.',
  missing_supporting_evidence: 'No eligible public source supports a positive claim.',
  missing_evidence_limitation: 'A missing-evidence claim does not explicitly acknowledge the evidence limitation.',
  unsupported_quantitative_or_credential_claim: 'The statement includes an unsupported duration, metric, or credential.',
  untrusted_citation_or_link: 'The statement includes an unvalidated source reference or external link.',
};

function SelectedNote({ selection, row }) {
  return (
    <li className="roleFitRequirementItem">
      <strong className="roleFitRequirementText">{row?.requirement?.quote ?? selection.id}</strong>
      <p className="roleFitModelNote">
        <span className="roleFitModelNoteLabel">Local AI interpretation · unverified wording</span>
        {selection.note}
      </p>
      {row?.evidence?.length ? (
        <details className="roleFitItemEvidence">
          <summary>Inspect independently selected evidence</summary>
          <ul className="roleFitRequirementList">
            {row.evidence.slice(0, 3).map(source => (
              <li key={source.id}>
                {source.label}{' '}
                {source.sourceUrl ? <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer">View source</a> : null}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </li>
  );
}

export default function RoleFitAIReport({
  assessment, mechanicalAssessment, status, aiFailure, modelId, progress, analysisId,
}) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, [analysisId]);
  const isReady = status === 'ready' && assessment?.kind === 'accepted';
  const rows = Object.values(buildThreeSectionRoleFit(mechanicalAssessment).sections).flat();
  const byId = new Map(rows.map(row => [row.requirementId, row]));
  const rejectedItems = assessment?.rejectedItems ?? [];
  const rejectionReasons = assessment?.rejectionReasons ?? [];
  const hasRejectedResponse = rejectedItems.length > 0 ||
    (status !== 'ready' && Boolean(assessment?.rawModelOutput));

  return (
    <article className="aiPart roleFitResultCard" aria-labelledby="role-fit-ai-heading">
      <p className="roleFitResultEyebrow">Experimental on-device language model</p>
      <h3 id="role-fit-ai-heading" className="roleFitReportTitle" ref={headingRef} tabIndex={-1}>AI assessment</h3>
      <p className="roleFitEvidenceDisclaimer">
        Model-written interpretations are unverified, even when associated with public sources.
        Compare the independent evidence assessment below before relying on them.
      </p>
      {modelId ? <p className="roleFitValidationNotice">Local model: {modelId}</p> : null}
      {status === 'running' ? (
        <p className="roleFitAIProgress" role="status" aria-live="polite">
          {progress || 'Preparing the on-device AI assessment…'} The evidence-based comparison is available below.
        </p>
      ) : null}
      {status === 'unavailable' ? (
        <p className="roleFitAIProgress" role="status">
          On-device AI requires WebGPU and Worker support in this browser. No AI-generated result is available.
        </p>
      ) : null}
      {status === 'failed' || status === 'invalid' || status === 'empty' ? (
        <p className="roleFitAIProgress" role="status">
          {roleFitAiFailureMessages[aiFailure?.code] ?? 'The local AI result could not be validated.'}
          {' '}The independent evidence report below is unaffected.
        </p>
      ) : null}
      {isReady ? (
        <p className="roleFitValidationNotice">
          The model supplied {assessment.selectedCount} accepted interpretation{assessment.selectedCount === 1 ? '' : 's'}.
          {' '}Acceptance checks source associations and format, not every factual implication.
          {assessment.rejectedCount ? ' Some model statements were rejected; see their explanations below.' : ''}
        </p>
      ) : null}
      {isReady ? (
        <div className="roleFitThreeWayGrid">
          {groups.map(group => (
            <section className="roleFitReportSection roleFitThreeWayGroup" key={group.key} aria-label={group.title}>
              <h4>{group.title}</h4>
              {assessment.sections[group.key].length ? (
                <ul className="roleFitRequirementList">
                  {assessment.sections[group.key].map(selection => (
                    <SelectedNote key={selection.id} selection={selection} row={byId.get(selection.id)} />
                  ))}
                </ul>
              ) : <p className="roleFitEmptyGroup">No AI-generated statement was accepted in this category.</p>}
            </section>
          ))}
        </div>
      ) : null}
      {hasRejectedResponse ? (
        <details className="roleFitInventory roleFitAiDiagnostic" open={!isReady}>
          <summary>Rejected model output and reasons{rejectedItems.length ? ' (' + rejectedItems.length + ' items)' : ''}</summary>
          <p className="roleFitEvidenceDisclaimer">
            These checks explain why model wording was withheld; rejection is not proof that a statement is false.
            The raw response is unverified and may repeat text from the pasted job description. Review before sharing.
          </p>
          {rejectedItems.length ? (
            <ul className="roleFitRequirementList">
              {rejectedItems.map((item, index) => (
                <li className="roleFitRequirementItem" key={item.category + '-' + item.id + '-' + index}>
                  <strong className="roleFitRequirementText">{item.category} · {item.id}</strong>
                  <p className="roleFitRationale">{item.reasons.map(reason =>
                    rejectedReasonCopy[reason] ?? reason).join(' ')}</p>
                  {item.note ? <p className="roleFitModelNote">{item.note}</p> : null}
                </li>
              ))}
            </ul>
          ) : rejectionReasons.length ? (
            <p className="roleFitRationale">{rejectionReasons.map(reason =>
              rejectedReasonCopy[reason] ?? roleFitAiFailureMessages[reason] ?? reason).join(' ')}</p>
          ) : null}
          <h4>Original response from the local model (unverified)</h4>
          <pre className="roleFitOutput">{assessment.rawModelOutput}</pre>
          {assessment.rawModelOutputTruncated ? (
            <p className="roleFitRationale">The original response was truncated to 8,000 characters for safe display.</p>
          ) : null}
        </details>
      ) : null}
      {(status === 'failed' || status === 'invalid' || status === 'empty') ? (
        <details className="roleFitInventory roleFitAiDiagnostic">
          <summary>Technical diagnostic (error codes only)</summary>
          <p>Failure: <code>{aiFailure?.code ?? 'unknown'}</code>.
            {' '}Stage: <code>{aiFailure?.stage ?? 'validation'}</code>.
            {' '}This diagnostic does not include the job description.</p>
        </details>
      ) : null}
    </article>
  );
}
