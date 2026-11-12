import { howIWorkBodyTextByTopic } from "./texts/howIWorkTexts";
import { PROJECTS_SECTION_INTRO } from "./texts/projectTexts";

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
    body: howIWorkBodyTextByTopic.lead,
    emphasis: "Stronger team flow and steady execution delivery",
    titleLines: ["Team", "& Delivery"],
  },
  polyvalent: {
    body: howIWorkBodyTextByTopic.polyvalent,
    emphasis: "Taking charge of polyvalent missions, with a holistic point of view",
    titleLines: ["Platform", "& Product"],
  },
  learning: {
    body: howIWorkBodyTextByTopic.learning,
    emphasis: "Design that reflects the client's goals and identity",
    titleLines: ["Discovery", "& Design"],
  },
};

export const projectsSectionContent = {
  archivedTitle: "Earlier Work",
  caseStudyLabel: "Case study",
  earlierWorkLabel: "Earlier work",
  intro: PROJECTS_SECTION_INTRO,
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
