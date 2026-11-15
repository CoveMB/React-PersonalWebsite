import { capabilityLabel, getTransferableRelations, transferReasonText } from './roleFitTaxonomy.mjs';
import { isPositiveEvidenceEligible } from './roleFitEvidence.mjs';

// The recruiter card is a short view over the source-checked requirement
// mapping, never a second classifier and never a renderer for generated claims.
const importanceRank = { core: 0, required: 1, unspecified: 2, preferred: 3 };
const rank = (row) => importanceRank[row.requirement.importance] ?? 4;
const relevant = (row) => !row.requirement.excluded &&
  ['technical', 'practice'].includes(row.requirement.category) && row.requirement.options.length > 0;
const unique = (values) => [...new Set(values)];
const words = (values) => values.length < 3 ? values.join(' and ') :
  `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
const labels = (keys) => words(unique(keys).map(capabilityLabel));
const quoteAsProse = (source) => source.id === 'git' ?
  'Git is listed among the published résumé’s technical tools.' :
  source.sourceQuote.replace(/\*\*/g, '').replace(/^[-•\s]+/, '').trim();
const getKeys = (row) => unique(row.requirement.options.map(({ key }) => key));
const isEligible = (source) => isPositiveEvidenceEligible(source) && source.sourceUrl?.startsWith('/');

const sourceCover = (row) => {
  const keys = getKeys(row);
  const candidates = row.evidence.filter(isEligible);
  const matchedKeys = row.requirement.optionRule === 'anyOf'
    ? keys.filter((key) => candidates.some((source) => source.capabilities.includes(key))).slice(0, 1)
    : keys;
  const needed = new Set(matchedKeys);
  const selected = [];
  while (needed.size) {
    const best = candidates.map((source) => ({
      source,
      cover: [...needed].filter((key) => source.capabilities.includes(key)),
    })).sort((a, b) => b.cover.length - a.cover.length ||
      Number(b.source.experienceType === 'professional') - Number(a.source.experienceType === 'professional'))[0];
    if (!best?.cover.length) return null;
    selected.push(best.source);
    for (const key of best.cover) needed.delete(key);
    candidates.splice(candidates.indexOf(best.source), 1);
  }
  return { matchedKeys, sources: selected };
};

const asDirect = (row) => {
  const cover = sourceCover(row);
  if (!cover?.sources.length) return null;
  return {
    id: row.requirementId, requirementIds: [row.requirementId],
    importance: row.requirement.importance,
    title: `${labels(cover.matchedKeys)} experience`,
    summary: cover.sources.slice(0, 3).map(quoteAsProse).join(' '),
    sources: cover.sources,
  };
};

const asTransferable = (row) => {
  const keys = row.unresolvedOptions?.length ? row.unresolvedOptions : getKeys(row);
  const available = row.evidence.filter(isEligible);
  const relations = keys.flatMap((targetKey) => getTransferableRelations(targetKey)
    .map((relation) => ({ targetKey, ...relation })));
  const pairs = relations.flatMap((relation) => available
    .filter((source) => source.capabilities.includes(relation.candidateKey))
    .map((source) => ({ ...relation, source })));
  if (!pairs.length) return null;
  const targets = unique(pairs.map((pair) => pair.targetKey));
  const candidateKeys = unique(pairs.map((pair) => pair.candidateKey));
  const sources = unique(pairs.map((pair) => pair.source.id))
    .map((id) => pairs.find((pair) => pair.source.id === id).source).slice(0, 2);
  const reasonTexts = unique(pairs.map(({ reasonCode }) => transferReasonText[reasonCode] ??
    'The documented technology is related but not the same as the role requirement.'));
  return {
    id: row.requirementId, requirementIds: [row.requirementId],
    importance: row.requirement.importance,
    transferKeys: targets, candidateKeys, reasonTexts,
    title: `${labels(candidateKeys)} work relevant to ${labels(targets)}`,
    summary: `${reasonTexts.join(' ')} This is not direct evidence of ${labels(targets)} experience.`,
    sources,
  };
};

const groupGaps = (rows) => {
  const groups = [];
  for (const row of rows) {
    const missingKeys = unique(row.unresolvedOptions?.length ? row.unresolvedOptions : getKeys(row));
    if (!missingKeys.length) continue;
    // Group genuinely overlapping requirements. This joins repeated Java-stack
    // clauses but does not merge unrelated optional gaps into a core mismatch.
    const group = groups.find((candidate) => candidate.keys.some((key) => missingKeys.includes(key)));
    if (group) {
      group.rows.push(row);
      group.keys = unique([...group.keys, ...missingKeys]);
    } else {
      groups.push({ rows: [row], keys: missingKeys });
    }
  }
  return groups;
};

const asGap = (group) => {
  const first = group.rows[0];
  const javaStack = ['java', 'j2ee', 'spring', 'spring-boot', 'hibernate'];
  const keys = group.keys.some((key) => javaStack.includes(key))
    ? [...javaStack.filter((key) => group.keys.includes(key)), ...group.keys.filter((key) => !javaStack.includes(key))]
    : group.keys;
  const labelKeys = keys.slice(0, 6);
  const hasProfessionalJavaAbsence = group.rows.some((row) => row.rationaleCode === 'owner_confirmed_absence') && keys.includes('java');
  const ambiguous = group.rows.some((row) => row.status === 'needs_confirmation' || row.requirement.needsReview);
  const summary = hasProfessionalJavaAbsence
    ? 'The portfolio owner has confirmed no professional Java experience. The other named stack requirements are not substantiated by the selected public sources.'
    : ambiguous
      ? 'The posting needs clarification on combined or alternative requirements; the selected public evidence does not fully establish this requirement.'
      : 'No direct match is documented in the selected public sources. That is not proof that the experience does not exist.';
  return {
    id: first.requirementId,
    requirementIds: group.rows.map(({ requirementId }) => requirementId),
    importance: first.requirement.importance,
    title: `${labels(labelKeys)} ${keys.length > labelKeys.length ? 'and related requirements ' : ''}not established`,
    summary,
    sources: [],
  };
};

const prioritize = (items, modelIds = []) => {
  const order = new Map(modelIds.map((id, index) => [id, index]));
  return items.sort((a, b) =>
    (importanceRank[a.importance] ?? 4) - (importanceRank[b.importance] ?? 4) ||
    Math.min(...a.requirementIds.map((id) => order.get(id) ?? 1000)) -
      Math.min(...b.requirementIds.map((id) => order.get(id) ?? 1000)));
};

export const buildRoleFitRecruiterSummary = (mechanicalAssessment, modelRanking = {}) => {
  const rows = (mechanicalAssessment?.details ?? []).filter(relevant);
  const byPriority = (a, b) => rank(a) - rank(b) || a.requirement.span.start - b.requirement.span.start;
  const direct = rows.filter((row) => row.status === 'direct').sort(byPriority).map(asDirect).filter(Boolean);
  // A core requirement can remain unmet while a distinct, related technology
  // is genuinely transferable. Showing context never changes its gap status.
  const transferable = [];
  for (const row of rows.filter((item) => item.status !== 'direct').sort(byPriority)) {
    const match = asTransferable(row);
    if (!match) continue;
    const prior = transferable.find((item) => item.transferKeys.some((key) => match.transferKeys.includes(key)));
    if (prior) {
      prior.requirementIds = unique([...prior.requirementIds, ...match.requirementIds]);
      prior.transferKeys = unique([...prior.transferKeys, ...match.transferKeys]);
      prior.candidateKeys = unique([...prior.candidateKeys, ...match.candidateKeys]);
      prior.reasonTexts = unique([...prior.reasonTexts, ...match.reasonTexts]);
      prior.sources = [...new Map([...prior.sources, ...match.sources].map((source) => [source.id, source])).values()].slice(0, 3);
      prior.title = `${labels(prior.candidateKeys)} work relevant to ${labels(prior.transferKeys)}`;
      prior.summary = `${prior.reasonTexts.join(' ')} This is not direct evidence of ${labels(prior.transferKeys)} experience.`;
      continue;
    }
    transferable.push(match);
  }
  const gaps = groupGaps(rows.filter((row) =>
    row.status === 'not_documented' || row.status === 'needs_confirmation' ||
    (row.status === 'transferable' && row.unresolvedOptions?.length)).sort(byPriority)).map(asGap);

  return {
    sections: {
      direct: prioritize(direct, modelRanking.direct).slice(0, 4),
      transferable: prioritize(transferable, modelRanking.transferable).slice(0, 3),
      notEstablished: prioritize(gaps, modelRanking.notEstablished).slice(0, 4),
    },
  };
};
