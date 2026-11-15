# AI Lab: single three-category role assessment

**Date:** 2026-11-15  
**Status:** Proposed refactor; browser/model QA required before release.  
**Supersedes:** The split model-authored AI card plus independent mechanical report in earlier November 15 AI Lab plans.

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
