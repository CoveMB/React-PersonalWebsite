# Egeria Systems Experience and Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Egeria Systems to the career timeline and featured portfolio case studies while matching existing format and preserving existing presentation.

**Architecture:** Data-only addition to two content catalogs and one chronology file, plus one existing-approved branded media asset. Keep existing UI components unchanged and preserve the three-featured-item rule.

**Tech Stack:** Next.js 16, React 19, JavaScript, existing Sass styles, local static images.

**Spec:** `docs/superpowers/specs/2026-11-11-egeria-portfolio-design.md`

## Global Constraints
- Do not add tests, change test fixtures, install dependencies, or add components.
- No client-sensitive details, unverified outcomes, or private-repository links.
- Preserve chronology item schema, case-study Context / Build / Outcome schema, and existing project display behavior.
- Use an existing approved Egeria Systems light-background logo.
- Keep all existing three featured slots; Egeria joins first, and the previous third item shifts to Earlier Work under the existing overflow rule.
- Fix OpenZeppelin's outdated end date directly.
- Review the final diff for visual integration, accessibility, link correctness, and security/privacy.

## Review Focus
- Timeline placement: Egeria must render before OpenZeppelin and the outdated "Present" text must be removed.
- Project catalog linkage: every new project ID must resolve a case study with all three section labels; no missing data.
- Featured overflow: first three cards render; existing work is still accessible through Earlier Work.
- Media behavior: the local logo path exists, its light-background variant is readable, and descriptive alt is supplied.
- External link and privacy: link targets a public artifact and no private client/consulting material enters the portfolio.

---

### Task 1: Career Path content

**Files:** Modify `src/content/careerChronology.js`.

**Interface:** Existing `createCareerChronologyItem` item shape; consumed by `CareerChronology.jsx`.

- [ ] Prepend an Egeria Systems Role item with `dateLabel: "2026-Present"`, `title: "Consultant"`, `location: "Montreal, Canada | Remote"`, and concise summary covering technical consulting, website visual direction, full-stack work, and repeatable client workflows.
- [ ] Change OpenZeppelin's `dateLabel` to `"2022-2026"`.
- [ ] Inspect item shape, chronological ordering, and duplicate/overlapping labels. No new tests.

### Task 2: Case study and project card

**Files:** Modify `src/components/projects/projectText.jsx`, `src/components/projects/projectCatalog.jsx`; create `public/static/images/egeriaSystems.png`.

**Interfaces:** `projectCaseStudiesById.egeriaSystems`; project record `id: "egeriaSystems"`; current `Project.jsx` / `ProjectImage.jsx` consumers.

- [ ] Add a Context / Build / Outcome case study framing the Egeria practice, its client-centred design/technical consulting and consulting delivery systems. Keep bounded claims and existing `**...**` emphasis style.
- [ ] Add a first, featured `Egeria Systems` project catalog entry; refer to the approved local image, set accurate alt text and focus-area tech badges, and link to `https://github.com/Egeria-Systems/egeria-scaffold` labelled `View scaffold`.
- [ ] Copy the already-approved light-background company logo into the new static image path unchanged.
- [ ] Inspect linkage, render contract, featured/archive ordering and public/private source boundaries. No new tests.

### Task 3: Verification, review, and delivery

**Files:** No additional product files expected.

- [ ] Verify final branch diff vs master: intended content and approved logo only, plus this plan and spec.
- [ ] Run available existing deterministic checks when the environment permits; otherwise record the commands not run and the precise reason.
- [ ] Review functional/data integration, presentation/accessibility, accuracy/privacy, and a Ponytail instruction-based lean/safety pass. Address confirmed in-scope findings.
- [ ] Publish a reviewable pull request against `master`; do not merge or deploy.
