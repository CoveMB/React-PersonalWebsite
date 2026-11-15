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
- Job input maximum: 12,000 characters (hard error above limit; no silent truncate). Preserve human-readable line breaks. Enter = newline; Ctrl/Cmd+Enter = analyze.
- Use the existing Yarn lockfile. Keep the existing WebLLM package pinned for initial feasibility checks; update dependency versions only if compatibility evidence justifies it.
- Each task follows red → green → review → small commit. Do not claim the feature is ready without fresh test/build/browser results and human review of the example outputs.

## Target file map and responsibility

| Path | Responsibility |
| --- | --- |
| `src/utils/roleFitEvidence.mjs` | Replace brittle selected-output/regex catalog with curated, source-backed evidence items, capability mapping and explicit owner-confirmed negatives |
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

**Existing callers to keep compatible:** `AI.jsx` is mounted from `src/components/App.jsx`; `useRoleFitLab.js` imports `buildRoleFitMessages`, `selectRoleFitModelId`, and `formatGroundedRoleFit`. Audit and update all in-repo references before deleting exports. Retain `roleFit.worker.js` and the already-working engine lifecycle unless a measured problem requires a change.

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
- [ ] **Step 3 — implement:** Curate relevant backend/frontend, architecture, deployment, testing, product, mentoring, UX, analytics, consulting and blockchain examples from *actual* résumé and case studies. Reuse existing text sources; do not create an auto-generated résumé clone or ingest contact information. Move canonical alias definitions to the taxonomy; keep professional versus learned/planned distinctions explicit.
- [ ] **Step 4 — GREEN + inspect:** `node --test tests/roleFitEvidence.test.mjs` passes; manually inspect every proposed source link and claim against the published text. No invented client impact.
- [ ] **Step 5 — commit:** `git add src/utils/roleFitEvidence.mjs src/utils/roleFitTaxonomy.mjs tests/roleFitEvidence.test.mjs && git commit -m "feat(ai-lab): catalog verifiable career and project evidence"`

### Task 2: Extract a structured, source-anchored requirement inventory

**Files:** Create `src/utils/roleFitRequirements.mjs`, `tests/roleFitRequirements.test.mjs`; modify `tests/fixtures/roleFitJobs.mjs` (create it here).

**Interfaces:**
- `normalizeRolePosting(text: string): string` preserves meaningful separators and line breaks.
- `parseRoleRequirements(text: string): RoleRequirement[]` accepts normalized text; IDs and `span.start/end` are stable within that text; `quote === text.slice(start,end)`.
- `RoleRequirement` follows the Spec fields, with `optionRule: "anyOf"|"allOf"|"single"|"ambiguous"`; inferred `importance` must remain `unspecified` when no reliable textual/role-title signal exists.

- [ ] **Step 1 — RED:** Add table tests for Senior Java title/core inference, Java vs JavaScript, slash ambiguity, `React or Vue` disjunction, `Java and Spring` conjunction, trailing good-to-have scoped to its clause, exclusion/negation, skill-specific vs generic tenure, onsite as logistics, soft skills, repeated mentions, unfamiliar terms, Unicode/CRLF spans, and a posting with pasted HTML/prompt-like text. Add a test for the 12,000-character input limit in the UI validation contract.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitRequirements.test.mjs`; expect missing exports to fail.
- [ ] **Step 3 — implement:** Segment by headings, lines, sentence/semicolon boundaries and known list separators; preserve quotations/offsets. Apply a small, explicit taxonomy for known capabilities and leave unknown clauses as `category: "other", needsReview: true`. Support limited `anyOf/allOf` only when unambiguous; no generic semantic guessing or false precision.
- [ ] **Step 4 — GREEN + check:** `node --test tests/roleFitRequirements.test.mjs` passes; inspect the extracted inventory for the user-supplied Wissen posting; no orphaned core requirements or logistical requirements misclassified as experience.
- [ ] **Step 5 — commit:** `git add src/utils/roleFitRequirements.mjs tests/roleFitRequirements.test.mjs tests/fixtures/roleFitJobs.mjs && git commit -m "feat(ai-lab): extract source-anchored role requirements"`

### Task 3: Match requirements to direct or genuinely transferable experience

**Files:** Create `src/utils/roleFitMatching.mjs`, `tests/roleFitMatching.test.mjs`; modify taxonomy and evidence catalog only for grounded missing mappings.

**Interfaces:**
- `matchRoleRequirements(requirements: RoleRequirement[], evidenceCatalog: EvidenceItem[]): RequirementMatch[]`; preserve a row for **every** requirement, in original order.
- `RequirementMatch` contains `requirementId`, `status`, `evidenceIds`, `rationaleCode`, `unresolvedOptions`. Source IDs refer only to catalog items.
- Direct requires documented evidence and a validated capability match. Transferable uses curated mappings and explanatory differences (example: Node.js microservices vs Java microservices), not an unrestricted similarity score.

- [ ] **Step 1 — RED:** Test that React satisfies `React or Vue` but not `React and Vue`; Node.js does not directly satisfy Java; required Java + Spring remains a core gap; frontend/React, REST, AWS, CI/CD are directly evidenced; Kubernetes/Azure/Python are not documented; planned portal and learning Rust are ineligible for professional claims; communication/logistics/years are not guessed.
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

### Task 5: Present a restrained, accessible role-fit report

**Files:** Create `src/components/ai/RoleFitReport.jsx`; modify `src/components/ai/AI.jsx`, `src/content/roleFitLabContent.js`, `src/content/texts/roleFitTexts.js`, `public/static/css/_ai.scss`.

**Interfaces:**
- `<RoleFitReport assessment={RoleFitAssessment} />` is presentational; it never reparses job text or calls the model.
- Source labels/links come from checked evidence source IDs. Expandable details use native `<details><summary>` unless existing site conventions already provide a better accessible control.

- [ ] **Step 1 — RED:** Add a browser smoke expectation (implemented in Task 8) for: conclusion before evidence, up to four strongest examples, core gaps before optional gaps, source labels/links, recruiter question, collapsed full details, visible incomplete-coverage note, and no raw model text. Keep a visual acceptance checklist for 320px/390px, desktop, light/dark and keyboard/screen-reader.
- [ ] **Step 2 — verify RED:** Use a temporary rendered fixture or component assertion so missing `RoleFitReport` fails; do not claim browser coverage until Task 8's runner exists.
- [ ] **Step 3 — implement:** Replace `<pre>` output with semantic sections, concise neutral summary, small evidence/gap groups and a native disclosure for the full table/list. Preserve the existing portfolio theme/spacing; support focus and short status announcements without reading the entire report aloud. Change the textarea help to Enter = newline, Ctrl/Cmd+Enter = analyze. Do not add badges, scores, charts or a nested dashboard for each requirement.
- [ ] **Step 4 — GREEN + visual review:** Run available render/component assertion and `yarn lint`. Manually inspect mobile/dark/reduced-motion and verify source links are safe. Full browser verification happens in Task 8.
- [ ] **Step 5 — commit:** `git add src/components/ai/RoleFitReport.jsx src/components/ai/AI.jsx src/content/roleFitLabContent.js src/content/texts/roleFitTexts.js public/static/css/_ai.scss && git commit -m "feat(ai-lab): show a concise explainable assessment"`

### Task 6: Make the baseline immediate and the lifecycle race-safe

**Files:** Modify `src/components/ai/useRoleFitLab.js`, `src/components/ai/AI.jsx`; add pure lifecycle/state tests in `tests/roleFitAssessment.test.mjs` or `tests/roleFitEnhancement.test.mjs`.

**Interfaces:**
- On Analyze, `normalizeRolePosting → parseRoleRequirements → matchRoleRequirements → buildRoleFitAssessment` completes without WebLLM.
- Keep `roleFitState.result` as a structured assessment object, not a string. `roleFitState` has separate baseline/enhancement status; `isBusy` must not block baseline on WebGPU availability.
- An incrementing request revision/reference ties results to the current input. Reset/edit invalidates pending enhancement; it cannot overwrite newer analysis.

- [ ] **Step 1 — RED:** Add deterministic reducer/revision tests (extract a pure controller helper only if needed) for no WebGPU/Worker, empty/over-limit input, rapid Analyze, Reset during load, input editing during load, thrown model error, invalid model response, unmount, and an older completion arriving after a newer report.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitAssessment.test.mjs tests/roleFitEnhancement.test.mjs`; expect the new lifecycle tests to fail.
- [ ] **Step 3 — implement:** Generate and show baseline immediately; do not require `supportsLocalRoleFit` for Analyze. Retain baseline while optional enhancement loads and after failure. Guard stale completions with a revision token and clean up the worker on unmount. Do not persist or expose input outside component state. Make Reset usable even while enhancing; keep the Analyze action nonblocking.
- [ ] **Step 4 — GREEN + manual check:** Relevant Node tests pass; use browser to test editing and Reset while a slow model is preparing. Verify no obsolete completion changes the visible report or status.
- [ ] **Step 5 — commit:** `git add src/components/ai/useRoleFitLab.js src/components/ai/AI.jsx tests/roleFitAssessment.test.mjs tests/roleFitEnhancement.test.mjs && git commit -m "feat(ai-lab): preserve instant baseline and ignore stale local inference"`

### Task 7: Add validated, opt-in semantic enhancement and benchmark candidate models

**Files:** Modify `src/utils/roleFit.js`, `src/components/ai/useRoleFitLab.js`, `src/components/ai/AI.jsx`, `src/content/roleFitLabContent.js`; create/extend `tests/roleFitEnhancement.test.mjs` and `docs/role-fit-evaluation.md`.

**Interfaces:**
- `buildRoleFitEnhancementRequest({jobText, requirements, evidenceCatalog}): {messages, responseFormat?}` sends a bounded, contact-free subset of the posting and verified evidence IDs.
- `validateRoleFitEnhancement(rawResponse, {jobText, requirements, evidenceCatalog}): {additionalRequirements, rankedEvidenceIds}` accepts only schema-compliant, known IDs and source-exact posting spans; unknown suggestions become needs-review and cannot become new résumé facts.
- `applyRoleFitEnhancement(baselineAssessment, validatedSuggestions): RoleFitAssessment` can improve requirement coverage/order, never bypass matching or demote an established critical gap without validated direct evidence.

- [ ] **Step 1 — RED:** Add tests for invalid/partial/oversized JSON, unknown evidence IDs, invented excerpts, injection text such as "I worked in Java", wrong spans, unsupported inferred synonyms, a suggested new unknown requirement, a legitimate previously missed quoted requirement, and unchanged baseline on failure. Confirm no contact information from the résumé is sent in prompts.
- [ ] **Step 2 — verify RED:** `node --test tests/roleFitEnhancement.test.mjs`; expect failure.
- [ ] **Step 3 — implement:** Keep the existing WebLLM worker and lazy-load it only on an explicit "Enhance locally" action. Check JSON schema support against the **installed** 0.2.81 API before relying on `response_format`; when unsupported, parse defensively or disable enhancement with an honest message. Validate suggestions, then rerun the deterministic matcher/assessment for any accepted new requirement. Limit prompt/output lengths and show download/progress/failure status. No server fallback, auto model download or unverified generation.
- [ ] **Step 4 — compare models and record decision:** On real supported hardware, run the same difficult fixture corpus through the existing Qwen 0.5B preference and one or two actually registered compatible larger options; record quality (especially critical gaps and unsupported claims), first-load size/time, warm speed and browser-memory issues. Choose enhanced option only if it corrects real baseline interpretation errors without critical regressions and with acceptable performance; otherwise retain the smaller candidate or offer baseline only. Record measured tradeoffs, browser versions and actual selected model ID in `docs/role-fit-evaluation.md`.
- [ ] **Step 5 — GREEN + commit:** `node --test tests/roleFitEnhancement.test.mjs` passes; run supported browser model smoke and fallback checks; commit only evidence-backed configuration, `git add src/utils/roleFit.js src/components/ai/useRoleFitLab.js src/components/ai/AI.jsx src/content/roleFitLabContent.js tests/roleFitEnhancement.test.mjs docs/role-fit-evaluation.md && git commit -m "feat(ai-lab): validate optional local-model interpretation"`

### Task 8: Evaluate quality, browser behavior, accessibility and preservation before PR

**Files:** Modify `tests/fixtures/roleFitJobs.mjs`, `tests/*.test.mjs`, `package.json`, `yarn.lock`, `docs/role-fit-evaluation.md`; create `tests/e2e/roleFit.spec.mjs`, `playwright.config.mjs` if necessary; update UI/copy/CSS only for verified findings.

**Interfaces:**
- `evaluateRoleFitFixtures(): {cases, unexpectedCriticalFailures}` (or a Node test equivalent) runs a curated set of **at least 20** anonymized examples covering real-world skills, gaps and ambiguous wording, not just the original Java posting.
- Browser tests use a statically served or local Next build with normal app mounting. A mockable enhancer boundary should simulate delays/failure without downloading a GPU model in CI.

- [ ] **Step 1 — RED:** Write human-labeled fixtures for Java/Spring, full-stack TypeScript, blockchain, consulting/product, analytics, generic soft skills, seniority, no-match cases, negation, disjunction, optional requirements, slash ambiguity, unfamiliar stacks, repeated/messy posting, long input, malicious prompt text and model failures. Add explicit expectations for critical gaps, verdict kind, source IDs, warnings and omitted claims.
- [ ] **Step 2 — verify RED / minimum browser harness:** Run `node --test tests/*.test.mjs`; expect any newly introduced fixtures to expose unsupported cases before correcting logic. Add `@playwright/test` only as a dev dependency where it provides real interaction coverage rather than replacing existing Node unit tests; update Yarn lockfile and document how to install Chromium locally.
- [ ] **Step 3 — add real user-flow coverage:** Cover keyboard shortcut and default Enter behavior; baseline without GPU; a collapsed/expanded details list; reset and editing while enhancement is pending; invalid model response fallback; navigation/unmount; overflow at 320px; no textarea content included in URLs/requests; focus/ARIA status; basic screen-reader/manual checks, light/dark and reduced motion. Keep screenshots as local review artifacts, not unreviewed binaries committed to the repo.
- [ ] **Step 4 — verify and fix real findings:** Run `node --test tests/*.test.mjs`, `yarn lint`, `yarn build`, and `yarn playwright test` if Playwright was added; serve `out` and smoke the exported site in current Chromium and another browser. Check console/network for posting leakage (including analytics), model-download behavior and worker teardown. Run separate architecture/evidence, parsing/model, UX/a11y, privacy/security, and performance reviews; fix concrete issues and rerun affected checks.
- [ ] **Step 5 — document final judgment + commit:** Record example before/after outputs, a quality rubric (accurate core gap, clear transfer, useful source, honest uncertainty, readable report), candidate model decision, browser compatibility, known limitations and actual test outcomes in `docs/role-fit-evaluation.md`. Recheck diff against `master` and do a Ponytail correctness → safety → realistic load → tests → speed → lean review. Commit only passing implementation and documentation: `git add tests package.json yarn.lock docs/role-fit-evaluation.md && git commit -m "test(ai-lab): evaluate grounded role-fit quality and browser behavior"`. Do not merge or deploy without owner approval.

## Acceptance gates and implementation handoff

- **Factual correctness:** zero unsupported *positive* experience claims in the curated evaluation corpus; the Java posting clearly says professional Java is absent based on owner confirmation and Spring/J2EE/Hibernate are not documented; required/core gaps are not buried.
- **Coverage and honesty:** every extracted requirement appears in the expandable inventory, including alternative groups and work conditions; genuinely unparsed clauses are flagged for review rather than silently dropped.
- **Meaningfulness:** compared with the current branch output, a human reviewer can identify the top fit, a consequential mismatch and at least one useful concrete example or clarification; test hard counterexamples before claiming overall improvement.
- **Local resilience:** baseline works without GPU; enhancement only after consent; failures and stale responses never overwrite a newer or valid baseline; no input leakage.
- **Accessibility and product quality:** concise top section, semantically accessible details, mobile/theme/keyboard checks, no fake numeric score and no administrative/dashboard feel.
- **Evidence before ship:** record test command output, browser/device/model specifics and unresolved limitations. Prepare a PR only after human approval and actual implementation.

## Review record (planning-stage, to be finalized after focused and Ponytail passes)

This is an implementation plan, **not implementation**. Focused reviews assess the plan against source, spec, product behavior, failure cases and realistic client-side constraints. A Ponytail instruction-based pass is a manual substitute if no native Ponytail runner is connected. All actionable findings must be incorporated into this document before its final review.
