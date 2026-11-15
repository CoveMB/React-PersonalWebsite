# Recruiter-readable role-fit AI summary — design

**Approved by owner request:** 2026-11-15. Target: `master` (repository has no `main` branch).

## Problem

The local 0.5B model sometimes returns fenced or malformed JSON containing incompatible requirement/evidence IDs. The validator correctly rejects unsupported links, but the UI replaces an evaluable result with empty categories and a prominent raw JSON dump, which is not useful to a recruiter.

## Required behavior

- Clicking **Analyze role** still starts local AI and immediately produces the independent mechanical report, with AI on top.
- The AI card always shows a short, job-specific, recruiter-readable **Directly demonstrated**, **Transferable experience**, and **Not established** interpretation, when corresponding evidence/requirements exist. No empty model-selection boilerplate and no raw JSON as the default report.
- Model input is a compact shortlist of existing, source-grounded requirement IDs and their allowed category, evidence references, and priority. The model may **rank/select requirement IDs**; it may never create positive career claims, change status, or remove critical gaps.
- Render concise capability-led claims, not copied job sentences or arbitrary model `note` text. Link attributable evidence, and state which technologies differ for transferable work. Important Java/Spring/J2EE/Hibernate requirements remain gaps even if Node.js backend experience is shown as transferable context.
- Invalid, partial, overlong, or empty model responses show an explicitly labeled **evidence-grounded fallback summary**. The developer-oriented original model output, if retained at all, belongs inside an optional disclosure, never in the three main categories.
- Neither posting nor résumé contact details are sent to a remote service. The small-model limitation note remains visible; the mechanical report is an independent comparison below. Excluded requirements, logistics, source-unverified claims, and unparsed spans are never promoted to direct experience. Prior requests cannot modify the current report.
- Keep the static Next.js deployment; no server component, API, or new inference service.

## Edge cases

A requested Java backend with documented REST, Scrum, React and Node.js experience should show those direct strengths, transferable Node.js backend architecture, and the Java/Spring core gap. `React or Vue` requires one supported alternative; `React and Vue` must not be labeled wholly direct. Optional misses must not override core gaps. Roles with no recognized requirements must admit insufficient evidence. Long jobs must preserve the mechanical inventory and keep the model prompt bounded. A GPU failure must still show a useful grounded summary, labeled as fallback rather than model-generated.
