# Egeria Portfolio Positioning and Content Reconciliation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or superpowers:subagent-driven-development for implementation. This is the follow-up to PR #40 and its prior design/plan, not a replacement of the original historical plan.

**Goal:** Keep Egeria's portfolio presentation consistent with the latest résumé and new extracted-content architecture, while strengthening the case study and related professional positioning.

**Architecture:** Merge current `master` into the existing feature branch using the master content-extraction layout as the canonical source of text. Add Egeria copy through `src/content/texts` and existing catalog IDs; avoid component rewrites and new dependencies. Keep the proposed client portal distinctly future tense.

**Sources:** `Cove_Marquis_Bortoli_Resume_Updated.pdf` (November 2026, user-provided), Egeria Systems consulting vault, Consulting Plugin README, Egeria Scaffold README, and the user-approved portal feature plan.

**Tech Stack:** Next.js, React, existing JavaScript content modules, Markdown.

## Global Constraints

- Preserve both parents' work; the branch update must have the old feature head and current `master` as merge parents.
- Keep code and text extraction separated: prose in `src/content/texts/*`, structure in catalog, chronology, and view modules.
- Use Faithful Humanizer principles: grammatical and sentence-form changes only when polishing supported content. Never turn plans into delivered features.
- Name references in visible text must be lowercase. Keep identifiers, paths, and external URLs stable.
- Public résumé Markdown follows the newest résumé's experience and skills but does not reproduce its residential street address. Leave the older public PDF asset unchanged until a privacy-reviewed replacement is requested.
- Three featured projects: Egeria Systems, OpenZeppelin Defender, ALDO OMS. Sui Marketplace Tooling is first in Earlier Work.
- No new tests unless a concrete behavior defect requires one. Run available local or static checks before the single PR branch update; avoid unnecessary GitHub Actions triggers.
- Do not link to private internal repositories or imply Egeria's client portal has been implemented.

## Review Focus

1. Compare `master` against the feature branch for conflicting text owners and preserve the latest extraction design.
2. Verify the résumé's facts, dates, and skills while excluding the home street address and not changing the public PDF.
3. Check all Egeria case-study links and content: methodology vault, skills plugin, scaffold, planned portal.
4. Check project/catalog-to-text joins, exact featured order, Sui first in archive, and no lost older projects.
5. Verify case-sensitive name references in visible content, source paths, metadata, and alt text.
6. Re-run local/static checks and review SEO, Role-Fit context, and accessibility before pushing.

## Tasks

- [ ] **1. Reconcile current master:** fetch changed owner files, apply existing Egeria branch content to extracted modules, and form a true two-parent merge commit without losing unrelated upstream changes.
- [ ] **2. Homepage and career:** update the headline, introduction, profile proof, career text and dates, and Discovery & Design card while reusing the existing illustration and layout.
- [ ] **3. Egeria case study:** include specific current delivery tools and practices, keep the client portal explicitly planned, and preserve the Context / Build / Outcome model.
- [ ] **4. Portfolio selection:** feature Egeria, Defender, and ALDO; move Sui to the first Earlier Work slot.
- [ ] **5. Résumé and Role-Fit:** update the public Markdown from the latest PDF without the private address, preserve the PDF, and align the AI assistant's strengths and status notes.
- [ ] **6. Name and metadata:** lowercase displayed name references and refresh SEO and footer positioning without changing canonical URLs or static asset paths.
- [ ] **7. Review and verification:** perform independent content, merge-integrity, integration, UI/accessibility, privacy, and lean-code passes. Push once to PR #40 and leave it unmerged.
- [ ] **8. After push, investigate the separate social-icon flash:** trace rendering, CSS, and animations. Report verified cause or remaining uncertainty without guessing.
