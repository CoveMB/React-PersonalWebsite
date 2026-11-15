# Evidence-grounded Role-Fit Lab — implementation evaluation

Updated: 2026-11-15. Base: `fix/ai-lab-grounded-role-fit`; target repository: `CoveMB/React-PersonalWebsite`.

## Decision and trust boundary

- The immediate report uses a deterministic source-anchored requirement parser and a curated résumé/project evidence catalog. It does not require a GPU, worker or model and does not calculate a fit percentage.
- Direct matches require documented evidence tagged with the canonical technology; related work receives only the **transferable** status under a small explicit relation table. Duration, degree of expertise, soft skills and work conditions are not inferred.
- Only Java has an explicit owner-confirmed **no professional experience** statement. For other missing skills the report says **not documented**, which is a statement about the selected public materials, not about the person.
- Portfolio narratives contain project references to **Kubernetes** and **Python/Pandas** that are absent from the résumé skill list. The implementation distinguishes these project sources and warns that their mention does not prove tenure or professional depth. The old blanket “undocumented Python/Kubernetes” assertion was too broad.
- The client posting is only used as untrusted text. It is never evidence of the candidate's background. Every displayed positive example links to the public résumé or portfolio case study.

## Hand-reviewed qualitative cases

| Scenario | Expected interpretation | Implemented baseline behavior |
| --- | --- | --- |
| Wissen Senior Java/Spring plus REST and React | Java is a core mismatch; REST/React evidence helps but cannot erase it | Core Java requirement marked not established with explicit owner-confirmed absence; REST and React evidence matched to source bullets |
| React/TypeScript engineering | Direct work is relevant; do not fabricate tenure | React and TypeScript evidence can be direct; years are never produced by the application |
| React **or** Vue vs React **and** Vue | One alternative suffices only for `or` | React satisfies `or`; `and` is never direct from React alone |
| Java/J2EE and Linux/Unix | Slash does not automatically mean `or` | Ambiguous clause flagged for review; Java still noted where explicitly owner-confirmed |
| No Java required | No Java deficit | Exclusion is retained but not counted as a mismatch |
| SQL, Spring, unfamiliar frameworks | Do not infer expertise from posting | Unsubstantiated items are not marked direct; unfamiliar clauses require review |
| Python/Kubernetes project skills | Source exists, but no fabricated number of professional years | A relevant project citation is possible; tenure remains unverified |
| 65 clauses | No silent overflow | First 60 structured, remaining source text listed as needing review and partial coverage shown |
| Malicious prompt and invalid model output | No forged achievements or altered baseline | Untrusted text is rendered as React text; only exact source spans and known IDs can enter the deterministic assessment |

The initial report is short, with an expandable audit inventory. Source descriptions are published by the portfolio owner and have not been independently employment-verified. A human recruiter or the owner must judge real proficiency, seniority, and job conditions.

## Automated checks performed locally

- `node --test tests/roleFitRequirements.test.mjs tests/roleFitMatching.test.mjs tests/roleFitAssessment.test.mjs tests/roleFitEnhancement.test.mjs tests/roleFitCorpus.test.mjs` — **64 tests passed**, after fixing parser grouping and assessment issues surfaced by earlier red test runs. 30 annotated corpus scenarios are included.
- The GitHub source excerpts were independently checked against the current branch: **19/19** curated positive quotations were found in their intended public source files. Source integrity is also separately asserted by `tests/roleFitEvidence.test.mjs`, which compares every positive quote against the committed public résumé and published `projectTexts.js`. It must be run in a complete checkout before merging.
- `node --check` succeeded for the pure `.mjs` modules and JS hook. Tests cover owner-confirmed absence, source IDs, opt-in model validation, stale revisions, truncation limits, unknown skills, and multiple question formats.

### Not verified in this execution environment

The execution environment cannot download GitHub/npm packages or create a full source checkout using the network. As a result, `yarn install`, `yarn lint`, `yarn build`, Playwright/real-browser smoke checks, visual assessment of 320/390px and desktop themes, screen-reader tests, and the full repository test suite could **not** be run. No passing status for them is claimed. Run those checks before approving a merge or deployment.

## Optional local model

- The model runtime remains pinned to `@mlc-ai/web-llm@0.2.81` in `package.json`.
- Model import and Worker creation are lazy and require a separate click. No network inference endpoint or server fallback exists. A failed, rejected or stale model result retains the immediate assessment.
- Prompt metadata contains only evidence IDs, short labels and capabilities, **not contact details** from the résumé. Responses must be JSON and pass a bounded exact-span / valid-ID validator; all substantive changes rerun the deterministic matcher.
- `response_format`/JSON mode was intentionally **not** assumed to work with the pinned WebLLM version; malformed output simply has no effect on evidence.
- The former 0.5B preference remains a preference, not a quality recommendation. **No model download, on-device benchmark, browser memory measurement, or comparison with larger registered models was possible here.** Do not change the model default on speculative assumptions. Enhancement is experimental and may return no usable revision on small models.

## Separate review lenses and Ponytail pass

These were manual, separately focused passes over the implementation by the same author, **not independent external review agents**.

- **Evidence and semantics:** Checked Java vs JavaScript, Spring and alternative groups. Corrected overly broad unsupported-tech statements against the Python/Kubernetes project narratives. Verified that planned and learning-only items cannot become positive sources.
- **Parser and assessment:** Hand-inspected the Wissen rendering data. Split the common “HTML, CSS, JavaScript, and frameworks such as Angular, React, or Vue” mixed list into two auditable requirements, and fixed a duplicate-highlight source selection bug. A later review caught multi-capability highlight cards that showed only a single citation; the report now selects a minimal set of supporting sources sufficient to cover each direct-match conjunction (regression-tested RED → GREEN).
- **Async and security:** Added a revision guard to prevent old enhancements replacing later analyses. Protected source excerpts and forbidden contact data in model prompts; outputs are never interpreted as résumé facts.
- **UX and accessibility:** Uses an immediate report, semantic headings, focus on report change, disclosure for the full inventory, visible length rejection, natural Enter/newline, and Ctrl/Cmd+Enter to analyze. Responsive and reduced-motion CSS included; real-browser verification remains outstanding.
- **Performance and maintainability:** 12k/60-group limits, bounded prompt/output, no eager model import, no server/database/vector search, and no duplicated candidate profile created for inference.

**Ponytail (correct → safe → realistic load → tested → fast → lean):** Correctness tests support grounded conclusions and show known remaining ambiguities; safety boundaries are explicit; overflow is visible; deterministic tests passed locally; unsupported device gets an instant baseline; implementation reuses the existing Next/WebLLM stack without a new service. Browser/CI checks and hardware model benchmarking remain **release blockers**, not silently passed criteria.
