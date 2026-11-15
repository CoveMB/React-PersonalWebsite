# Recruiter-readable AI role-fit result — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or subagent-driven-development; follow red → green → review → commit.

**Goal:** Replace unhelpful empty AI sections and dumped JSON with concise, sourced, role-specific recruiting summaries.

**Architecture:** The existing deterministic matcher remains the source of truth. A new recruiter-summary formatter composes candidate evidence and gaps with compact citations. The local model ranks only allowed requirement IDs and falls back gracefully when its response is invalid; the independent mechanical report is never overwritten.

**Tech Stack:** Next.js 16 static export, React 19, WebLLM 0.2.81, JS/MJS, Sass, Node native test runner.

**Spec:** `docs/superpowers/specs/2026-11-15-recruiter-readable-role-fit.md`

## Global constraints
- The AI card is first; mechanical card second. One Analyze starts both.
- Published candidate sources are self-described, not independently employment verified.
- Never mistake JavaScript/Node.js for professional Java/Spring. No unsupported metrics, years, hard-skill equivalence, or language upgrades.
- Preserve input boundaries (12,000 chars), source traceability, zero posting-data network uploads, static export, dark/mobile layouts, and stale-response protection.
- Target is the actual default branch `master` (no `main` ref exists). User explicitly requested direct push; no PR or merge into another branch.

## Review focus
- Wissen Java: explicit Java/Spring gap, direct REST/microservices/Agile/React, transferable Node backend context.
- Malformed, fenced, incompatible-ID, duplicate, oversized and empty model output must still yield useful summary, no JSON wall.
- `React or Vue` versus `React and Vue`; no partial requirement promoted into direct.
- Source citation covers every conjunction, no model note can invent Java work, and owner-confirmed absence only used for Java.
- No GPU/Worker, long/partial postings, edit/reset/reanalyze, mobile, screenreader, privacy.

## Task 1 — Recruiter-summary semantic formatter
- [x] Write failing tests for human-readable direct matches, distinct transferable examples (including core Java gap), concise/merged critical gaps and required source citations.
- [x] Implement pure summary builder driven by validated matcher rows and stable evidence excerpts; priorities protect core misses.
- [x] Watch focused tests pass and inspect a representative Java posting.

## Task 2 — Model contract and resilient interpretation
- [x] Add RED tests for the user-provided invalid JSON, Markdown-fenced and legacy object responses, wrong section IDs, duplicates, fabricated notes, invalid/empty model output, bounded prompt and no private data.
- [x] Change the prompt to the smaller, easy-to-obey IDs-only ranking format. Validate IDs against category/importance and ignore candidate-authored evidence prose. Use the deterministic summary for every missing or invalid selection.
- [x] Run regression tests and confirm no unverified model claim is in recruiter bullets.

## Task 3 — UI, lifecycle and documentation
- [x] Add regression tests for card ordering, no raw output by default, meaningful unavailable/failed states, and no model progress/fallback confusion.
- [x] Update the AI card to render short capability-led bullets, source links and gap language; tuck raw model output under optional technical details. Keep mechanical card independent underneath.
- [x] Update the evaluation note with the concrete user example, current limitations and review results.
- [x] Run all available tests, lint/build/browser checks if environment supports them, review evidence, accessibility, privacy, edge cases and Ponytail order (correct → safe → load → tested → fast → lean).

## Delivery

Implementation and local focused checks are complete. The automated full Next build, ESLint and browser/WebLLM quality verification remain explicitly unverified because the offline workspace has no installed dependencies. Direct `master` push and post-push verification are tracked by the deployment action, not falsely marked as tests.

- Commit tested files and plan/spec as one cohesive change directly to `master` with a lease check; verify GitHub ref and compare affected files after push. Do not assert full browser verification without actual run.
