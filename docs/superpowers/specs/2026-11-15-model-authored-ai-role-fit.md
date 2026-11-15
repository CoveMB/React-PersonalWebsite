# Genuine local-model AI assessment — corrected product contract

## Priority

The AI assessment must **never** display deterministic experience classifications, templates, heuristic claims, or mechanical summaries as if the local model produced them. This requirement supersedes earlier plans that used the model as a ranking-only helper.

## Experience

- A single Analyze click starts the independently deterministic mechanical assessment and an optional WebLLM inference. The AI card appears **above** the mechanical card; until the model responds it displays only a loading/unavailable/failure state, never a mechanical preview.
- The AI card displays **only model-generated words**. The model receives the job posting and curated, exact public résumé and project quotations as **data**, not the mechanical analysis or pre-classified matching results. The prompt instructs the model to author concise employer-specific bullets beneath **Directly demonstrated**, **Transferable experience**, and **Not established**, and to explain important technical differences (JavaScript is not Java).
- Source quotes and owner-confirmed absence are *context provided to the model*; no deterministic matcher or recruiter-summary builder produces or changes any AI-card claim. Post-processing may **only** trim text, escape untrusted content for safe display, format headings/bullets, or convert the model's own JSON strings to readable text, without inferring or changing their truth or category.
- The AI output is labelled **Experimental, AI-generated and unverified**. A prominent notice states a small model can invent or misclassify experience, and points readers to the source-grounded mechanical report below. Do not claim source validation of model prose. No auto-generated citations falsely imply verification.
- If the model is unsupported, fails, returns no text or malformed output, show the honest corresponding status, optionally raw output diagnostics, **never** a prewritten substitute report. Keep mechanical analysis visible below and independent.
- Reanalyzing, editing, resetting, unmounting all invalidate in-flight model results; outdated output cannot appear for the new posting. No automatic network inference / posting upload / storage; the model itself is local with asset downloads only.
- Bound input (up to 12,000 chars mechanical; a clearly disclosed, smaller excerpt for AI when needed), model prompt size and output length. Preserve full mechanical inventory.

## Must-pass examples

1. Before GPU generation, AI category bullets do not exist. Mechanical still contains its own report.
2. A returned unusual model phrase is displayed as **that phrase**; it cannot be replaced with a deterministic version.
3. The model prompt contains public, exact work examples and raw posting text; no `mechanicalAssessment`, `verifiedCategoryChoices`, ranked ID lists or precomputed evaluation labels.
4. A Java/React/REST role asks the model to describe genuine experience and explain the Java mismatch. A fabricated Java claim is visibly **unverified model output** rather than certified experience, and the mechanical card maintains the verified Java gap.
5. Invalid/empty/unavailable, stale completions, long inputs and malicious HTML-looking content are transparent and do not leak or execute.
