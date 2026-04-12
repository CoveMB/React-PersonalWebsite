export const siteSections = [
  {
    elementId: "",
    id: "top",
    navigationAriaLabel: "Go to home section",
    navigationLabel: "Home",
    title: "",
  },
  {
    elementId: "cardsDiv",
    id: "cards",
    navigationAriaLabel: "Go to how I work section",
    navigationLabel: "How I Work",
    title: "How I Work",
  },
  {
    elementId: "career-path",
    id: "chronology",
    navigationAriaLabel: "Go to career path section",
    navigationLabel: "Career Path",
    title: "Career Path",
  },
  {
    elementId: "projects",
    id: "features",
    navigationAriaLabel: "Go to selected work section",
    navigationLabel: "Selected Work",
    title: "Selected Work",
  },
  {
    elementId: "role-fit",
    id: "ongoing",
    navigationAriaLabel: "Go to role-fit lab section",
    navigationLabel: "Lab",
    title: "Role-Fit Lab",
  },
];

const buildSectionTitlesById = (allSections) =>
  allSections.reduce(
    (sectionTitlesById, { id, title }) => ({
      ...sectionTitlesById,
      [id]: title,
    }),
    {},
  );

const sectionTitlesById = buildSectionTitlesById(siteSections);
export const siteSectionsById = Object.fromEntries(
  siteSections.map((section) => [ section.id, section ]),
);

export const getSectionTitle = (sectionId) => sectionTitlesById[sectionId] ?? "";
export const getSiteSection = (sectionId) => siteSectionsById[sectionId] ?? null;

export const qualificationContentByTopic = {
  lead: {
    body:
      "I help teams ship reliably by clarifying ownership, improving delivery habits, and keeping collaboration practical across changing product needs.",
    emphasis: "steady execution and stronger team flow",
    titleLines: ["Leadership", "& Delivery"],
  },
  learning: {
    body:
      "I learn fast, test new approaches carefully, and turn useful discoveries into repeatable workflows that help both delivery speed and quality.",
    emphasis: "applied learning with practical leverage",
    titleLines: ["Continuous", "Learning"],
  },
  polyvalent: {
    body:
      "I work across product, front-end, back-end, and infrastructure so complex systems can move from idea to delivery with less handoff friction.",
    emphasis: "end-to-end ownership with product judgment",
    titleLines: ["Platform", "& Product"],
  },
};

export const projectsSectionContent = {
  archivedTitle: "Earlier Work",
  caseStudyLabel: "Case study",
  earlierWorkLabel: "Earlier work",
  eyebrow: "Selected case studies",
  intro:
    "Three lead case studies show recent work across developer tooling, product engineering, and systems delivery. Earlier work stays accessible below.",
};

export const getProjectsArchiveToggleLabel = ({
  archivedProjectCount,
  showArchivedProjects,
}) => {
  if (showArchivedProjects) {
    return "Hide earlier work";
  }

  return `Show ${archivedProjectCount} more case studies`;
};
