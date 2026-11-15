import { useEffect, useRef } from 'react';

const sections = [
  {
    key: 'direct',
    title: 'Directly demonstrated',
    description: 'The public résumé or portfolio documents the required capability.',
  },
  {
    key: 'transferable',
    title: 'Transferable experience',
    description: 'Related expertise is documented, but the required technology differs.',
  },
  {
    key: 'notEstablished',
    title: 'Not established',
    description: 'The available evidence does not substantiate the requirement.',
  },
];

function AISelection({ selection }) {
  return (
    <li className="roleFitAISelection">
      <strong className="roleFitAIRequirement">{selection.row.requirement.quote}</strong>
      {selection.note ? <p className="roleFitAIModelNote">Model interpretation (unverified): {selection.note}</p> : null}
      {selection.evidence?.length ? (
        <ul className="roleFitAISources" aria-label="Public evidence sources">
          {selection.evidence.slice(0, 3).map((source) => (
            <li key={source.id}>
              <span>{source.label}</span>
              {source.sourceUrl ? <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer">View source</a> : null}
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export default function RoleFitAIReport({ assessment, status, modelId, progress, analysisId }) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, [analysisId]);
  const isReady = status === 'ready' || status === 'empty';
  const structured = assessment?.kind === 'structured';
  return (
    <article className="aiPart roleFitResultCard roleFitAIResultCard" aria-labelledby="role-fit-ai-heading">
      <p className="roleFitResultEyebrow">On-device model · preliminary interpretation</p>
      <h3 id="role-fit-ai-heading" className="roleFitReportTitle" ref={headingRef} tabIndex={-1}>AI assessment</h3>
      <p className="roleFitAIWarning">A small local model may overlook requirements, misclassify skills, or invent explanations. AI interpretations are not independently verified and may use only part of a long posting. Compare the complete mechanical assessment below before relying on them.</p>
      {modelId ? <p className="roleFitAIModelLabel">Model: {modelId}</p> : null}
      {status === 'running' ? (
        <p className="roleFitAIProgress" role="status" aria-live="polite">{progress || 'Analyzing with the local AI model…'}</p>
      ) : null}
      {status === 'unavailable' ? (
        <p className="roleFitAIProgress" role="status">The local AI model requires WebGPU and Worker support in this browser. The independent mechanical assessment is available below.</p>
      ) : null}
      {status === 'failed' ? (
        <p className="roleFitAIProgress" role="status">The local AI assessment could not complete on this device. The mechanical assessment below is unaffected.</p>
      ) : null}
      {isReady ? (
        <>
          <div className="roleFitAICategories">
            {sections.map(({ key, title, description }) => (
              <section key={key} className="roleFitAICategory" aria-label={title}>
                <h4>{title}</h4>
                <p className="roleFitAICategoryDescription">{description}</p>
                {structured && assessment.sections[key].length ? (
                  <ul className="roleFitAISelectionList">
                    {assessment.sections[key].map((selection) => <AISelection key={selection.row.requirementId} selection={selection} />)}
                  </ul>
                ) : assessment?.kind === 'draft' && assessment.draftSections?.[key] ? (
                  <p className="roleFitAIUnverifiedText"><strong>Unverified AI wording:</strong> {assessment.draftSections[key]}</p>
                ) : (
                  <p className="roleFitAIEmpty">No source-checked item was selected for this category by the model.</p>
                )}
              </section>
            ))}
          </div>
          {assessment?.kind === 'draft' ? (
            <section className="roleFitAIDraft" aria-label="Unverified model response">
              <h4>Unverified model response</h4>
              <p>The small model’s wording could not be source-validated. It is displayed for transparency and may be inaccurate.</p>
              {Object.values(assessment.draftSections ?? {}).some(Boolean) ? (
                <details className="roleFitAIDetails"><summary>View complete original AI wording</summary><pre>{assessment.original}</pre></details>
              ) : <pre>{assessment.original}</pre>}
            </section>
          ) : assessment?.kind === 'empty' ? (
            <p className="roleFitAIProgress">The model returned no text. The independent mechanical assessment remains available below.</p>
          ) : null}
          {assessment?.warning && assessment.rejected ? <p className="roleFitAIWarningDetail">{assessment.rejected} unsupported or duplicate model selections were excluded from the source-checked categories.</p> : null}
          {structured ? (
            <details className="roleFitInventory roleFitAIDetails">
              <summary>View the original model response (unverified)</summary>
              <pre>{assessment.original}</pre>
            </details>
          ) : null}
        </>
      ) : null}
    </article>
  );
}
