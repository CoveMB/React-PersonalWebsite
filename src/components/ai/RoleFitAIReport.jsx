import { useEffect, useMemo, useRef } from 'react';
import { buildRoleFitRecruiterSummary } from '../../utils/roleFitRecruiterSummary.mjs';

const categories = [
  { key: 'direct', title: 'Directly demonstrated',
    description: 'The public résumé or portfolio documents these capabilities.' },
  { key: 'transferable', title: 'Transferable experience',
    description: 'Related expertise exists, but the role requires a different technology.' },
  { key: 'notEstablished', title: 'Not established',
    description: 'The available public sources do not establish these requirements.' },
];

function RecruiterItem({ selection }) {
  return (
    <li className="roleFitAISelection">
      <strong className="roleFitAIRequirement">{selection.title}</strong>
      <p className="roleFitAISummary">{selection.summary}</p>
      {selection.sources.length ? (
        <p className="roleFitAISourceLinks">
          <span>Published sources: </span>
          {selection.sources.map((source, index) => (
            <span key={source.id}>
              {index ? ' · ' : ''}
              <a href={source.sourceUrl}>
                {source.sourceId}{source.sourceType === 'project' ? ' (project)' : ' (résumé)'}
              </a>
            </span>
          ))}
        </p>
      ) : null}
    </li>
  );
}

export default function RoleFitAIReport({ assessment, mechanicalAssessment, status, modelId, progress, analysisId }) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, [analysisId]);
  const fallbackSections = useMemo(
    () => buildRoleFitRecruiterSummary(mechanicalAssessment).sections,
    [mechanicalAssessment],
  );
  const sections = assessment?.sections ?? fallbackSections;
  const hasAny = categories.some(({ key }) => sections[key]?.length);
  const isFallback = !assessment || assessment.kind === 'fallback';

  return (
    <article className="aiPart roleFitResultCard roleFitAIResultCard" aria-labelledby="role-fit-ai-heading">
      <p className="roleFitResultEyebrow">On-device AI · source-grounded role summary</p>
      <h3 id="role-fit-ai-heading" className="roleFitReportTitle" ref={headingRef} tabIndex={-1}>AI assessment</h3>
      <p className="roleFitReportRoleTitle">{mechanicalAssessment.roleTitle}</p>
      <p className="roleFitAIWarning">A small local model can misinterpret requirements. The statements below are constrained to published, self-described résumé and project evidence; this does not independently verify employment or proficiency. Compare the mechanical assessment below.</p>
      {modelId ? <p className="roleFitAIModelLabel">Model: {modelId}</p> : null}
      {status === 'running' ? (
        <p className="roleFitAIProgress" role="status" aria-live="polite">
          {progress || 'Analyzing with the local model…'} A source-grounded preview is available below while the model ranks the evidence.
        </p>
      ) : null}
      {status === 'unavailable' ? (
        <p className="roleFitAIProgress" role="status">
          The on-device AI model is unavailable in this browser (WebGPU/Worker required). The following evidence-grounded fallback still summarizes the role.
        </p>
      ) : null}
      {status === 'failed' ? (
        <p className="roleFitAIProgress" role="status">
          The small local model could not finish. The following evidence-grounded fallback is available; the mechanical assessment is unaffected.
        </p>
      ) : null}
      {status === 'ready' && isFallback ? (
        <p className="roleFitAIProgress" role="status">{assessment.warning}</p>
      ) : null}
      {status === 'ready' && !isFallback ? (
        <p className="roleFitAIModelLabel">Model-ranked priorities; all claims and categories remain source-checked.</p>
      ) : null}

      {hasAny ? (
        <div className="roleFitAICategories">
          {categories.map(({ key, title, description }) => (
            <section key={key} className="roleFitAICategory" aria-label={title}>
              <h4>{title}</h4>
              <p className="roleFitAICategoryDescription">{description}</p>
              {sections[key]?.length ? (
                <ul className="roleFitAISelectionList">
                  {sections[key].map((selection) => <RecruiterItem key={selection.id} selection={selection} />)}
                </ul>
              ) : <p className="roleFitAIEmpty">No evidence-backed examples identified for this category.</p>}
            </section>
          ))}
        </div>
      ) : (
        <p className="roleFitAIProgress">There are not enough identifiable technical requirements in this posting to produce a meaningful evidence-based comparison. Additional role details would help.</p>
      )}

      {assessment?.original ? (
        <details className="roleFitInventory roleFitAIDetails">
          <summary>Model diagnostics (unverified original text)</summary>
          <p>This is raw model output, not recruiter-facing evidence or verified candidate experience.</p>
          <pre>{assessment.original}</pre>
        </details>
      ) : null}
    </article>
  );
}
