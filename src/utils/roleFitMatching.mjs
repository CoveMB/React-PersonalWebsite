import { getTransferableRelations } from "./roleFitTaxonomy.mjs";
import { isPositiveEvidenceEligible } from "./roleFitEvidence.mjs";

const unique = (values) => [...new Set(values)];

export const matchRoleRequirements = (requirements, evidenceCatalog) => {
  const positive = (evidenceCatalog ?? []).filter(isPositiveEvidenceEligible);
  const absent = new Set((evidenceCatalog ?? [])
    .filter((item) => item.sourceType === "owner_confirmation")
    .flatMap((item) => item.explicitlyAbsent ?? []));

  return requirements.map((requirement) => {
    const base = {
      requirementId: requirement.id,
      status: "needs_confirmation",
      evidenceIds: [],
      rationaleCode: "unverified_requirement",
      unresolvedOptions: [],
    };
    if (requirement.excluded) return { ...base, rationaleCode: "excluded_not_required" };
    if (["logistics", "soft_skill", "other"].includes(requirement.category)) {
      return { ...base, rationaleCode: requirement.needsReview ? "review_clause" : "ask_candidate" };
    }

    const keys = unique(requirement.options.map(({ key }) => key));
    if (!keys.length) return { ...base, rationaleCode: "unknown_capability" };

    const optionMatches = keys.map((key) => {
      const direct = positive.filter((item) => item.capabilities.includes(key));
      const transferCandidates = getTransferableRelations(key).flatMap(({ candidateKey, reasonCode }) =>
        positive.filter((item) => item.capabilities.includes(candidateKey))
          .map((item) => ({ item, reasonCode })));
      return { key, direct, transferCandidates, confirmedAbsent: absent.has(key) };
    });
    const ownerAbsent = optionMatches.some(({ confirmedAbsent }) => confirmedAbsent);
    const satisfaction = (entry) => entry.direct.length ? "direct"
      : entry.confirmedAbsent ? "missing"
        : entry.transferCandidates.length ? "transferable" : "missing";
    const statuses = optionMatches.map(satisfaction);
    const isAny = requirement.optionRule === "anyOf";
    const isAmbiguous = requirement.optionRule === "ambiguous";
    const resolvedDirect = isAny ? statuses.includes("direct") : statuses.every((status) => status === "direct");
    const resolvedTransfer = isAny
      ? statuses.includes("transferable")
      : statuses.every((status) => status !== "missing");
    const unresolvedOptions = optionMatches
      .filter((entry) => !entry.direct.length)
      .map(({ key }) => key);

    const eligibleMatches = optionMatches.flatMap((entry) => [
      ...entry.direct,
      ...(entry.direct.length ? [] : entry.transferCandidates.map(({ item }) => item)),
    ]);
    const evidenceIds = unique(eligibleMatches.map((item) => item.id));

    if (requirement.category === "tenure") {
      // A published project/task does not establish tenure, dates, or duration.
      return { ...base, evidenceIds, unresolvedOptions: keys,
        status: ownerAbsent ? "not_documented" : "needs_confirmation",
        rationaleCode: ownerAbsent ? "owner_confirmed_absence" : "tenure_not_established" };
    }
    if (isAmbiguous && !ownerAbsent) {
      // A slash, mixed OR/AND, or example list cannot be silently chosen by software.
      return { ...base, evidenceIds, unresolvedOptions,
        rationaleCode: "ambiguous_group" };
    }
    if (isAny && resolvedDirect) {
      return { ...base, status: "direct", evidenceIds, unresolvedOptions: [], rationaleCode: "direct_source" };
    }
    if (!isAny && resolvedDirect && !isAmbiguous) {
      return { ...base, status: "direct", evidenceIds, rationaleCode: "direct_source" };
    }
    if (!ownerAbsent && resolvedTransfer && (isAny || !isAmbiguous)) {
      const reason = optionMatches.flatMap((entry) => entry.transferCandidates).find(Boolean)?.reasonCode;
      return { ...base, status: "transferable", evidenceIds,
        unresolvedOptions, rationaleCode: reason ?? "curated_transfer" };
    }
    return { ...base, status: "not_documented", evidenceIds,
      unresolvedOptions, rationaleCode: ownerAbsent ? "owner_confirmed_absence" : "missing_source" };
  });
};
