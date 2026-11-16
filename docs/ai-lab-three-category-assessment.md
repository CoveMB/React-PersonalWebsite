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

## 2026-11-15 runtime and model selection update

**Current implementation supersedes the older WebLLM 0.2.81/Qwen2.5 3B configuration discussed above.**

- Pinned **`@mlc-ai/web-llm@0.2.88`** with an updated Yarn v1 lockfile covering all new runtime dependencies and verified npm integrity hashes.
- Primary on-device model: **`Qwen3.5-0.8B-q4f16_1-MLC`** (WebLLM catalog estimate: ~1.63 GB VRAM). If the GPU adapter lacks `shader-f16`, select **`Qwen3.5-0.8B-q4f32_1-MLC`** (~1.89 GB catalog VRAM).
- Retain **Qwen2.5 0.5B q4f16/q4f32** as a strictly secondary compatibility fallback for load failures or the existing bounded first-token retry. Models larger than Qwen3.5 0.8B are no longer preferred.
- Preserve the current request schema, bounded streaming, error diagnostics, privacy behavior, deterministic assessment, and two-card UI without changing CSS or page layout.
- **Verification boundary:** Catalog membership, lock consistency, and selection logic can be tested automatically, but real browser generation latency, structured JSON acceptance, and factual quality require hands-on comparison with representative job descriptions. A smaller newer model is not guaranteed to be more accurate than the prior 3B model.
- Sources: [WebLLM 0.2.88 release](https://github.com/mlc-ai/web-llm/releases/tag/v0.2.88), [pinned model catalog](https://github.com/mlc-ai/web-llm/blob/v0.2.88/src/config.ts).

## 2026-11-16 — JSON grammar initialization failure and local diagnostics

- **Confirmed from browser exception and WebLLM 0.2.88 source:** the `json_object` branch calls XGrammar `compileJSONSchema(responseFormat.schema!, ...)`. Previously the request omitted `schema`, so XGrammar received `undefined` and raised `GrammarMatcherInitError: Cannot pass non-string to std::string`.
- Send a static, serialized JSON Schema string requiring the existing `direct`, `transferable` and `notEstablished` arrays of `{ id, note }` objects. Continue validating requirement IDs, categories, supporting evidence and notes independently. Do not loosen validation or change the two-card design.
- Detailed nested WebLLM errors and a bounded stack now appear only in the **local browser console** on an AI failure, never in the UI state. The existing UI technical disclosure shows non-sensitive error codes and directs technical users to the console. Console details may still contain employer input or browser paths; users should review them before sharing, and the application must not forward them to telemetry.
- Added regression coverage for serialized-schema presence/shape and UI/console separation. Browser WebGPU inference with the exact failing posting is still needed to verify end-to-end success; a code-level proof does not constitute a live runtime test.
- Source: `mlc-ai/web-llm` tag `v0.2.88`, `src/llm_chat.ts` (grammar initialization), `src/openai_api_protocols/chat_completion.ts` (`ResponseFormat.schema?: string`), and `examples/json-schema/src/json_schema.ts`.

## 2026-11-16 — Rejected AI notes with fabricated requirement IDs

- **Reproduction:** in the Wissen posting, `req-1` and `req-2` refer to introductory company text. The model's REST API and Git/CI/CD notes correspond to `req-10` and `req-13`. The notes were correctly rejected as unprovided and incorrectly categorized.
- **Cause:** the previous JSON grammar accepted any `id` string and the system prompt used a fabricated `"id":"req-1"` sample. The small model appeared to renumber the shortlist.
- **Repair:** after shortlisting, build a JSON schema with an enum of exactly the permitted IDs for each category; categories with no candidates have `maxItems: 0`. Remove the misleading sample ID and explicitly instruct the model not to renumber IDs. The schema bounds each category to two notes.
- **Unchanged:** the evidence parser, matcher, authoritative validator, and two-card UI. Invalid IDs still cause rejection; no speculative ID remapping or synthetic model prose is added.
- **Limit:** request-shape and regression tests can run without GPU inference; the actual WebLLM/XGrammar deployment still needs browser verification.


## 2026-11-16 — Direct Markdown résumé assessment (current design)

**Current AI behavior supersedes the earlier JSON/requirement-ID model prompt and its per-note acceptance rules above.** The independent deterministic report and its published-source comparison remain intact.

- The AI Lab compiles the published Markdown résumé through the existing raw source import, removes contact lines, and sends the remaining full professional résumé content together with the complete pasted job description to the local WebLLM model. The AI does **not** receive deterministic requirement classifications, evidence IDs or selected excerpts. No new remote model calls or server routes are used.
- The model writes its own Markdown under the three headings Directly demonstrated, Transferable experience, and Not established. Output is parsed only for headings, bullets, and paragraphs. It is **not** source-checked claim by claim; the AI card identifies all model language as unverified. Missing sections remain empty rather than being filled with mechanical conclusions.
- If the model writes prose without recognizable headings, the UI shows the raw unstructured output as unverified rather than silently rejecting useful wording or assigning an invented category. Truncated/oversized or failed generations retain bounded raw output for troubleshooting.
- The static résumé is not uploaded; the pasted posting stays in browser memory. A conservative character budget protects the 4096-token local context without claiming to count tokens exactly. If complete input exceeds that limit, AI inference stops with an explicit message, **without silently shortening the job or résumé**; the deterministic evidence report remains available.
- The UI retains its two existing cards, theme, and layout classes. Only interpretation and safe Markdown rendering in the AI card changed; no permissive HTML renderer was introduced. The model remains Qwen3.5 0.8B with the existing on-device fallback.
- Focused verification covers request fidelity, omission of public contact lines, the actual Wissen posting, parser variants, missing headings, unstructured responses, stale runs, source-report independence, and inert HTML. Final browser/WebGPU testing, production build and cross-device context-window checks remain deployment requirements.

**Limitation:** Simplifying model generation reduces schema-ID failures but removes automatic claim-level fact checking in the AI card. A 0.8B model may miss important requirements or invent experience. The separate mechanical report is a comparison reference, not proof of the model's correctness.
