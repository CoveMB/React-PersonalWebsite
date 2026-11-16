import { getRoleFitEvidenceCatalog, isPositiveEvidenceEligible } from './roleFitEvidence.mjs';
import { normalizeRolePosting, parseRoleRequirements } from './roleFitRequirements.mjs';
import { matchRoleRequirements } from './roleFitMatching.mjs';
import { buildRoleFitAssessment } from './roleFitAssessment.mjs';
import { interpretRoleFitMarkdownResponse } from './roleFitMarkdown.mjs';

// The evidence report remains independent of the locally generated Markdown assessment.
export function classifyRoleFitAIError(error, stage = 'generation') {
  // Only fixed, non-sensitive codes leave this boundary. Never expose raw
  // engine exceptions, model text, URLs or the pasted employer posting.
  const phase = stage === 'input' ? 'input' : stage === 'load' ? 'load' : 'generation';
  const known = new Set(['stream_startup_timeout', 'first_token_timeout',
    'generation_stalled', 'generation_timeout', 'model_ready_timeout', 'invalid_stream',
    'response_too_long', 'input_context_limit', 'resume_unavailable']);
  if (known.has(error?.code)) return { stage: phase, code: error.code };
  const value = String(error?.cause?.message ?? error?.message ?? error ?? '').slice(0, 700);
  let code;
  if (/out.of.memory|memory.limit|(?:^|\W)oom(?:\W|$)|allocation.failed/i.test(value)) code = 'memory_limit';
  else if (/response[_ -]?format|json.mode|xgrammar|grammar|schema.*unsupported/i.test(value)) code = 'structured_output_unsupported';
  else if (/device.lost|webgpu|gpu.adapter|gpu.device|gpu validation/i.test(value)) code = 'gpu_error';
  else if (phase === 'load' && /network|fetch|download|http|cache|cors|failed to load/i.test(value)) code = 'download_failed';
  else code = phase === 'load' ? 'load_failed' : 'generation_failed';
  return { stage: phase, code };
}

// Keep original browser/worker error details available for local troubleshooting.
// Only the active AI failure holds this bounded text; it is never sent or stored.
export function formatRoleFitAIErrorDetails(error) {
  const chain = [];
  const visited = new Set();
  let current = error;
  while (current != null && chain.length < 5) {
    if (typeof current === 'object' || typeof current === 'function') {
      if (visited.has(current)) break;
      visited.add(current);
    }
    const name = typeof current?.name === 'string' && current.name ? current.name : 'Error';
    const code = typeof current?.code === 'string' || typeof current?.code === 'number'
      ? String(current.code) : '';
    const message = typeof current === 'string' || typeof current === 'number'
      ? String(current) : typeof current?.message === 'string' ? current.message :
        typeof current?.reason === 'string' ? current.reason :
        typeof current?.error === 'string' ? current.error : '';
    const stack = typeof current?.stack === 'string' ? current.stack : '';
    chain.push({ name, code, message, stack });
    current = current?.cause;
  }
  if (!chain.length) return '';
  chain.reverse(); // Put the original exception before generic wrapper codes.
  const stackIndex = chain.findIndex(entry => entry.stack);
  return chain.map((entry, index) => {
    const title = (index === 0 ? 'Underlying exception' : 'Wrapped by') + ': ' +
      entry.name + (entry.code ? ' [' + entry.code + ']' : '');
    const message = entry.message ? 'Message: ' + entry.message.slice(0, 2400) : 'Message unavailable';
    const stack = index === stackIndex ? '\nStack:\n' + entry.stack.slice(0, 4000) : '';
    return title + '\n' + message + stack;
  }).join('\n\n').slice(0, 8000);
}

function roleCategory(row) {
  if (!row?.requirement || row.requirement.excluded) return null;
  const { category, importance } = row.requirement;
  if (!['technical', 'practice', 'tenure', 'logistics', 'soft_skill'].includes(category) &&
      !['core', 'required', 'preferred'].includes(importance)) return null;
  return row.status === 'direct' ? 'direct' :
    row.status === 'transferable' ? 'transferable' : 'notEstablished';
}

function rolePriority(row) {
  const weights = { core: 0, required: 1, unspecified: 2, preferred: 3 };
  return weights[row.requirement.importance] ?? 2;
}

// An unfulfilled AND requirement can still demonstrate *related* experience
// for some parts. Keep the entire conjunction Not established; add separate
// labeled transferable context only when an individual constituent genuinely
// has a curated, source-backed transfer match. OR/ambiguous groups are excluded.
function relatedTransferFacets(row, evidenceCatalog) {
  const requirement = row.requirement;
  const mixedConjunction = requirement.optionRule === 'allOf';
  // "frameworks like Spring, Hibernate, Spring Boot" is an illustrative list,
  // not a provable AND/OR requirement. Show related experience as context
  // while keeping the original group unestablished for the recruiter.
  const frameworkExamples = requirement.optionRule === 'ambiguous' &&
    /\b(?:frameworks?|libraries)\s+(?:like|such as)\b/i.test(requirement.quote);
  if (!['not_documented', 'needs_confirmation'].includes(row.status) || requirement.excluded ||
      !(mixedConjunction || frameworkExamples) ||
      !['technical', 'practice'].includes(requirement.category) ||
      requirement.options.length < 2 || requirement.options.length > 5) return [];
  const evidenceById = new Map(evidenceCatalog.map((item) => [item.id, item]));
  const facets = requirement.options.flatMap((option) => {
    const id = `${row.requirementId}:related:${option.key}`;
    const individual = {
      ...requirement, id, quote: option.label,
      options: [option], optionRule: 'single', needsReview: false,
    };
    const match = matchRoleRequirements([individual], evidenceCatalog)[0];
    if (match.status !== 'transferable') return [];
    const evidence = match.evidenceIds.map((sourceId) => evidenceById.get(sourceId))
      .filter(isPositiveEvidenceEligible);
    if (!evidence.length) return [];
    return [{
      ...match, requirementId: id, requirement: individual, evidence,
      relatedToRequirementId: row.requirementId,
      relatedToQuote: requirement.quote,
      relatedGroupKind: frameworkExamples ? 'example' : 'conjunction',
    }];
  });
  const cited = new Set();
  return facets.filter((facet) => {
    // Do not repeat one Node/Koa project as independent transfer proof for
    // multiple named frameworks in the same illustrative job-list clause.
    if (facet.evidence.some((source) => cited.has(source.id))) return false;
    facet.evidence.forEach((source) => cited.add(source.id));
    return true;
  });
}

export function buildThreeSectionRoleFit(assessment, evidenceCatalog = getRoleFitEvidenceCatalog()) {
  const sections = { direct: [], transferable: [], notEstablished: [] };
  const ignored = [];
  const seen = new Set();
  for (const row of assessment?.details ?? []) {
    const category = roleCategory(row);
    if (!category) {
      if (row?.requirement && !row.requirement.excluded) ignored.push(row);
      continue;
    }
    const quoteKey = row.requirement.quote.trim().toLocaleLowerCase('en')
      .replace(/^(?:[-*•–]\s*)/, '').replace(/\s+/g, ' ');
    const fingerprint = category + ':' + quoteKey;
    if (seen.has(fingerprint)) continue;
    seen.add(fingerprint);
    sections[category].push(row);
    if (category === 'notEstablished') {
      sections.transferable.push(...relatedTransferFacets(row, evidenceCatalog));
    }
  }
  for (const items of Object.values(sections)) {
    items.sort((a, b) =>
      rolePriority(a) - rolePriority(b) ||
      a.requirement.span.start - b.requirement.span.start);
  }
  return { sections, ignored, counts: Object.fromEntries(
    Object.entries(sections).map(([key, items]) => [key, items.length]),
  ) };
}

export async function runRoleFitAnalyses({
  jobDescription,
  evidenceCatalog = getRoleFitEvidenceCatalog(),
  gate, revision, onMechanical, onAI, onError, producer,
}) {
  const jobText = normalizeRolePosting(jobDescription);
  const requirements = parseRoleRequirements(jobText);
  const mechanicalAssessment = buildRoleFitAssessment({
    jobText, requirements,
    matches: matchRoleRequirements(requirements, evidenceCatalog),
    evidenceCatalog,
  });
  onMechanical?.(mechanicalAssessment);
  if (!producer) return { status: 'unavailable', mechanicalAssessment };
  try {
    const generated = await producer({ jobText, evidenceCatalog, assessment: mechanicalAssessment });
    if (!gate.isCurrent(revision)) return { status: 'stale' };
    const raw = typeof generated === 'string' ? generated : generated?.text ?? '';
    const result = interpretRoleFitMarkdownResponse(raw, {
      outputLimitReached: generated?.finishReason === 'length',
    });
    onAI?.(result);
    return { status: result.kind === 'accepted' ? 'ready' : result.kind,
      mechanicalAssessment, aiAssessment: result };
  } catch (error) {
    if (!gate.isCurrent(revision)) return { status: 'stale' };
    onError?.(error);
    return { status: 'failed', mechanicalAssessment };
  }
}
