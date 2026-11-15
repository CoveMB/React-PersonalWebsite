import { inferRoleTitle } from "./roleFitRequirements.mjs";
import { getTransferableRelations } from "./roleFitTaxonomy.mjs";

const importanceOrder = { core: 0, required: 1, unspecified: 2, preferred: 3 };
const sourceOrder = { direct: 0, transferable: 1, not_documented: 2, needs_confirmation: 3 };
const prioritized = (a, b) =>
  (importanceOrder[a.requirement.importance] - importanceOrder[b.requirement.importance]) ||
  (sourceOrder[a.status] - sourceOrder[b.status]) ||
  (a.requirement.span.start - b.requirement.span.start);

const concise = (value, max = 135) => value.length > max
  ? `${value.slice(0, max - 1).trimEnd()}…` : value;
const distinctByKeys = (rows, count) => {
  const seen = new Set();
  return rows.filter(({ requirement }) => {
    const keys = requirement.options.map((entry) => entry.key);
    const novel = keys.filter((key) => !seen.has(key));
    if (keys.length && !novel.length) return false;
    for (const key of novel) seen.add(key);
    return true;
  }).slice(0, count);
};

export const buildRoleFitAssessment = ({ jobText, requirements, matches, evidenceCatalog, mode = "baseline" }) => {
  const byRequirement = new Map(requirements.map((r) => [r.id, r]));
  const evidenceById = new Map(evidenceCatalog.map((e) => [e.id, e]));
  const details = matches.map((match) => ({
    ...match,
    requirement: byRequirement.get(match.requirementId),
    evidence: match.evidenceIds.map((id) => evidenceById.get(id)).filter(Boolean),
  })).filter((item) => Boolean(item.requirement));
  const substantive = details.filter(({ requirement }) =>
    !requirement.excluded && ["technical", "practice", "tenure"].includes(requirement.category));
  const aligned = substantive.filter(({ status }) => ["direct", "transferable"].includes(status)).sort(prioritized);
  // A single excerpt cannot substantiate a multi-capability match unless it
  // actually covers each required capability. Pick a minimal citation cover,
  // not one arbitrarily convenient quote for a whole conjunction.
  const supportsKey = (source, key, status) =>
    source.capabilities.includes(key) ||
    (status === "transferable" && getTransferableRelations(key)
      .some(({ candidateKey }) => source.capabilities.includes(candidateKey)));
  const citationCover = (row) => {
    const keys = row.requirement.options.map(({ key }) => key);
    const remaining = new Set(keys);
    const selected = [];
    const candidates = [...row.evidence];
    while (remaining.size && candidates.length) {
      candidates.sort((a, b) =>
        [...remaining].filter((key) => supportsKey(b, key, row.status)).length -
        [...remaining].filter((key) => supportsKey(a, key, row.status)).length);
      const best = candidates.shift();
      const covered = [...remaining].filter((key) => supportsKey(best, key, row.status));
      if (!covered.length) break;
      selected.push(best);
      for (const key of covered) remaining.delete(key);
      if (row.requirement.optionRule === "anyOf") break;
    }
    return selected;
  };
  const usedSources = new Set();
  const highlights = [];
  for (const item of aligned) {
    const sources = citationCover(item);
    if (!sources.some(({ id }) => !usedSources.has(id))) continue;
    sources.forEach(({ id }) => usedSources.add(id));
    highlights.push({ ...item, evidence: sources });
    if (highlights.length >= 4) break;
  }

  const gaps = substantive.filter(({ status }) =>
    status === "not_documented" || status === "needs_confirmation").sort(prioritized);
  const criticalGaps = distinctByKeys(gaps.filter(({ requirement }) =>
    ["core", "required"].includes(requirement.importance)), 4);
  const otherGaps = distinctByKeys(gaps.filter((item) => !criticalGaps.includes(item)), 5);
  const conditions = details.filter(({ requirement }) => ["logistics", "soft_skill"].includes(requirement.category));
  const unknowns = details.filter(({ requirement }) => requirement.needsReview && requirement.category === "other");
  const unparsedQuotes = [...new Set([...(requirements.unparsedQuotes ?? []), ...unknowns.map((item) => item.requirement.quote)])];
  const hasCoreGap = criticalGaps.some(({ requirement }) => requirement.importance === "core" && requirement.category !== "tenure");
  const hasStrongDocumented = highlights.some(({ status }) => status === "direct");
  const roleHasDetail = substantive.some(({ requirement }) => requirement.options.length > 0);
  const hasRequiredMiss = criticalGaps.some(({ status }) => status !== "direct" && status !== "transferable");

  let kind;
  if (!roleHasDetail) kind = "insufficient_role_details";
  else if (hasCoreGap && highlights.length) kind = "transferable_core_gap";
  else if (!highlights.length) kind = "insufficient_evidence";
  else if (!hasCoreGap && !hasRequiredMiss && hasStrongDocumented) kind = "documented_alignment";
  else kind = "mixed_evidence";

  const conclusionCopy = {
    documented_alignment: ["Relevant work is documented", "The public portfolio contains directly relevant examples. Requirements not covered by these sources still need candidate confirmation."],
    transferable_core_gap: ["Transferable experience, with a core gap", "Related engineering work is documented, but at least one central requirement is not established by the available evidence. That difference should not be treated as a direct match."],
    mixed_evidence: ["A partial evidence-based fit", "Some requirements connect to documented work; others remain unestablished or require clarification. The strongest gaps should be assessed before inferring a close match."],
    insufficient_evidence: ["A technical fit cannot be established", "The available sources do not substantiate the main technical requirements. An undocumented skill is not necessarily an absent skill."],
    insufficient_role_details: ["More role detail is needed", "The posting does not provide enough reliably identifiable technical requirements for a meaningful technical comparison."],
  }[kind];
  const evidenceStrength = highlights.find((item) => item.status === "direct" || item.status === "transferable")?.evidence?.[0];
  const questionGap = criticalGaps.find(({ status }) => status !== "direct" && status !== "transferable");
  const clarificationQuestion = evidenceStrength && questionGap && questionGap.requirement.category !== "tenure"
    ? `For “${concise(questionGap.requirement.quote, 110)}”, is direct experience essential, or could documented work such as ${evidenceStrength.label.toLowerCase()} be relevant after evaluation?`
    : undefined;

  return {
    roleTitle: inferRoleTitle(jobText),
    conclusion: { kind, heading: conclusionCopy[0], summary: conclusionCopy[1] },
    highlights,
    criticalGaps,
    otherGaps,
    conditions,
    clarificationQuestion,
    details,
    unparsedQuotes,
    coverageNote: requirements.coverageNote ?? "",
    mode,
  };
};
