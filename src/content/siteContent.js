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
    navigationLabel: "Focus",
    title: "How I Work",
  },
  {
    elementId: "career-path",
    id: "chronology",
    navigationAriaLabel: "Go to career path section",
    navigationLabel: "Career",
    title: "Career Path",
  },
  {
    elementId: "projects",
    id: "features",
    navigationAriaLabel: "Go to projects section",
    navigationLabel: "Projects",
    title: "Showcased Projects",
  },
  {
    elementId: "role-fit",
    id: "ongoing",
    navigationAriaLabel: "Go to role-fit AI lab section",
    navigationLabel: "AI Lab",
    title: "Role-Fit AI Lab",
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
      "As a lead developer and a scrum master, I have learned to orient individuals and spread knowledge to empower the team and strengthen its effectiveness supporting the project's goals for continuous improvement.",
    emphasis: "Stronger team flow and steady execution delivery",
    titleLines: ["Team", "& Delivery"],
  },
  polyvalent: {
    body:
      "I work across product, front-end, back-end, and infrastructure so complex systems can move from idea to delivery with less handoff friction while reviewing processes for enhanced efficiency.",
    emphasis: "Taking charge of polyvalent missions, with a holistic point of view",
    titleLines: ["Platform", "& Product"],
  },
  learning: {
    body:
      "I learn fast, test new approaches, and turn useful discoveries into repeatable workflows that help both delivery speed and quality. I research and propose new and innovative solutions to challenging problems",
    emphasis: "Applied learning with practical leverage",
    titleLines: ["Learning", "& Innovation"],
  },
};

export const projectsSectionContent = {
  archivedTitle: "Earlier Work",
  caseStudyLabel: "Case study",
  earlierWorkLabel: "Earlier work",
  intro:
    "These projects show recent work across product engineering, systems delivery and developer tooling. Sorted in chronological order.",
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
