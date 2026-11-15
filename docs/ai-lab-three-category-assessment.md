# AI Lab: evidence-grounded role assessment (implementation history)

**Date:** 2026-11-15  
**Status:** Updated AI/evidence card separation implemented on a feature branch; live WebLLM/browser QA required.  
**Supersedes:** The split model-authored AI card plus independent mechanical report in earlier November 15 AI Lab plans.


> **Current behavior (15 November 2026):** The earlier single-card design described below is historical. The current implementation restores **two separate cards**: an on-device, explicitly unverified AI assessment and the existing deterministic three-category evidence report. The outer AI Lab markup, existing CSS, theme, spacing and other page sections are unchanged.


## Intent

A recruiter pastes a job description and gets one concise, evidence-led assessment with exactly three main categories:

1. **Directly demonstrated** — the public résumé or portfolio documents the actual capability.
2. **Transferable experience** — related expertise is documented, but the required technology or approach differs.
3. **Not established** — published sources do not substantiate the requirement. This does **not** assert the skill is absent.

No numerical suitability score or automated hiring recommendation.

## Architecture

- The existing requirement parser, source catalog, capability taxonomy, matcher, and assessment are the authority for classification and source selection.
- The on-device WebLLM model writes **supplementary interpretations**. It sees up to 18 important, already categorized requirements sampled across the **entire** pasted posting, not only the first 5,000 characters. It may select up to three distinct, model-written notes per category.
- Responses are JSON with three arrays and entries containing a known requirement ID and model-written note. The validator checks each ID was supplied to this model request, belongs in its category, and has eligible evidence for positive claims. Duplicate or unsupported-technology notes, invented citation tokens and unsupported quantitative claims are rejected.
- Source citations are selected by the deterministic evidence matcher, never invented by the model. The model cannot move a requirement to a stronger category.
- **Limit:** The validator cannot prove the *semantic truth* of arbitrary prose. Every accepted AI note is labeled as **unverified wording**; source quotations can be inspected independently.
- If WebGPU/Worker is unavailable or the model returns unusable output, present an explicitly labeled **evidence-only comparison**, not a fabricated AI answer.
- The 12,000-character input limit and 60 requirement-group parser limit remain. Overflow and unparsed material are disclosed. Excluded job requirements are never counted as deficits.
- Show three short top-level sections (initially three items each), with expandable additional requirements and evidence. Categories are present even when empty.
- The first model run may download model assets. The employer posting stays on the device, with no new backend, storage, URL parameters, or analytics transmission. Reanalyze/edit/reset/unmount invalidate stale model responses.
- No new dependencies or server routes. Preserve light/dark theming.

## Risks and verification gates

1. **Hallucination:** Source and category association are validated, not every model-written assertion. Have a human inspect actual model output.
2. **Parsing limitations:** A finite technology taxonomy can miss requirements. An unestablished claim is not evidence of a missing skill.
3. **Transferability trade-off:** Java-specific professional experience remains unestablished even when Node.js backend expertise may transfer. A composite requirement should not be silently promoted to direct.
4. **Model/device constraints:** The existing small local model has not been benchmarked for structured-output reliability, download size, VRAM, latency or quality.
5. **Bounded AI context:** The AI samples selected requirements; the fallback report analyzes every parsed requirement up to documented limits.
6. **Before merging:** Run yarn test:role-fit, yarn lint, yarn build; check actual model inference on representative roles (especially Java/Spring, React/TypeScript, unfamiliar stacks, long postings); exercise fallback, edit/reset race, desktop/mobile, keyboard and screen reader.

## Review lenses applied

- Evidence: Category authority, Java/JavaScript separation, provenance of public quotations.
- Lifecycle: Invalid/unavailable AI cannot overwrite the evidence report; stale requests are ignored.
- Privacy/security: Untrusted employer text cannot execute; JSX escapes model notes; no remote inference route.
- UX: Single concise report, three fixed category headings, progressive detail and clear AI/fallback status.
- Maintainability: Existing pipeline reused, obsolete second card deleted.

**Verification limit:** A small in-process representative validator check was executed during coding. Full repository tests, actual WebLLM inference, browser checks and production build **have not been run** in the connector-only environment.


## 2026-11-15 reliability follow-up

- Request JSON-constrained output with `response_format: { type: 'json_object' }` using the pinned WebLLM 0.2.81 runtime. This improves syntactic reliability but does **not** guarantee adherence to the exact three-array schema or factual accuracy.
- Classify failures by **load**, **generation**, and **validation**, exposing only fixed public error codes and user-facing explanations. No raw exceptions, model output, or pasted job text are displayed or stored; the UI has a collapsed safe-to-share diagnostic.
- Distinguish network/model download, GPU/memory issues, unsupported structured-output mode, invalid JSON/schema, generation truncation, empty output, and valid output whose notes fail evidence validation.
- A required multi-technology clause remains unestablished when the complete requirement is not supported. For mixed **AND** clauses and explicit framework example lists only, the report can separately show source-backed related expertise under Transferable experience without promoting the full requirement to direct or inferring skills in the requested stack.
- Suppress repeated transferable facets that would cite the same example for overlapping frameworks. The illustrative-list UI wording states that no direct experience with the named frameworks has been established.
- The Wissen Java/J2EE + Spring/Hibernate/Spring Boot example is an explicit regression case. It retains the unestablished Java/framework gaps and displays documented Node.js/Koa-related backend experience separately.
- The small local model remains experimental; the full production WebLLM model-download and in-browser generation path has **not** been exercised by the connector-based tests. Actual runtime and Safari/Firefox/device validation remain release checks.

## Latest update — separate AI output, rejection review, and higher-capacity default

- The first card contains only model-generated, independently classified **accepted notes** in the three requested sections. When the local model fails or has no valid notes, it displays an explicit status, not a fabricated model answer. The second card keeps the deterministic requirements and source-expansion layout.
- Model output is retained **in memory** for the active analysis only, up to 8,000 characters. If some or all notes are rejected, the AI card presents the **exact bounded original response** and a readable breakdown of rejection reason codes. Failed loading or generation cannot show text that the model never returned.
- A raw rejected response may repeat parts of the pasted job posting and may contain invented claims. It is labeled **unverified**, displayed locally as escaped React text rather than HTML, and is **not** saved, uploaded, placed in the URL, copied automatically, or treated as candidate evidence. Editing/resetting/reanalyzing discards stale output.
- No stylesheet files were changed for the separate card; both cards reuse the current `roleFitResultCard`, `roleFitThreeWayGrid`, and disclosure classes. Only AI process/markup, moving model-written notes out of the deterministic report, and tests changed.
- The pinned `@mlc-ai/web-llm@0.2.81` catalog already ships `Qwen2.5-3B-Instruct-q4f16_1-MLC` (approximately 2,505 MB VRAM), `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` (~1,630 MB), and `Qwen2.5-0.5B-Instruct-q4f16_1-MLC` (~945 MB). The new loader tries 3B first, then smaller models on initialization failure, and selects q4f32 alternatives if `shader-f16` is not exposed. These figures are catalog estimates, not measurements on recruiter devices.
- Later WebLLM 0.2.88 includes newer Qwen3.5 2B and 4B records (~2,245 MB and ~3,868 MB catalog VRAM respectively). They may be useful accuracy candidates, but upgrading the runtime and replacing the model without controlled benchmark/device/browser tests is deliberately out of scope for this request. Sources: https://github.com/mlc-ai/web-llm/releases ; https://github.com/mlc-ai/web-llm/blob/v0.2.81/src/config.ts ; https://github.com/mlc-ai/web-llm/blob/v0.2.88/src/config.ts
- Regression checks cover invalid JSON, schema errors, unknown or mismatched IDs, unsupported technologies, duplicate claims, truncated raw text, stale runs, browser fallback, the separate cards, and model-selection order. The available execution environment lacks npm/network access for full Next build and real WebGPU inference, so these remain **verification requirements** before considering the feature fully tested.
