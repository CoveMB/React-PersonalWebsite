import { findCapabilities } from "./roleFitTaxonomy.mjs";

export const maximumJobDescriptionLength = 12000;
export const maximumRoleRequirementGroups = 60;

export const normalizeRolePosting = (text) =>
  String(text ?? "").replace(/\r\n?/g, "\n").replace(/\u00a0/g, " ")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/[ \t]+$/gm, "").trim();

const isHeading = (quote) => /^(?:about (?:the )?(?:job|role)|requirements?|(?:required|preferred|technical|soft) skills?|qualifications?|responsibilities|experience|what you(?:'ll| will) (?:do|need)|nice to have|good to have|our team|who we are|benefits?)\s*:?$/i.test(quote);
const excludedRequirement = (quote) =>
  /\b(?:no|without|not requiring|do not require|does not require|don't require)\b.{0,55}?\b(?:required|needed|necessary)?\b/i.test(quote) &&
    /\b(?:no\s+\w+\s+(?:is\s+)?required|without|not requiring|do not require|does not require|don't require)\b/i.test(quote) ||
  /\b(?:is|are)\s+not\s+(?:required|necessary|needed)\b/i.test(quote);
const preferredClause = (quote) => /\b(?:nice to have|good to have|optional|preferred|bonus|desirable)\b/i.test(quote);
const requiredClause = (quote) => /\b(?:must|mandatory|required|essential|minimum|need(?:s|ed)?|proficien(?:cy|t)|experience with|knowledge of|familiarity with)\b/i.test(quote);
const logisticsClause = (quote) => /\b(?:on[ -]?site|hybrid|remote|relocat(?:ion|e)|work location|location\s*:|work type|work mode|full[ -]?time|part[ -]?time|in[ -]?office|travel required|days? (?:per|a) week|work authorization)\b/i.test(quote);
const tenureClause = (quote) => /\b(?:\d+(?:\+|\s*[-–]\s*\d+)?\s*(?:years?|yrs?)|years? (?:of|in)|seniority|senior level|junior level)\b/i.test(quote);
const softClause = (quote) => /\b(?:communication|collaboration|collaborative|stakeholders?|leadership|interpersonal|team player|problem solving|self.starter|adaptab(?:le|ility)|creative thinking|work independently|mentorship)\b/i.test(quote);
const practiceKeys = new Set(["microservices", "event-driven", "architecture", "testing", "cicd", "scrum", "kanban", "agile", "mentoring"]);

const getRule = (quote, hits) => {
  if (hits.length < 2) return "single";
  const separators = hits.slice(1).map((hit, index) => quote.slice(hits[index].end, hit.start));
  if (separators.some((separator) => /[/|]/.test(separator))) return "ambiguous";
  const all = separators.join(" ").toLowerCase();
  if (/\b(?:and\/or|either|and\s+or)\b/.test(all) || /\b(?:such as|like|e\.g\.)\b/i.test(quote)) return "ambiguous";
  const hasAnd = /\band\b/i.test(all);
  const hasOr = /\bor\b/i.test(all);
  if (hasAnd && hasOr) return "ambiguous";
  // "Angular, React, or Vue" is a single alternative set.
  if (hasOr && separators.every((separator) => /^\s*(?:,\s*)?(?:or\s*)?$/i.test(separator))) return "anyOf";
  if (hasAnd && !/\b(?:such as|e\.g\.|like)\b/i.test(quote)) return "allOf";
  if (!hasAnd && !hasOr && separators.every((separator) => /^\s*,\s*$/.test(separator))) return "allOf";
  if (!hasAnd && !hasOr && separators.every((separator) => /^\s+(?:with|for|using|plus|in)\s+$/i.test(separator))) return "allOf";
  return "ambiguous";
};

const categoryFor = (quote, hits) => {
  if (logisticsClause(quote)) return "logistics";
  if (tenureClause(quote)) return "tenure";
  if (softClause(quote) && !hits.length) return "soft_skill";
  if (hits.length && hits.every(({ key }) => practiceKeys.has(key))) return "practice";
  if (hits.length) return "technical";
  return "other";
};

const getImportance = (quote, inherited, titleLine, hits) => {
  if (titleLine && hits.length) return "core";
  if (preferredClause(quote)) return "preferred";
  if (excludedRequirement(quote)) return "unspecified";
  if (requiredClause(quote)) return "required";
  return inherited;
};

const getLineSegments = (text) => {
  const segments = [];
  for (const lineMatch of text.matchAll(/[^\n]+/g)) {
    const textLine = lineMatch[0];
    const start = lineMatch.index;
    // Split long pasted lines into separately auditable clauses, but not at .js or .NET.
    const parts = /(?:[^;.!?]|\.(?!\s+[A-Z])|!(?!\s+[A-Z])|\?(?!\s+[A-Z]))+(?:[;.!?](?=\s+[A-Z])|[;])?/g;
    let matches = [...textLine.matchAll(parts)];
    if (!matches.length) matches = [{ 0: textLine, index: 0 }];
    for (const match of matches) {
      const raw = match[0];
      const leading = raw.length - raw.trimStart().length;
      const trailing = raw.length - raw.trimEnd().length;
      const segmentStart = start + match.index + leading;
      const segmentEnd = start + match.index + raw.length - trailing;
      if (segmentEnd > segmentStart) segments.push({ start: segmentStart, end: segmentEnd });
    }
  }
  // A copied advert often mixes a required foundational list and a separate
  // "A, B, or C" framework choice. Do not evaluate the entire line as a single
  // ambiguous requirement or incorrectly require every framework.
  return segments.flatMap(({ start, end }) => {
    const line = text.slice(start, end);
    const alternative = /(?:,?\s+and\s+)?(?:modern\s+)?(?:frameworks?\s*\/\s*libraries?|frameworks?|libraries)\s+such\s+as\s+/i.exec(line);
    if (alternative) {
      const left = line.slice(0, alternative.index).replace(/[,\s]+$/, "");
      const rightOffset = alternative.index + alternative[0].length;
      const right = line.slice(rightOffset).trim();
      if (findCapabilities(left).length && findCapabilities(right).length >= 2 && /\bor\b/i.test(right)) {
        return [
          { start, end: start + left.length, forcedImportance: preferredClause(line) ? "preferred" : undefined },
          { start: start + rightOffset, end: start + rightOffset + right.length, forcedImportance: preferredClause(line) ? "preferred" : undefined },
        ];
      }
    }
    const optional = /,?\s+and\s+optionally\s+/i.exec(line);
    if (optional && findCapabilities(line.slice(0, optional.index)).length && findCapabilities(line.slice(optional.index + optional[0].length)).length) {
      return [
        { start, end: start + line.slice(0, optional.index).trimEnd().length },
        { start: start + optional.index + optional[0].length, end, forcedImportance: "preferred" },
      ];
    }
    return [{ start, end }];
  });
};

export const parseRoleRequirements = (normalizedPosting) => {
  const text = normalizeRolePosting(normalizedPosting);
  const requirements = [];
  const overflow = [];
  let inheritedImportance = "unspecified";
  for (const { start, end, forcedImportance } of getLineSegments(text)) {
    const quote = text.slice(start, end);
    if (/^(?:[-*•–]\s*)?$/.test(quote)) continue;
    const heading = quote.replace(/^(?:[-*•–]\s*)/, "");
    if (isHeading(heading)) {
      if (/\b(?:required|requirements|qualifications|technical skills)\b/i.test(heading)) inheritedImportance = "required";
      else if (/\b(?:preferred|nice to have|good to have)\b/i.test(heading)) inheritedImportance = "preferred";
      else inheritedImportance = "unspecified";
      continue;
    }
    const titleLine = /^(?:role|job title|title|position)\s*:/i.test(heading);
    const hits = findCapabilities(quote);
    const rule = getRule(quote, hits);
    const category = categoryFor(quote, hits);
    const importance = forcedImportance ?? getImportance(quote, inheritedImportance, titleLine, hits);
    const negated = excludedRequirement(quote);
    const options = [...new Map(hits.map(({ key, label }) => [key, { key, label }])).values()];
    if (requirements.length >= maximumRoleRequirementGroups) {
      overflow.push(quote);
      continue;
    }
    requirements.push({
      id: `req-${requirements.length + 1}`,
      quote,
      span: { start, end },
      category: negated ? "other" : category,
      importance,
      options: negated ? [] : options,
      optionRule: negated ? "single" : rule,
      extraction: "rule",
      needsReview: !negated && (category === "other" || rule === "ambiguous"),
      ...(negated ? { excluded: true } : {}),
    });
  }
  // Metadata on the array is retained by the assessment; no source segment is dropped silently.
  requirements.unparsedQuotes = overflow;
  requirements.coverageNote = overflow.length
    ? `Partial coverage: ${overflow.length} further clause${overflow.length === 1 ? "" : "s"} could not be structured; see the excerpts below.`
    : "";
  return requirements;
};

export const inferRoleTitle = (text) => {
  const line = normalizeRolePosting(text).split("\n").find((part) => /^(?:role|job title|title|position)\s*:/i.test(part.trim()));
  return line?.replace(/^(?:role|job title|title|position)\s*:\s*/i, "").trim().slice(0, 110) || "Role assessment";
};
