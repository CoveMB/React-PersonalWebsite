import {
  CAREER_CHRONOLOGY_SUMMARY,
  careerSummaryTextById,
} from "./texts/careerTexts";

const createCareerChronologyItem = ({
  category,
  dateLabel,
  location = "",
  organization,
  summary,
  title,
}) => ({
  category,
  dateLabel,
  location,
  organization,
  summary,
  title,
});

export const careerChronologySectionContent = {
  summary: CAREER_CHRONOLOGY_SUMMARY,
};

export const careerChronologyItems = [
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2026-Present",
    location: "Montreal, Canada | Remote",
    organization: "Egeria Systems",
    summary: careerSummaryTextById.egeriaSystems,
    title: "Senior Full-Stack Engineer & Technology Consultant",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2022-May 2026",
    location: "Remote",
    organization: "OpenZeppelin",
    summary: careerSummaryTextById.openZeppelin,
    title: "Senior Full-Stack Blockchain Developer",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2022",
    organization: "Scrum.org",
    summary: careerSummaryTextById.professionalScrumWithKanbanI,
    title: "Professional Scrum with Kanban I",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2022",
    organization: "Blockchain-Council.org",
    summary: careerSummaryTextById.certifiedEthereumDeveloperI,
    title: "Certified Ethereum Developer I",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2022",
    location: "Montreal, Canada",
    organization: "Aldo",
    summary: careerSummaryTextById.aldo,
    title: "Senior Software Developer",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2021",
    location: "Montreal, Canada",
    organization: "Spockee",
    summary: careerSummaryTextById.spockee,
    title: "Full Stack Developer & Scrum Master",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2021",
    organization: "Scrum.org",
    summary: careerSummaryTextById.professionalScrumMasterI,
    title: "Professional Scrum Master I",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2020",
    location: "Montreal, Canada",
    organization: "Tooly",
    summary: careerSummaryTextById.tooly,
    title: "Lead Full-Stack Developer & DevOps",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2020",
    organization: "Linky Product Bootcamp",
    summary: careerSummaryTextById.linkyProgram,
    title: "Product Manager Program I",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2019",
    location: "Montreal, Canada",
    organization: "VizzMD at Centech's Acceleration Program",
    summary: careerSummaryTextById.vizzMd,
    title: "Co-founder and CTO",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2019",
    location: "Montreal, Canada",
    organization: "Le Wagon",
    summary: careerSummaryTextById.leWagon,
    title: "Full-Stack Development Instructor",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2019",
    organization: "Le Wagon Bootcamp",
    summary: careerSummaryTextById.leWagonCertification,
    title: "Full Stack Developer Program Certification",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2018",
    location: "Montreal, Canada",
    organization: "LCI Education",
    summary: careerSummaryTextById.lciEducation,
    title: "Web Analyst and Data Engineer",
  }),
  createCareerChronologyItem({
    category: "Education",
    dateLabel: "2017",
    organization: "University of Quebec at Montreal (UQAM)",
    summary: careerSummaryTextById.uqam,
    title: "Master's Degree in Sociology",
  }),
];
