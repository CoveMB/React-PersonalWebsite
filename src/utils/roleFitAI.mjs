import { getRoleFitEvidenceCatalog } from './roleFitEvidence.mjs';
import { normalizeRolePosting, parseRoleRequirements } from './roleFitRequirements.mjs';
import { matchRoleRequirements } from './roleFitMatching.mjs';
import { buildRoleFitAssessment } from './roleFitAssessment.mjs';
import { buildRoleFitRecruiterSummary } from './roleFitRecruiterSummary.mjs';

const maximumModelOutputLength = 6000;
const maximumDisplayedOutputLength = 3000;
const candidateCategories = ['direct', 'transferable', 'notEstablished'];

export const buildRoleFitAIRequest = ({ jobText, mechanicalAssessment }) => {
  const grounded = buildRoleFitRecruiterSummary(mechanicalAssessment).sections;
  const choices = Object.fromEntries(candidateCategories.map((category) => [category,
    grounded[category].map((item) => ({
      requirementId: item.id,
      importance: item.importance,
      claim: item.title,
      evidenceIds: item.sources.map(({ id }) => id),
    }))]));

  // A tiny local model is better used to rank verified options than to invent
  // résumé prose or reconstruct source relationships from an entire posting.
  const request = { messages: [
    { role: 'system', content: [
      'Choose the most relevant source-grounded claims for a recruiter reading this role.',
      'All claims are preclassified; you may reorder/select IDs but NEVER change a category, invent facts, or fill missing IDs.',
      'Return JSON ONLY, e.g. {"direct":["req-4"],"transferable":["req-1"],"notEstablished":["req-1"]}.',
      'All three arrays must contain only requirementId values listed under the SAME category.',
      'Prioritize core and required gaps. Do not interpret the employer posting as candidate experience.',
      'Do not write prose, explanations, new claims, copied evidence, Markdown, or additional keys.',
    ].join(' ') },
    { role: 'user', content: JSON.stringify({
      role: mechanicalAssessment.roleTitle,
      untrustedPostingContext: normalizeRolePosting(jobText).slice(0, 1100),
      verifiedCategoryChoices: choices,
    }) },
  ] };
  return request;
};

const parseModelObject = (raw) => {
  if (typeof raw !== 'string' || raw.length > maximumModelOutputLength) return null;
  const source = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  // Tolerate a preface from weaker models, never execute or display it as a claim.
  const candidate = source.startsWith('{') ? source : source.slice(source.indexOf('{'));
  if (!candidate.startsWith('{')) return null;
  const final = candidate.lastIndexOf('}');
  if (final < 0) return null;
  try {
    const result = JSON.parse(candidate.slice(0, final + 1));
    return result && typeof result === 'object' && !Array.isArray(result) ? result : null;
  } catch { return null; }
};

const normalizeSelectionIds = (values) => {
  if (!Array.isArray(values)) return [];
  return values.slice(0, 20).map((value) => typeof value === 'string' ? value :
    value && typeof value === 'object' && !Array.isArray(value) ? value.requirementId : null)
    .filter((id) => typeof id === 'string' && id.length <= 80);
};

export const interpretRoleFitAIResponse = (raw, { mechanicalAssessment }) => {
  const original = typeof raw === 'string' ? raw.trim().slice(0, maximumDisplayedOutputLength) : '';
  const safeBaseline = buildRoleFitRecruiterSummary(mechanicalAssessment);
  const parsed = parseModelObject(raw);
  if (!parsed) return {
    kind: 'fallback', original, sections: safeBaseline.sections,
    warning: 'The small model did not return trustworthy selections; this recruiter-friendly summary comes from verified public sources and deterministic matching.',
  };
  const accepted = {};
  let valid = 0;
  let rejected = 0;
  const legacy = {
    direct: 'directlyDemonstrated',
    transferable: 'transferableExperience',
    notEstablished: 'notEstablished',
  };
  for (const category of candidateCategories) {
    const list = normalizeSelectionIds(parsed[category] ?? parsed[legacy[category]]);
    const allowed = new Set(safeBaseline.sections[category].flatMap((item) => item.requirementIds));
    const ids = [];
    for (const id of list) {
      if (!allowed.has(id) || ids.includes(id)) { rejected++; continue; }
      ids.push(id);
      valid++;
    }
    accepted[category] = ids;
  }
  if (!valid || rejected > valid) return {
    kind: 'fallback', original, sections: safeBaseline.sections, rejected,
    warning: 'The small model did not select usable verified requirements; the summary is grounded directly in published evidence instead.',
  };
  const summary = buildRoleFitRecruiterSummary(mechanicalAssessment, accepted);
  return {
    kind: 'model_ranked', original, sections: summary.sections, rejected,
    warning: 'The small model ranked prevalidated requirements; claim wording and categories come from the published sources and independent checks.',
  };
};

/**
 * Runs both paths from one click, without consulting the previous result.
 * Mechanical is emitted synchronously; model interpretation runs independently.
 */
export const runRoleFitAnalyses = async ({
  jobDescription,
  evidenceCatalog = getRoleFitEvidenceCatalog(),
  gate, revision,
  onMechanical, onAI, onError,
  producer,
}) => {
  const jobText = normalizeRolePosting(jobDescription);
  const requirements = parseRoleRequirements(jobText);
  const mechanicalAssessment = buildRoleFitAssessment({
    jobText, requirements,
    matches: matchRoleRequirements(requirements, evidenceCatalog),
    evidenceCatalog,
  });
  onMechanical?.(mechanicalAssessment, Boolean(producer));
  if (!producer) return { status: 'unavailable', mechanicalAssessment };
  const context = { jobText, requirements, mechanicalAssessment, evidenceCatalog };
  try {
    const raw = await producer(context);
    if (!gate.isCurrent(revision)) return { status: 'stale' };
    const result = interpretRoleFitAIResponse(raw, context);
    onAI?.(result);
    return { status: result.kind === 'empty' ? 'empty' : 'ready', mechanicalAssessment, aiAssessment: result };
  } catch (error) {
    if (!gate.isCurrent(revision)) return { status: 'stale' };
    onError?.(error);
    return { status: 'failed', mechanicalAssessment };
  }
};
