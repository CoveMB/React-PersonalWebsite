# Evidence-grounded Role-Fit Lab — proposed design

**Date:** 2026-11-15  
**Target branch:** `fix/ai-lab-grounded-role-fit` (preserve its existing factual-grounding fix).  
**Status:** Proposed for review; no implementation is authorized by this document alone.

## Intent and audience

Help a portfolio visitor or recruiter understand **where Cove's documented work directly matches a posted role, what is transferable, and what is unestablished**. The visitor should learn something useful about the candidate and the role, not receive a keyword count, inflated praise, or an opaque hiring-probability score.

## Baseline verified in the repository

- Static-export Next.js 16 / React 19 site with client-side AI Lab in `src/components/ai/AI.jsx`, `useRoleFitLab.js` and `roleFit.worker.js`.
- Existing patch `src/utils/roleFitEvidence.mjs` hard-codes a few résumé excerpts and regex keywords; `src/utils/roleFit.js` lets a small WebLLM model select up to four evidence IDs. Results are plain text.
- `public/static/documents/Resume Cove Marquis EN.md` and project narratives under `src/content/texts/projectTexts.js` contain public candidate evidence. Published experience has no professional Java work; the user explicitly confirmed never having worked with Java. Lack of any other technology in the résumé is **not** proof of no experience.
- Posting length currently capped at 3,500 characters. A generation requires WebGPU and the worker. Current shortcut Enter generates; Shift+Enter inserts a newline.
- `next.config.js` uses `output: "export"`. The site cannot depend on server inference or runtime API routes.

## Product behavior

1. **Analyze a role without a model.** Paste up to **12,000 characters**; preserve line breaks, bullets, clauses and punctuation. Reject longer text with a clear message rather than silently dropping requirements. Parse up to **60 requirement groups** and explicitly expose remaining clauses as unparsed, with a partial-coverage notice. Standard Enter inserts a newline; Ctrl/Cmd+Enter analyzes. The baseline report must work without WebGPU, Workers, or a network connection after the site itself has loaded.
2. **Read requirements as requirements.** Extract quoted source spans and classify them as technical capability, engineering practice, seniority/tenure, soft skill, logistics, or unparsed. Identify core/mandatory/preferred/unspecified where supportable, preserve `A or B` as `anyOf`, treat `A and B` as `allOf`, do not interpret slash-separated technologies as an automatic `or`. Keep explicit exclusions and negations distinct from positive requirements.
3. **Build a traceable candidate inventory.** Curate statements from the public résumé and linked portfolio case studies; each item has a stable ID, exact source excerpt, source type/location, skill/competency tags, and documented vs planned status. An item is eligible for a positive claim only if a test confirms its source excerpt exists and is not explicitly future/planned/learning-only. Do not include contact details in any model prompt or report. Preserve an explicit owner-confirmed absence for professional Java experience, but never infer further absences from omitted skills.
4. **Map every extracted requirement to evidence:** `direct`, `transferable`, `not_documented`, or `needs_confirmation`. Direct needs supported task/technology equivalence, not a broad shared word. Transferable needs an explicit curated mapping, with the technical difference stated; no model can promote a speculative mapping to direct. For `A or B`, one verified alternative can satisfy the disjunction; for `A and B`, each required part needs evidence. Logistics remain questions for the candidate, not skill gaps.
5. **Prioritize material gaps.** An explicit must-have or the named core technology of the role can dominate ten secondary matches. Treat soft skills, tenure and location cautiously. Present qualitative conclusions, not percentages, probabilities, fabricated years of experience, or an automated "apply / don't apply" judgment.
6. **Design a concise recruiter-friendly report.** Show role name, a short conclusion with caveats, up to three or four strongest evidence-backed examples (each with source attribution), the most consequential requirements not established, and a grounded recruiter clarification question when useful. Put the complete requirement mapping and source excerpts in an accessible expandable disclosure. Prefer neutral third-person narration to avoid pretending this was written personally by the candidate. Show a visible note that public résumé/project evidence is self-described and not independently employment-verified.
7. **Offer an optional AI enhancement.** Remove the eager WebLLM module import from baseline code; load the existing WebLLM worker only on explicit opt-in. It may propose requirement spans/grouping, priorities and eligible evidence IDs in a schema-bound response. Validate every field against exact posting substrings, known IDs and immutable source excerpts. Reject or downgrade invalid suggestions; never let generated prose or model-chosen IDs become unverified claims. Missing/failed/unsupported inference leaves the deterministic report available. Only download/model-load on explicit enhancement action, with progress and a clear size/performance warning.
8. **Measure rather than assume that a larger model helps.** Compare the current configured small model with a small number of candidates actually present in the installed `@mlc-ai/web-llm@0.2.81` registry. Verify response schema compatibility in the pinned version and on target browsers before relying on JSON-mode. Record first-run download, startup, inference, peak visible memory behavior where inspectable, accuracy on labeled difficult cases, and perceived responsiveness. Ship a larger default/option only when it adds real value without unacceptable cost; otherwise keep the smaller model or baseline-only analysis.

## Chosen approach and alternatives

**Chosen: deterministic evidence-led pipeline with optional validated local-model suggestions.** It preserves factual guardrails and privacy, works on unsupported browsers, and makes improvement measurable. Pure regex-only scoring fails nuanced requirement interpretation; allowing an LLM to directly author a persuasive fit summary risks reintroducing unsupported claims; server/cloud scoring conflicts with the static/private design. The model is an optional interpreter, **not** the authority on candidate experience.

## Data and trust contract

```
RoleRequirement = {
  id, quote, span: {start, end},
  category: "technical" | "practice" | "tenure" | "soft_skill" | "logistics" | "other",
  importance: "core" | "required" | "preferred" | "unspecified",
  options: [{key, label}], optionRule: "anyOf" | "allOf" | "single" | "ambiguous",
  extraction: "rule" | "model_verified", needsReview
}

EvidenceItem = {
  id, sourceType: "resume" | "project" | "owner_confirmation",
  sourceId, sourceQuote, sourceUrl?, label, capabilities: [canonicalKey],
  maturity: "documented" | "learning" | "planned",
  experienceType: "professional" | "other" | "unclaimed",
  explicitlyAbsent?: [canonicalKey]
}

RequirementMatch = {
  requirementId,
  status: "direct" | "transferable" | "not_documented" | "needs_confirmation",
  evidenceIds: [id], rationaleCode, unresolvedOptions: [canonicalKey]
}

RoleFitAssessment = {
  roleTitle, conclusion: {kind, heading, summary},
  highlights: [RequirementMatch], criticalGaps: [RequirementMatch],
  otherGaps: [RequirementMatch], conditions: [RequirementMatch],
  clarificationQuestion?, details: [RequirementMatch], unparsedQuotes: [string],
  coverageNote, mode: "baseline" | "enhanced"
}
```

A span always refers to the **normalized display posting** (line breaks preserved), not to a truncated model prompt. No external data source or model response is trusted as a résumé fact. If parsing is partial, show that uncertainty rather than quietly omitting requirements.

## Privacy, safety and accessibility

- The pasted posting and derived analysis remain in the current tab's memory. Do not send them to analytics, a remote inference service, logs, query strings, storage, clipboard without intent, or model-download URLs. Third-party model assets may still be fetched; clearly distinguish this from uploading the posting.
- Limit text length to 12,000 characters and structured requirements to 60 groups; surface any overflow in the report. Also bound prompt length and model output. Render all untrusted posting/model excerpts as React text, never raw HTML. No privileged runtime credentials.
- If the input changes, Reset is pressed, the component unmounts, the model fails, or an older request finishes late, stale results cannot overwrite the current analysis. When input is edited the old report is cleared or explicitly marked stale. Baseline results remain usable during enhancement and after a failed enhancement.
- Semantic headings, focus movement/announcement, labelled requirements and disclosure controls, keyboard-only operation, touch layouts, high contrast, dark/light themes and reduced motion are required. Avoid a sprawling admin-like dashboard.
- Do not imply independent verification, certainty of non-experience (except explicit owner confirmation), legal hiring compliance or hiring probability.

## Completion criteria

- The Java/J2EE/Spring Wissen scenario explicitly reports the **core Java-stack mismatch**, while citing actual REST, microservice and React experience; JavaScript is never mistaken for Java.
- `React or Vue` is evaluated as one alternative requirement; `Java and Spring` needs evidence for each; `no Java required` creates no Java deficit; optional skills never dominate core must-haves.
- Nontechnical/ambiguous requirements, years, onsite demands and out-of-vocabulary tools are represented honestly, not silently called matches or absences.
- All positives trace to exact résumé/project source excerpts. Planned projects, learning-only skills, model output, and the employer's posting cannot be used as professional experience.
- Users without WebGPU receive a useful baseline report; enhancer failure, reset, edits and late responses do not erase or contaminate a newer result.
- Short initial presentation; expandable provenance and full requirement list; keyboard/screen-reader/mobile/theme checks pass.
- Reproducible fixture evaluation and recorded model/browser tradeoffs; deterministic tests, lint, Next static build and real browser smoke checks pass before a PR is proposed.

## Migration constraint

The current `useRoleFitLab.js` imports `formatGroundedRoleFit`, and `roleFit.js` imports `matchRoleFitEvidence`. Extend the evidence module without removing these exports until the hook, model prompt and tests have been migrated. Ensure that each implementation task leaves the existing static build functional, rather than relying on a later task to repair an intermediate broken UI.
