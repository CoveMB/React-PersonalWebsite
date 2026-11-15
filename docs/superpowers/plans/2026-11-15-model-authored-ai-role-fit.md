# Model-authored AI assessment implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development. Each task uses test-first and final verification.

**Goal:** Showcase genuine local-model authored interpretations in the AI card; keep deterministic evidence evaluation exclusively in a distinct mechanical card below.

**Architecture:** Retain the existing independent parser/matcher for the mechanical result. The WebLLM path instead consumes bounded raw posting text and curated public source quotes and generates its own narrative. Its response is formatted and clearly labelled unverified; no matching, source-checking, prioritizing, fallback template or other deterministic *evaluation* enters the AI-card output.

**Tech Stack:** Next.js 16 static export, React 19, WebLLM worker, Node built-in test runner, Sass.

**Spec:** `docs/superpowers/specs/2026-11-15-model-authored-ai-role-fit.md`

## Global constraints

- No remote inference or posting storage; no new backend; model assets may download on click.
- The model writes every AI-card category and statement. Structural formatting only, no deterministic assessment or content substitution in that card.
- Prominent unverified, small-model disclaimer; independent mechanical report remains below.
- Safe React text rendering, bounded input/output; stale request guard; supported-browser disclosure.

## Review focus

- Initial card showing deterministic résumé bullets before the GPU responds.
- Prompt accidentally supplying mechanical evaluation or choosing only ranked IDs.
- Untrusted output being presented as verified employment or executable HTML.
- JSON/Markdown/model failure and outdated worker promises being confused with valid analysis.
- Model prompt overflow or silent truncation causing apparent full-role coverage.

### Task 1 — Model-only request and output contract

**Files:** `src/utils/roleFitAI.mjs`, `tests/roleFitAI.test.mjs`, `tests/roleFitRecruiterSummary.test.mjs` (retire old AI-facing tests), `src/utils/roleFitRecruiterSummary.mjs` (remove dead AI-only formatter).

- [ ] RED: tests demand a genuine model-authored sentence and no mechanical response data in the AI prompt, no summary-before-inference, no fallback on invalid model output, safe response extraction and bounded prompt.
- [ ] Run Node tests and observe failures from old rank-and-template implementation.
- [ ] GREEN: build prompt from posted job and public evidence quotes only; instruct 3 Markdown headings and concise role-specific bullets; allow structural parsing of the model's own JSON but no semantic evaluation; return model text/status and limited-input flag, never mechanical categories.
- [ ] Run all focused tests and inspect a Java/React scenario.

### Task 2 — Model card presentation and lifecycle

**Files:** `src/components/ai/RoleFitAIReport.jsx`, `src/components/ai/AI.jsx`, `src/components/ai/useRoleFitLab.js`, `src/content/roleFitLabContent.js`, `src/content/texts/roleFitTexts.js`, `public/static/css/_ai.scss`, `tests/roleFitReportUI.test.mjs`.

- [ ] RED: tests assert no preview/fallback, no mechanical prop, statuses visible, prose only after response, separate mechanical card and stale results.
- [ ] Observe expected failures from existing UI; then implement content-only AI card, safe Markdown structure rendering and explicit warnings. Increase local generation token budget while keeping prompt bounded.
- [ ] Run Node suite, source integrity, JSX/static inspections and real lint/build/browser checks where available. Clearly report any verification limitation.

### Task 3 — Review and direct release

- [ ] Independent passes for factual labelling, architecture/data boundaries, worker race conditions, privacy/XSS, UX/accessibility and performance.
- [ ] Ponytail correctness→safety→load→tests→speed→lean; reproduce and fix concrete findings and rerun regressions.
- [ ] Check new commit is fast-forward from current `master`, write files via GitHub connector, and verify final remote SHA/file hashes; never force push.
