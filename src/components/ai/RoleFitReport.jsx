import { useEffect, useRef } from 'react';
import { buildThreeSectionRoleFit } from '../../utils/roleFitAI.mjs';
import { transferReasonText } from '../../utils/roleFitTaxonomy.mjs';
import { roleFitAiFailureMessages } from '../../content/roleFitLabContent';

const groups = [
  {
    key: 'direct',
    title: 'Directly demonstrated',
    description: 'Capabilities clearly supported by published professional or project experience.',
  },
  {
    key: 'transferable',
    title: 'Transferable experience',
    description: 'Related experience is documented, but the required technology or implementation differs.',
  },
  {
    key: 'notEstablished',
    title: 'Not established',
    description: 'Available evidence does not substantiate the requirement. This does not mean the skill is absent.',
  },
];
const initialVisiblePerGroup = 3;
const gapCopy = {
  owner_confirmed_absence: 'No professional Java experience has been confirmed by the portfolio owner; related backend work does not establish it.',
  missing_source: 'No matching evidence was found in the published sources. This does not establish an absence of experience.',
  ambiguous_group: 'The wording combines alternatives or requirements that cannot be safely resolved without clarification.',
  tenure_not_established: 'The available sources do not establish the specific duration of experience requested.',
  ask_candidate: 'This condition or interpersonal requirement needs direct confirmation.',
  review_clause: 'The requirement needs human interpretation before a reliable match can be made.',
  unknown_capability: 'The available sources do not establish this requirement.',
  unverified_requirement: 'The available evidence is insufficient to establish this requirement.',
};

function EvidenceDetails({ row, category }) {
  if (!row.evidence?.length) return null;
  return (
    <details className="roleFitItemEvidence">
      <summary>{category === 'notEstablished' ? 'Related sources (not proof of this requirement)' : 'View published evidence'}</summary>
      <div className="roleFitSources">
        {row.evidence.slice(0, 5).map((item) => (
          <div className="roleFitSource" key={item.id}>
            <span className="roleFitSourceLabel">
              {item.sourceType === 'project' ? 'Portfolio project' : 'Published résumé'} · {item.sourceId}
            </span>
            <blockquote>“{item.sourceQuote.replace(/\*\*/g, '')}”</blockquote>
            {item.sourceUrl ? (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Open source</a>
            ) : null}
            {item.experienceType === 'other' ? <small>A project demonstrates exposure, not necessarily professional tenure.</small> : null}
          </div>
        ))}
      </div>
    </details>
  );
}

function RequirementItem({ row, category }) {
  const reason = category === 'transferable'
    ? transferReasonText[row.rationaleCode] ?? 'The related work uses a different technology or approach.'
    : category === 'notEstablished'
      ? gapCopy[row.rationaleCode] ?? 'The sources do not substantiate this requirement.'
      : null;
  return (
    <li className="roleFitRequirementItem">
      <strong className="roleFitRequirementText">
        {row.relatedToRequirementId ? `Related experience for ${row.requirement.quote}` : row.requirement.quote}
      </strong>
      {row.relatedToRequirementId ? (
        <p className="roleFitRationale">
          Related to “{row.relatedToQuote}”. {row.relatedGroupKind === 'example'
            ? 'This is an illustrative framework list; related work does not establish experience with the named frameworks.'
            : 'The full combined requirement remains not established; related work does not satisfy its entire required stack.'}
        </p>
      ) : null}
      {category !== 'notEstablished' && row.evidence.length ? (
        <p className="roleFitShortEvidence">
          <span>{category === 'direct' ? 'Documented work' : 'Related work'}:</span> {row.evidence[0].label}
        </p>
      ) : null}
      {reason ? <p className="roleFitRationale">{reason}</p> : null}
      {row.modelNote ? (
        <p className="roleFitModelNote">
          <span className="roleFitModelNoteLabel">Local AI interpretation · unverified wording</span>
          {row.modelNote}
        </p>
      ) : null}
      <EvidenceDetails row={row} category={category} />
    </li>
  );
}

function RequirementGroup({ group, rows }) {
  const visible = rows.slice(0, initialVisiblePerGroup);
  const additional = rows.slice(initialVisiblePerGroup);
  return (
    <section className="roleFitReportSection roleFitThreeWayGroup" aria-labelledby={'role-fit-' + group.key}>
      <div className="roleFitGroupHead">
        <h4 id={'role-fit-' + group.key}>{group.title}</h4>
        <span className="roleFitGroupCount" aria-label={rows.length + ' requirements'}>{rows.length}</span>
      </div>
      <p className="roleFitCategoryDescription">{group.description}</p>
      {rows.length ? (
        <>
          <ul className="roleFitRequirementList">
            {visible.map((row) => <RequirementItem key={row.requirementId} row={row} category={group.key} />)}
          </ul>
          {additional.length ? (
            <details className="roleFitInventory roleFitAdditionalItems">
              <summary>Show {additional.length} more {group.title.toLowerCase()} requirement{additional.length === 1 ? '' : 's'}</summary>
              <ul className="roleFitRequirementList">
                {additional.map((row) => <RequirementItem key={row.requirementId} row={row} category={group.key} />)}
              </ul>
            </details>
          ) : null}
        </>
      ) : (
        <p className="roleFitEmptyGroup">
          {group.key === 'notEstablished'
            ? 'No outstanding requirements were identified in the analyzed evidence.'
            : 'No requirement in this category was established by the available sources.'}
        </p>
      )}
    </section>
  );
}

export default function RoleFitReport({ assessment, aiAssessment, aiStatus, aiFailure, modelId, progress, analysisId }) {
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, [analysisId]);
  const aiReady = aiStatus === 'ready' && aiAssessment?.kind === 'accepted';
  const { sections, ignored } = buildThreeSectionRoleFit(assessment, aiReady ? aiAssessment : null);
  const unparsed = [...new Set([...(assessment.unparsedQuotes ?? []), ...ignored.map((row) => row.requirement.quote)])];

  return (
    <article className="aiPart roleFitResultCard" aria-labelledby="role-fit-heading">
      <p className="roleFitResultEyebrow">{aiReady ? 'Local AI + published evidence' : 'Published-evidence comparison'}</p>
      <h3 id="role-fit-heading" className="roleFitReportTitle" ref={headingRef} tabIndex={-1}>Role assessment</h3>
      <p className="roleFitReportRoleTitle">{assessment.roleTitle}</p>
      <p className="roleFitReportMode">
        Each identified requirement appears in one category, based on published résumé and portfolio evidence.
        Model-written explanations are labeled separately; evidence-backed classification does not validate every word generated by AI.
      </p>
      {aiStatus === 'running' ? (
        <p className="roleFitAIProgress" role="status" aria-live="polite">
          {progress || 'Preparing on-device AI interpretations…'} The evidence comparison is available now.
        </p>
      ) : null}
      {aiStatus === 'unavailable' ? (
        <p className="roleFitAIProgress" role="status">
          On-device AI is unavailable in this browser. Showing the source-based comparison instead, not a generated AI result.
        </p>
      ) : null}
      {aiStatus === 'failed' || aiStatus === 'invalid' || aiStatus === 'empty' ? (
        <p className="roleFitAIProgress" role="status">
          {roleFitAiFailureMessages[aiFailure?.code] ?? 'The local AI result could not be validated.'}
          {' '}The three-section source-based comparison remains available without AI-generated notes.
        </p>
      ) : null}
      {aiReady ? (
        <p className="roleFitValidationNotice">
          The local model selected {aiAssessment.selectedCount} specific requirements for additional interpretation
          {modelId ? ' (' + modelId + ')' : ''}. Its notes remain unverified AI wording; sources are provided for independent checking.
          {aiAssessment.rejectedCount ? ' ' + aiAssessment.rejectedCount + ' unsafe or mismatched model item(s) were omitted.' : ''}
          {aiAssessment.outputLimitReached ? ' The model reached its generation limit; its interpretation may be incomplete.' : ''}
        </p>
      ) : null}
      {assessment.coverageNote ? <p className="roleFitCoverageWarning" role="status">{assessment.coverageNote}</p> : null}
      <div className="roleFitThreeWayGrid">
        {groups.map((group) => <RequirementGroup key={group.key} group={group} rows={sections[group.key]} />)}
      </div>
      {unparsed.length ? (
        <details className="roleFitInventory">
          <summary>Review {unparsed.length} additional clause{unparsed.length === 1 ? '' : 's'} needing manual interpretation</summary>
          <p className="roleFitRationale">Some role text could not be confidently interpreted as an assessable requirement; it was not silently classified as a skill gap.</p>
          <ul className="roleFitUnparsedList">{unparsed.map((quote, i) => <li key={i}>{quote}</li>)}</ul>
        </details>
      ) : null}
      <p className="roleFitEvidenceDisclaimer">
        Sources describe the candidate's published experience and have not been employment-verified.
        “Not established” means not supported by these sources, not that the candidate lacks the skill.
        Excluded or explicitly unnecessary skills are not counted as gaps. This is not a hiring score or decision.
      </p>
    </article>
  );
}
