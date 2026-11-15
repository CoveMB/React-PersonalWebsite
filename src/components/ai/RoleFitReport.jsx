import { transferReasonText } from "../../utils/roleFitTaxonomy.mjs";

const statusCopy = {
  direct: "Documented",
  transferable: "Transferable, not identical",
  not_documented: "Not established",
  needs_confirmation: "Needs confirmation",
};
const rationaleCopy = {
  owner_confirmed_absence: "The portfolio owner has confirmed no professional Java experience. Other framework or backend work cannot establish this Java requirement.",
  missing_source: "No matching evidence is documented in the selected public sources; this does not establish an absence of experience.",
  ambiguous_group: "The wording leaves alternatives or combined requirements ambiguous. The lab cannot safely treat one as satisfying all.",
  tenure_not_established: "The sources do not establish the specific duration of experience requested.",
  ask_candidate: "This work condition or interpersonal expectation requires direct confirmation.",
  review_clause: "This clause needs human interpretation before an evidence-based match can be made.",
  excluded_not_required: "The posting explicitly excludes this requirement; no deficit is inferred.",
};

function EvidenceSource({ item }) {
  return (
    <div className="roleFitSource">
      <span className="roleFitSourceLabel">{item.sourceType === "project" ? "Project case study" : "Published résumé"} · {item.sourceId}</span>
      <blockquote>“{item.sourceQuote.replace(/\*\*/g, "")}”</blockquote>
      {item.sourceUrl ? <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer">View source</a> : null}
      {item.experienceType === "other" ? <small>Project evidence; duration and professional depth are not inferred.</small> : null}
    </div>
  );
}

function RequirementSummary({ row, includeSources = false }) {
  const rationale = rationaleCopy[row.rationaleCode] ?? transferReasonText[row.rationaleCode];
  return (
    <li className="roleFitRequirementItem">
      <div className="roleFitRequirementTopline">
        <strong>{row.requirement.quote}</strong>
        <span className="roleFitStatusTag">{row.requirement.excluded ? "Not required" : statusCopy[row.status]}</span>
      </div>
      {rationale ? <p className="roleFitRationale">{rationale}</p> : null}
      {row.requirement.optionRule === "anyOf" ? <p className="roleFitRationale">Any one of the listed alternatives can satisfy this requirement.</p> : null}
      {row.requirement.optionRule === "ambiguous" ? <p className="roleFitRationale">The relationship between the listed technologies is not assumed.</p> : null}
      {includeSources && row.evidence?.length ? (
        <div className="roleFitSources">{row.evidence.map((item) => <EvidenceSource key={item.id} item={item} />)}</div>
      ) : null}
    </li>
  );
}

export default function RoleFitReport({ assessment }) {
  return (
    <article className="aiPart roleFitResultCard" aria-labelledby="role-fit-heading">
      <p className="roleFitResultEyebrow">Rule-based comparison · independent of AI</p>
      <h3 id="role-fit-heading" className="roleFitReportTitle">Mechanical assessment</h3>
      <p className="roleFitReportRoleTitle">{assessment.roleTitle}</p>
      <h4 className="roleFitConclusionHeading">{assessment.conclusion.heading}</h4>
      <p className="roleFitConclusionText">{assessment.conclusion.summary}</p>
      {assessment.coverageNote ? <p className="roleFitCoverageWarning" role="status">{assessment.coverageNote}</p> : null}

      {assessment.highlights.length ? (
        <section className="roleFitReportSection" aria-labelledby="role-fit-strengths">
          <h4 id="role-fit-strengths">Relevant documented work</h4>
          <ul className="roleFitHighlightList">
            {assessment.highlights.map((row) => (
              <li key={row.requirementId}>
                <div className="roleFitHighlightHeading"><strong>{row.evidence[0]?.label}</strong><span className="roleFitStatusTag">{row.requirement.excluded ? "Not required" : statusCopy[row.status]}</span></div>
                <p className="roleFitEvidenceRelation">Relevant to “{row.requirement.quote}”</p>
                {row.rationaleCode in transferReasonText ? <p className="roleFitRationale">{transferReasonText[row.rationaleCode]}</p> : null}
                {row.evidence.map((item) => <EvidenceSource key={item.id} item={item} />)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {assessment.criticalGaps.length ? (
        <section className="roleFitReportSection" aria-labelledby="role-fit-gaps">
          <h4 id="role-fit-gaps">Consequential requirements to verify</h4>
          <ul className="roleFitRequirementList">
            {assessment.criticalGaps.map((row) => <RequirementSummary key={row.requirementId} row={row} />)}
          </ul>
        </section>
      ) : null}
      {assessment.clarificationQuestion ? (
        <section className="roleFitRecruiterQuestion" aria-label="Question for a recruiter">
          <strong>Useful clarification</strong><p>{assessment.clarificationQuestion}</p>
        </section>
      ) : null}
      <p className="roleFitEvidenceDisclaimer">This assessment uses self-described public résumé and project information; employment claims have not been independently verified. Unlisted experience may exist, and the result is not a hiring probability or application recommendation.</p>
      <details className="roleFitInventory">
        <summary>Review all {assessment.details.length} mapped requirements and sources</summary>
        <div className="roleFitInventoryInner">
          <p>Requirements are quoted from the posting. “Not established” means the selected public sources do not substantiate a match, not that a capability is absent.</p>
          <ul className="roleFitRequirementList">
            {assessment.details.map((row) => <RequirementSummary key={row.requirementId} row={row} includeSources />)}
          </ul>
          {assessment.unparsedQuotes.length ? (
            <section className="roleFitUnparsed" aria-label="Clauses needing review">
              <h4>Clauses needing manual review</h4>
              <ul>{assessment.unparsedQuotes.map((quote, index) => <li key={`${index}-${quote.slice(0, 20)}`}>{quote}</li>)}</ul>
            </section>
          ) : null}
        </div>
      </details>
    </article>
  );
}
