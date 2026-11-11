# Egeria Systems portfolio presentation — design
Date: 2026-11-11

## Intent
Show Egeria Systems in both Career Path and Showcased Projects so portfolio readers can see the user's consulting practice alongside earlier engineering roles. Emphasize technology consulting, technical implementation, visual direction/UX, AI-assisted client workflows, and reusable systems without inventing client impact metrics.

## Existing design
The one-page Next.js portfolio renders Career Path from `src/content/careerChronology.js`. Showcased Projects renders `src/components/projects/projectCatalog.jsx` joined by ID with Context / Build / Outcome copy in `projectText.jsx`. Every project card expects a local image. Only three projects are featured; overflow appears under Earlier Work.

## Approaches
- **Selected: Extend the existing content records.** Add Egeria first in chronology, add a case study and featured project record, and reuse an approved Egeria logo as the project visual. Existing markup, navigation, styling, and responsive behavior stay unchanged.
- Separate Egeria page: provides depth but adds routing, design, and maintenance for one entry.
- New shared career/project schema: reduces some manual duplication but changes functioning unrelated records.

## Decisions and constraints
- Preserve the English-language tone, compact career summary, and three-part case study used elsewhere.
- Career title: "Consultant" as currently recorded on LinkedIn, describing full-stack/creative work in the summary. Start 2026, current.
- Correct OpenZeppelin's chronology from `2022-Present` to `2022-2026`, reflecting its ended role, while overlapping April-May 2026 is legitimate.
- New case study is featured first. Keep the three-card featured limit; prior overflow remains in Earlier Work.
- Reuse the approved Egeria light-background brand logo, not a substitute illustration; add only that public-facing branding asset.
- Link only the public Egeria Scaffold repo as a representative technical artifact, not private client or internal vault URLs.
- No new tests, no dependencies, no new components, no claims about production deployments, performance metrics, or unverified client outcomes.

## Acceptance and review
- New career entry renders first with the same shape as earlier items, and OpenZeppelin is not shown as current.
- `egeriaSystems` has a matching case-study record, proper image and descriptive alt, useful public link, and three readable Context / Build / Outcome sections.
- Existing project sorting and featured/archive behavior remain intact. No client confidential material is published.
- Run available existing checks without creating tests; review content correctness, UI/accessibility integration, and security/privacy before creating a PR.
