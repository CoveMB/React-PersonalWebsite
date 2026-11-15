# Evidence-Grounded Role-Fit Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the portfolio's AI Lab into a useful, concise, requirement-centered hiring-role analysis with verifiable claims, honest skill gaps, and optional local-model refinement.

**Architecture:** Preserve the existing browser-only static Next.js app and factual-grounding branch. A deterministic pipeline extracts individual job requirements, matches them to a curated, source-checked résumé/project evidence catalog, determines the importance of gaps, and returns structured result data. An optional WebLLM worker proposes only schema-validated interpretations; the same deterministic evidence rules remain authoritative. Render a lean summary with expandable supporting detail.

**Tech Stack:** Next.js 16 (static export), React 19, JavaScript/`.mjs`, Sass, existing `@mlc-ai/web-llm@0.2.81`, Node built-in test runner, Yarn. Browser smoke checks may use `@playwright/test` as a development-only dependency for actual interaction flows.

**Spec:** `docs/superpowers/specs/2026-11-15-role-fit-assessment-design.md`

**Baseline:** `fix/ai-lab-grounded-role-fit`, preserving the two factual-grounding commits present before this planning work. **Plan only:** do not implement, open a PR, or merge until the owner approves.

## Global Constraints

- Preserve local-only job-description processing; model assets may be downloaded but posted role text, derived results and contact details may not be sent to a service, analytics, logs, URL parameters, or browser storage.
- No server routes, authentication, backend AI API, external embeddings/index, remote job parsing or persistence. Maintain Next `output: "export"`.
- Do not claim experience from the job description, unsupported model text, planned/unshipped work or learning-only skills. The user confirmed **no professional Java experience**; otherwise say **not documented**, not **does not have**.
- Positive evidence must be backed by an exact excerpt from public résumé or published project narratives, carry source attribution, and survive source-consistency tests. Do not ship unverifiable dates, outcomes, levels, or metrics.
- The immediate baseline analysis works without WebGPU or a Worker; model enhancement is explicit opt-in and can never degrade/remove that result.
- Render a compact first screen, then progressive disclosure; keep the existing portfolio's light/dark, typography, spacing and mobile design conventions rather than adding a dashboard.
- Distinguish direct, transferable, not documented and needs confirmation; no automated fit percentage/probability, ungrounded year totals or automated apply/don't-apply recommendation.
- Job input maximum: 12,000 characters (hard error above limit; no silent truncate); at most 60 structured requirement groups, with excess clauses surfaced in an explicit partial-coverage notice. Preserve human-readable line breaks. Enter = newline; Ctrl/Cmd+Enter = analyze.
- Use the existing Yarn lockfile. Keep the existing WebLLM package pinned for initial feasibility checks; update dependency versions only if compatibility evidence justifies it.
- Each task follows red → green → review → small commit. Do not claim the feature is ready without fresh test/build/browser results and human review of the example outputs.

## Target file map and responsibility

| Path | Responsibility |
| --- | --- |
| `src/utils/roleFitEvidence.mjs` | Add a curated, source-backed catalog and owner-confirmed negatives; preserve legacy exports until their callers migrate |
| `src/utils/roleFitTaxonomy.mjs` (new) | Canonical capability aliases, literal technical terms, and explicitly curated transferable relations used by parser and matcher |
| `src/utils/roleFitRequirements.mjs` (new) | Normalize and extract source-anchored role requirements, alternatives, importance, negation, tenure and logistics |
| `src/utils/roleFitMatching.mjs` (new) | Direct / transferable / undocumented / needs-confirmation matching with source IDs and unresolved alternatives |
| `src/utils/roleFitAssessment.mjs` (new) | Salience, qualitative verdict, top evidence/gaps, recruiter question and full structured report |
| `src/utils/roleFit.js` | WebLLM model selection, constrained request builder, and validated enhancement suggestions; retire old free-form prose format |
| `src/components/ai/useRoleFitLab.js` | Orchestrate instant baseline, optional worker, stale-request guards, reset, error/fallback, and structured state |
| `src/components/ai/RoleFitReport.jsx` (new) | Accessible, concise report with source-linked evidence and expandable requirement-by-requirement mapping |
| `src/components/ai/AI.jsx` | Input, keyboard shortcut, enhancement opt-in, progress and result surface |
| `src/content/roleFitLabContent.js`, `src/content/texts/roleFitTexts.js`, `public/static/css/_ai.scss` | Accurate copy, model/privacy disclosure, visual and responsive presentation |
| `tests/roleFitEvidence.test.mjs` (existing), `tests/roleFitRequirements.test.mjs`, `tests/roleFitMatching.test.mjs`, `tests/roleFitAssessment.test.mjs`, `tests/roleFitEnhancement.test.mjs` (new) | Deterministic behavior and source integrity |
| `tests/fixtures/roleFitJobs.mjs` (new) | Small, anonymized, manually labeled adversarial and representative role-posting corpus |
| `tests/e2e/roleFit.spec.mjs` (new), `playwright.config.mjs` (new) | Browser smoke and keyboard/fallback/stale-result verification; development-only browser runner |
| `package.json`, `yarn.lock` | Test scripts and any justified development-only test dependency |
| `docs/role-fit-evaluation.md` (new) | Human evaluation rubric, local model/browser benchmark observations, privacy and shipping decisions |

**Existing callers to keep compatible:** `AI.jsx` is mounted from `src/components/App.jsx`; `useRoleFitLab.js` imports `buildRoleFitMessages`, `selectRoleFitModelId`, and `formatGroundedRoleFit`; `roleFit.js` still calls `matchRoleFitEvidence`. Preserve these old named exports until the last caller migrates in **Task 7**; do not create an intermediate broken build. Audit and update all references then delete obsolete exports. Keep `roleFit.worker.js`; load WebLLM dynamically rather than at the module top level.

## Review Focus — highest-risk examples

1. **Java ≠ JavaScript / no source laundering:** an advert for Senior Java/Spring with React and REST still reports a core Java gap, not professional Java experience; tests in Tasks 1–4.
2. **Scope of requirement qualifiers:** `React or Vue`, `Java and Spring`, `no Java required`, `Angular/React/Vue - good to have`, and `six years' Java` vs `six years' software engineering` stay distinct; Task 2/3 tests.
3. **Unknown or unverifiable evidence:** an unlisted technology, vague soft skill, planned client portal or claimed productivity metric does not become a positive match or an asserted absence; Tasks 1/3/4 tests.
4. **Untrusted/long posting:** line breaks, headings, copied bullets, HTML-looking text, prompt injection, very long descriptions and multiple alternatives neither crash nor leak nor silently disappear; Tasks 2/7/8 tests.
5. **Real browser lifecycle:** no WebGPU, blocked model download, invalid JSON, edit/reset during model load, late completion, reduced motion, keyboard and small mobile screen leave a truthful usable baseline; Tasks 5–8 tests.

---

### Task 1: Create a canonical, source-checked candidate evidence catalog

**Files:** Modify `src/utils/roleFitEvidence.mjs`, `tests/roleFitEvidence.test.mjs`; create `src/utils/roleFitTaxonomy.mjs`.

**Interfaces:**
- Produce `roleFitEvidenceCatalog: EvidenceItem[]`; `getRoleFitEvidenceCatalog(): EvidenceItem[]` returns the stable curated data.
- Produce `normalizeCapability(term): string | null` and `getTransferableRelations(capabilityKey): Array<{candidateKey, reasonCode}>`.
- Each evidence item has `sourceType`, stable `sourceId`, exact `sourceQuote`, `sourceUrl?`, `capabilities`, `maturity`, `experienceType`; an explicit, separately identified owner confirmation may record absent professional Java experience.

- [ ] **Step 1 — RED:** Add tests that each résumé excerpt occurs exactly in `Resume Cove Marquis EN.md`, each project excerpt occurs in the published `projectNarrativeTextById` material, identifiers are unique, all positive evidence excludes planned/learning-only claims, and only an explicit owner confirmation supports a negative Java assertion. Test that Java and JavaScript normalize to different keys.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitEvidence.test.mjs`; expect the new catalog contract assertions to fail on the old implementation.
- [ ] **Step 3 — implement:** **Extend** the existing evidence module with catalog exports; keep `matchRoleFitEvidence` and `formatGroundedRoleFit` usable until their consumers are migrated. Curate backend/frontend, architecture, deployment, testing, product, mentoring, UX, analytics, consulting and blockchain examples from *actual* résumé and case studies. Reuse source texts without a duplicate generated résumé or contact details; distinguish professional, learning and planned work.
- [ ] **Step 4 — GREEN + inspect:** `node --test tests/*.test.mjs` and `yarn build` pass without changing current AI Lab behavior; manually inspect every source link and claim against the published text. No invented client impact.
- [ ] **Step 5 — commit:** `git add src/utils/roleFitEvidence.mjs src/utils/roleFitTaxonomy.mjs tests/roleFitEvidence.test.mjs && git commit -m "feat(ai-lab): catalog verifiable career and project evidence"`

### Task 2: Extract a structured, source-anchored requirement inventory

**Files:** Create `src/utils/roleFitRequirements.mjs`, `tests/roleFitRequirements.test.mjs`; modify `tests/fixtures/roleFitJobs.mjs` (create it here).

**Interfaces:**
- `normalizeRolePosting(text: string): string` preserves meaningful separators and line breaks.
- `parseRoleRequirements(text: string): RoleRequirement[]` accepts normalized text; IDs and `span.start/end` are stable within that text; `quote === text.slice(start,end)`.
- `RoleRequirement` follows the Spec fields, with `optionRule: "anyOf"|"allOf"|"single"|"ambiguous"`; inferred `importance` must remain `unspecified` when no reliable textual/role-title signal exists.

- [ ] **Step 1 — RED:** Add table tests for Senior Java title/core inference, Java vs JavaScript, slash ambiguity, `React or Vue` and comma-list `Angular, React, or Vue` disjunctions, `Java and Spring` conjunction, trailing good-to-have scoped to its clause, exclusion/negation, skill-specific vs generic tenure, onsite as logistics, soft skills, repeated mentions, unfamiliar terms, Unicode/CRLF spans, pasted HTML/prompt-like text, and more than 60 requirements. Overflow must remain visible as unparsed clauses. The UI input-length validation is tested when the hook changes in Task 5.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitRequirements.test.mjs`; expect missing exports to fail.
- [ ] **Step 3 — implement:** Segment by headings, lines, sentence/semicolon boundaries and known list separators; preserve quotations/offsets. Apply a small, explicit taxonomy for known capabilities and leave unknown clauses as `category: "other", needsReview: true`. Support limited `anyOf/allOf` only when unambiguous; no generic semantic guessing or false precision. Keep at most 60 requirement groups and retain surplus source clauses as unparsed text with an explicit incomplete-coverage flag.
- [ ] **Step 4 — GREEN + check:** `node --test tests/roleFitRequirements.test.mjs` passes; inspect the extracted inventory for the user-supplied Wissen posting; no orphaned core requirements or logistical requirements misclassified as experience.
- [ ] **Step 5 — commit:** `git add src/utils/roleFitRequirements.mjs tests/roleFitRequirements.test.mjs tests/fixtures/roleFitJobs.mjs && git commit -m "feat(ai-lab): extract source-anchored role requirements"`

### Task 3: Match requirements to direct or genuinely transferable experience

**Files:** Create `src/utils/roleFitMatching.mjs`, `tests/roleFitMatching.test.mjs`; modify taxonomy and evidence catalog only for grounded missing mappings.

**Interfaces:**
- `matchRoleRequirements(requirements: RoleRequirement[], evidenceCatalog: EvidenceItem[]): RequirementMatch[]`; preserve a row for **every** requirement, in original order.
- `RequirementMatch` contains `requirementId`, `status`, `evidenceIds`, `rationaleCode`, `unresolvedOptions`. Source IDs refer only to catalog items.
- Direct requires documented evidence and a validated capability match. Transferable uses curated mappings and explanatory differences (example: Node.js microservices vs Java microservices), not an unrestricted similarity score.

- [ ] **Step 1 — RED:** Test that React satisfies `React or Vue` but not `React and Vue`; Node.js does not directly satisfy Java; required Java + Spring remains a core gap; React, REST, AWS and CI/CD are directly evidenced, while HTML5/CSS3 cannot be directly inferred from a React project; Kubernetes/Azure/Python are not documented; planned portal and learning Rust are ineligible for professional claims; communication/logistics/years are not guessed.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitMatching.test.mjs`; expect failure.
- [ ] **Step 3 — implement:** Use only catalog keys, explicit eligibility and relation rules. A missing source becomes `not_documented`, not `does_not_have`; logistics become `needs_confirmation`. Deduplicate repeated clauses without dropping the original audit trail, and keep original option alternatives and remaining gaps visible.
- [ ] **Step 4 — GREEN + source audit:** `node --test tests/roleFitMatching.test.mjs` passes; trace every displayed direct/transferable item to a legitimate source ID.
- [ ] **Step 5 — commit:** `git add src/utils/roleFitMatching.mjs src/utils/roleFitTaxonomy.mjs src/utils/roleFitEvidence.mjs tests/roleFitMatching.test.mjs && git commit -m "feat(ai-lab): distinguish direct, transferable, and undocumented requirements"`

### Task 4: Build qualitative conclusions and a structured result

**Files:** Create `src/utils/roleFitAssessment.mjs`, `tests/roleFitAssessment.test.mjs`; adapt tests in `tests/roleFitEvidence.test.mjs` where they still assert old plain-text formatting.

**Interfaces:**
- `buildRoleFitAssessment({jobText, requirements, matches, evidenceCatalog, mode = "baseline"}): RoleFitAssessment`.
- Conclusions use `conclusion.kind`: `"documented_alignment"|"transferable_core_gap"|"mixed_evidence"|"insufficient_evidence"|"insufficient_role_details"`; no numeric weighting or percentages.
- `clarificationQuestion` uses a documented transferable skill and a source-quoted core gap, or is omitted.

- [ ] **Step 1 — RED:** Test outcomes for Wissen (transferable with core Java gap), an aligned React/TypeScript role, a role with only unsupported skills, optional-only misses, unknown/soft-skill-heavy postings, and a role with no reliably extracted requirements. Test that "six years" in the posting never turns into candidate tenure, that unparsed clauses appear in `unparsedQuotes`, and that core mismatches dominate many ancillary strengths.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitAssessment.test.mjs`; expect failure.
- [ ] **Step 3 — implement:** Rank by explicit role priority/core status, not keyword count; choose at most four nonduplicate evidence highlights and the consequential gaps. Generate bounded neutral third-person sentences from validated fields and codes; give recruiter question only where it reflects a real role ambiguity or gap. Keep all raw requirements in `details` for audit.
- [ ] **Step 4 — GREEN + output review:** `node --test tests/roleFitAssessment.test.mjs` passes; compare actual Wissen rendering data with the Spec's completion criteria and manually flag formulaic or misleading wording.
- [ ] **Step 5 — commit:** `git add src/utils/roleFitAssessment.mjs tests/roleFitAssessment.test.mjs tests/roleFitEvidence.test.mjs && git commit -m "feat(ai-lab): produce materiality-aware, explainable assessments"`

### Task 5: Ship the baseline analysis and accessible report together

**Files:** Create `src/components/ai/RoleFitReport.jsx`, `tests/e2e/roleFit.spec.mjs`, `playwright.config.mjs`; modify `src/components/ai/AI.jsx`, `src/components/ai/useRoleFitLab.js`, `src/content/roleFitLabContent.js`, `src/content/texts/roleFitTexts.js`, `public/static/css/_ai.scss`, `package.json`, `yarn.lock`.

**Interfaces:**
- `<RoleFitReport assessment={RoleFitAssessment} />` is presentational; it neither parses nor scores.
- Analyze synchronously calls `normalizeRolePosting → parseRoleRequirements → matchRoleRequirements → buildRoleFitAssessment`. `roleFitState.result` becomes a structured object; no WebLLM, WebGPU, Worker or network required.
- `getJobDescriptionErrorMessage(input): string` enforces the 12,000-character limit without truncating. Input edits invalidate the old report.
- Source links use eligible catalog evidence; native `<details><summary>` reveals the complete requirement/evidence mapping.

- [ ] **Step 1 — RED + browser harness:** Add `@playwright/test` as a development-only dependency with Yarn, create its web-server config for the local Next site, install Chromium locally, then write failing UI tests for the Wissen scenario: show a structured Java core-gap report with true REST/React sources, no GPU prerequisite, usable disclosure, standard Enter/newline plus Ctrl/Cmd+Enter Analyze, and a clear error when input exceeds 12,000 characters.
- [ ] **Step 2 — verify RED:** `yarn playwright test tests/e2e/roleFit.spec.mjs`; expect FAIL because the current UI only prints `<pre>` and Analyze still requires WebGPU.
- [ ] **Step 3 — implement:** Integrate the deterministic pipeline into the hook **in the same task** that replaces old `<pre>` with `RoleFitReport`. Remove the eager top-level WebLLM import from the hook so unsupported browsers can load the baseline. Show title, succinct neutral conclusion, up to four traced examples, critical gaps, optional recruiter question, source links and accessible details. Keep existing design tokens, mobile layout, focus and concise ARIA status. Restore Enter for newlines; Ctrl/Cmd+Enter analyzes. Clear or mark the old report stale on edit/Reset; reject over-length input without truncation.
- [ ] **Step 4 — GREEN + check:** Run `node --test tests/*.test.mjs`, `yarn playwright test tests/e2e/roleFit.spec.mjs`, `yarn lint` and `yarn build`. Visually review 320px/390px and desktop, dark/light, keyboard navigation, reduced motion and source attribution. Confirm baseline works with GPU and Worker disabled; old exports remain until Task 7.
- [ ] **Step 5 — commit:** `git add src/components/ai/RoleFitReport.jsx src/components/ai/AI.jsx src/components/ai/useRoleFitLab.js src/content/roleFitLabContent.js src/content/texts/roleFitTexts.js public/static/css/_ai.scss tests/e2e/roleFit.spec.mjs playwright.config.mjs package.json yarn.lock && git commit -m "feat(ai-lab): deliver immediate accessible role-fit report"`

### Task 6: Make enhancement lifecycle safe before introducing model output

**Files:** Modify `src/components/ai/useRoleFitLab.js`; add `tests/roleFitEnhancement.test.mjs` and extend `tests/e2e/roleFit.spec.mjs`.

**Interfaces:**
- `inputRevision` (or a ref-backed equivalent) increments on edit, Reset, new Analyze and unmount. A promise from an older revision must never mutate the current report.
- A bounded async `enhanceRoleFitWith(requestRevision, producer)` controller accepts an injected producer and uses the same revision and safe-result checks later used by the actual WebLLM provider in Task 7.
- The visible baseline persists while enhancement is running or has failed; the final opt-in UI will only be exposed when Task 7 connects a real provider.

- [ ] **Step 1 — RED:** Write pure state/revision tests and fake-producer browser tests: edit after analysis invalidates old output; Reset clears it; slow response from old posting is discarded after a newer Analyze; failed/empty producer keeps baseline; unmount prevents updates.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitEnhancement.test.mjs && yarn playwright test tests/e2e/roleFit.spec.mjs`; expected FAIL on the new delayed-response cases.
- [ ] **Step 3 — implement:** Keep existing reducer/hook conventions; add one revision guard and a small injectable async boundary, not a state-management framework. Ignore late completions and handle cleanup when the worker exists. Do not add a visible but inoperative "enhance" control or global cache.
- [ ] **Step 4 — GREEN:** Run the same Node/browser tests plus `yarn lint`; inspect rapid edit/reset/retry flows. Every success/error state must refer to the current posting.
- [ ] **Step 5 — commit:** `git add src/components/ai/useRoleFitLab.js tests/roleFitEnhancement.test.mjs tests/e2e/roleFit.spec.mjs && git commit -m "fix(ai-lab): ignore stale asynchronous role analyses"`

### Task 7: Add validated, opt-in semantic enhancement and benchmark candidate models

**Files:** Modify `src/utils/roleFit.js`, `src/components/ai/useRoleFitLab.js`, `src/components/ai/AI.jsx`, `src/content/roleFitLabContent.js`; create/extend `tests/roleFitEnhancement.test.mjs` and `docs/role-fit-evaluation.md`.

**Interfaces:**
- `buildRoleFitEnhancementRequest({jobText, requirements, evidenceCatalog}): {messages, responseFormat?}` sends a bounded, contact-free subset of the posting and verified evidence IDs.
- `validateRoleFitEnhancement(rawResponse, {jobText, requirements, evidenceCatalog}): {additionalRequirements, rankedEvidenceIds}` accepts only schema-compliant, known IDs and source-exact posting spans; unknown suggestions become needs-review and cannot become new résumé facts.
- `applyRoleFitEnhancement(baselineAssessment, validatedSuggestions): RoleFitAssessment` can improve requirement coverage/order, never bypass matching or demote an established critical gap without validated direct evidence.

- [ ] **Step 1 — RED:** Add tests for invalid/partial/oversized JSON, unknown evidence IDs, invented excerpts, injection text such as "I worked in Java", wrong spans, unsupported inferred synonyms, a suggested new unknown requirement, a legitimate previously missed quoted requirement, and unchanged baseline on failure. Confirm no contact information from the résumé is sent in prompts.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitEnhancement.test.mjs`; expect failure.
- [ ] **Step 3 — implement:** Keep the existing WebLLM worker and load it via guarded dynamic import only on an explicit "Enhance locally" action. Check JSON schema support against **installed** 0.2.81 before relying on `response_format`; when unsupported, parse defensively or disable enhancement with an honest message. Validate suggestions, then rerun the deterministic matcher/assessment for any accepted new requirement. Limit prompt/output lengths and show download/progress/failure status. Remove the legacy `buildRoleFitMessages`, `matchRoleFitEvidence` and `formatGroundedRoleFit` only after all hooked callers and tests are migrated. No server fallback, auto-download or unchecked generation.
- [ ] **Step 4 — compare models and record decision:** On real supported hardware, run the same difficult fixture corpus through the existing Qwen 0.5B preference and one or two actually registered compatible larger options; record quality (especially critical gaps and unsupported claims), first-load size/time, warm speed and browser-memory issues. Choose enhanced option only if it corrects real baseline interpretation errors without critical regressions and with acceptable performance; otherwise retain the smaller candidate or offer baseline only. Record measured tradeoffs, browser versions and actual selected model ID in `docs/role-fit-evaluation.md`.
- [ ] **Step 5 — GREEN + commit:** `node --test tests/roleFitEnhancement.test.mjs` passes; run supported browser model smoke and fallback checks; commit only evidence-backed configuration, `git add src/utils/roleFit.js src/components/ai/useRoleFitLab.js src/components/ai/AI.jsx src/content/roleFitLabContent.js tests/roleFitEnhancement.test.mjs docs/role-fit-evaluation.md && git commit -m "feat(ai-lab): validate optional local-model interpretation"`

### Task 8: Evaluate quality, browser behavior, accessibility and preservation before PR

**Files:** Modify `tests/fixtures/roleFitJobs.mjs`, the relevant `tests/*.test.mjs` files, `tests/e2e/roleFit.spec.mjs`, and `docs/role-fit-evaluation.md`; update implementation files only for reproduced failures. Playwright config and its development-only dependency were created in Task 5.

**Interfaces:**
- The existing Node tests run at least **20** anonymized, hand-labeled fixtures through the shipped parser/matcher/assessment; do not create a separate evaluator abstraction merely to count fixtures.
- Browser tests reuse Task 5's local Next/static-build harness. A mockable enhancer boundary simulates delay/failure without downloading a GPU model in CI.

- [ ] **Step 1 — RED:** Write human-labeled fixtures for Java/Spring, full-stack TypeScript, blockchain, consulting/product, analytics, generic soft skills, seniority, no-match cases, negation, disjunction, optional requirements, slash ambiguity, unfamiliar stacks, repeated/messy posting, long input, malicious prompt text and model failures. Add explicit expectations for critical gaps, verdict kind, source IDs, warnings and omitted claims.
- [ ] **Step 2 — verify RED:** Run `node --test tests/*.test.mjs`; expect new fixtures to reveal unhandled cases before the shared parser/matcher is repaired. Reuse the Task 5 Playwright harness rather than adding another browser-testing system.
- [ ] **Step 3 — extend real user-flow coverage:** Use the existing browser suite to cover malformed copied text, baseline without GPU/Worker, accessible disclosure, keyboard shortcut, Reset/edit during pending enhancement, invalid/late model response, component cleanup, 320px layout, short focus/ARIA status and the absence of role text in network requests/URLs. Manually check screen readers, another browser, light/dark and reduced motion. Keep unreviewed screenshots/traces out of the repo.
- [ ] **Step 4 — verify and fix real findings:** Run `node --test tests/*.test.mjs`, `yarn lint`, `yarn build`, and `yarn playwright test` if Playwright was added; serve `out` and smoke the exported site in current Chromium and another browser. Check console/network for posting leakage (including analytics), model-download behavior and worker teardown. Run separate architecture/evidence, parsing/model, UX/a11y, privacy/security, and performance reviews; fix concrete issues and rerun affected checks.
- [ ] **Step 5 — document final judgment + commit:** Record before/after outputs, the qualitative human rubric (critical gap, transfer difference, concrete source, honest uncertainty, readability), model choice, browser compatibility, limitations and actual test outputs in `docs/role-fit-evaluation.md`. Recheck diff against `master`; perform a new Ponytail correctness → safety → realistic load → tests → speed → lean review on the *implemented* change. `git add tests docs/role-fit-evaluation.md && git commit -m "test(ai-lab): evaluate grounded role-fit quality and browser behavior"`. Do not merge or deploy without owner approval.

## Acceptance gates and implementation handoff

- **Factual correctness:** zero unsupported *positive* experience claims in the curated evaluation corpus; the Java posting clearly says professional Java is absent based on owner confirmation and Spring/J2EE/Hibernate are not documented; required/core gaps are not buried.
- **Coverage and honesty:** every extracted requirement appears in the expandable inventory, including alternative groups and work conditions; genuinely unparsed clauses are flagged for review rather than silently dropped.
- **Meaningfulness:** compared with the current branch output, a human reviewer can identify the top fit, a consequential mismatch and at least one useful concrete example or clarification; test hard counterexamples before claiming overall improvement.
- **Local resilience:** baseline works without GPU; enhancement only after consent; failures and stale responses never overwrite a newer or valid baseline; no input leakage.
- **Accessibility and product quality:** concise top section, semantically accessible details, mobile/theme/keyboard checks, no fake numeric score and no administrative/dashboard feel.
- **Evidence before ship:** record test command output, browser/device/model specifics and unresolved limitations. Prepare a PR only after human approval and actual implementation.

## Reviewed plan — distinct focus passes and Ponytail-style review

**Scope of review:** plan, design spec, relevant connected code and current tests. These are distinct manual analytical review passes, **not external independent agent executions**. The native Ponytail runner was unavailable; published `ponytail` and `ponytail-review` instructions were followed as a manual final pass.

| Pass | Concrete issue identified | Correction applied |
| --- | --- | --- |
| Architecture / integration | Building the report in the old Task 5, then changing the hook in old Task 6, could leave `<pre>` rendering a structured object; browser tests were also scheduled too late. | Replaced Task 5 with a **single end-to-end baseline vertical slice**, adding the browser harness and hook integration together. |
| Semantic requirements | The last `or` in `Angular, React, or Vue` can be missed; a React project does not prove the candidate explicitly used HTML5/CSS3. | Added comma-list/disjunction and HTML/CSS evidence regression checks to Tasks 2 and 3. |
| Evidence and truthfulness | The absence of a résumé keyword could be wrongly phrased as an absence of experience; planned or learning work could be presented as professional achievements. | Separate `not_documented` from owner-confirmed Java non-experience; source-verified professional/learning/planned catalogs in Tasks 1–3. |
| Product and accessibility | Existing Enter-to-submit makes multiline input awkward, and a result may still describe an earlier posting after a user edits it. | Standard Enter/newline, Ctrl/Cmd+Enter analysis, stale-report invalidation, semantic report/disclosure and keyboard/focus smoke in Task 5. |
| Privacy and failure behavior | An eager WebLLM import could break a non-WebGPU baseline; invalid JSON and late worker results could replace valid reports. | Require lazy guarded import, redacted source-only prompts, schema validation, revision checks, retained baseline and real network-leak tests in Tasks 5–8. |
| Model and evaluation | "Larger" does not imply better; JSON-mode support in current docs does not prove compatibility with pinned WebLLM 0.2.81. | Task 7 requires real version/browser checks and on-device comparison; no model upgrade without improved labeled results and acceptable cost. |
| Realistic load | A long posting with many clauses could silently overflow model/requirement limits. | Explicit 12,000-character limit, at most 60 structured requirement groups, and visible partial-coverage warning/overflow fixtures in Tasks 2 and 8. |
| Verification sequencing | UI tests and source-check interfaces could fail between tasks if downstream consumers still imported deleted exports. | Browser runner and baseline/hook land together in Task 5; legacy exports stay until Task 7 migrates every caller; each integration runs a real build. |

### Ponytail instruction-based pass: correct → safe → expected load → tested → fast → lean

**What this plan changes:** The role-fit feature becomes a concise, evidence-backed requirement analysis. It keeps optional browser-side AI as a helper, while a small deterministic system remains the authority on professional claims.

- **Correct:** Followed `AI.jsx → useRoleFitLab.js → roleFit.js / roleFitEvidence.mjs`, the public résumé, project narratives, CSS and test scripts. The plan now updates connected callers in one testable slice; alternative requirements and gaps have explicit tests.
- **Safe:** Preserve local-only processing, React text rendering (no untrusted HTML), exact source verification, no unsupported professional claims, no overwriting from stale requests, and no quiet data leaks.
- **Expected load:** One public statically exported site, independent user browsers, up to 12,000 characters per posting and 60 parsed groups. No queues, database, backend or third-party inference service warranted.
- **Tested:** Source-integrity assertions, focused parser/matcher/verdict tests, hand-labeled adversarial corpus, browser lifecycle tests and full static-build/visual/accessibility review are planned. No implementation test runs are being claimed now.
- **Fast:** Immediate local baseline, lazy and consented model download, bounded prompt and on-device measurements before picking a heavier model.
- **Lean:** Reuse the existing worker, source content, Sass tokens, Node test runner and one Playwright development-only harness. No vector database, embedding framework, scoring service, speculative dashboards, persistence or meaningless percentages. Separate files only for independently testable parser/matcher/assessment/catalog duties.

**Final planning verdict:** Ready for owner review. No unresolved Must/Should finding after the above corrections.  
**Not checked:** Actual model support, browser screenshots, assistive-technology navigation, Next build and runtime performance; the implementation tasks explicitly require those checks.  
**This review did not implement product code.**
