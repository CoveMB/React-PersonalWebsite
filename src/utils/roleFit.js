import { projectCatalog } from "../components/projects/projectCatalog";
import { projectCaseStudiesById } from "../components/projects/projectText";
import {
  focusAreas,
  milestoneItems,
  profileAvailability,
  profileHeadline,
  profileLocation,
  profileName,
  profileSummary,
  trustSignalGroups,
} from "./profile";
import { resumeRoleFitText } from "./resumeText";

export const maximumJobDescriptionLength = 3500;
const preferredModelIdentifiers = [
  "Qwen2.5-0.5B-Instruct-q0f16-MLC",
  "Qwen2-0.5B-Instruct-q0f16-MLC",
  "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
  "Qwen2-0.5B-Instruct-q4f16_1-MLC",
  "Llama-3.2-1B-Instruct-q4f16_1-MLC",
  "Qwen2.5-0.5B-Instruct-q4f32_1-MLC",
  "Llama-3.2-1B-Instruct-q4f32_1-MLC",
];

const roleFitStrengths = [
  "Secure full-stack product engineering with strong delivery quality habits",
  "Developer tooling, operational automation, and stronger engineering workflows",
  "Blockchain and smart contract product work with a practical security mindset",
  "AWS, event-driven systems, microservices, CI/CD, and DevOps delivery",
  "Mentoring, enablement, scrum leadership, and process improvement",
];

const roleFitPositioningNotes = [
  "Strongest evidence is in product engineering, developer experience, security-minded delivery, and blockchain tooling.",
  "There is some AI-adjacent product exposure through Tooly and the Next AI program, but not deep ML research experience.",
  "If a role requires skills that are not clearly evidenced, call that out honestly as a ramp-up area.",
];

const stringifyBulletedList = (items) =>
  items.map((item) => `- ${item}`).join("\n");

const formatMilestoneItem = ({ label, organization }) =>
  `${label} | ${organization}`;

const formatTrustSignalGroup = ({ items, label }) =>
  `${label}: ${items.join(", ")}`;

const formatProjectContext = ({ plainText, referenceUrl, title }) =>
  `${title}: ${plainText}${referenceUrl ? ` | ${referenceUrl}` : ""}`;

const toPromptProject = ({ id, primaryHref, sourceHref, title }) => ({
  plainText: projectCaseStudiesById[id]?.plainText ?? "",
  referenceUrl: sourceHref ?? primaryHref ?? "",
  title,
});

const getPromptProjects = () =>
  projectCatalog
    .map(toPromptProject)
    .filter(({ plainText }) => plainText);

const buildPortfolioContext = () =>
  [
    `Name: ${profileName}`,
    `Headline: ${profileHeadline}`,
    `Location: ${profileLocation}`,
    `Availability: ${profileAvailability}`,
    `Summary: ${profileSummary}`,
    `Focus areas:\n${stringifyBulletedList(focusAreas)}`,
    `Strengths:\n${stringifyBulletedList(roleFitStrengths)}`,
    `Milestones:\n${stringifyBulletedList(milestoneItems.map(formatMilestoneItem))}`,
    `Trust signals:\n${stringifyBulletedList(trustSignalGroups.map(formatTrustSignalGroup))}`,
    `Project narratives:\n${stringifyBulletedList(getPromptProjects().map(formatProjectContext))}`,
    `Resume source:\n${resumeRoleFitText}`,
    `Positioning notes:\n${stringifyBulletedList(roleFitPositioningNotes)}`,
  ].join("\n\n");

const buildOutputContract = () =>
  [
    "Respond in plain text with exactly these section headings:",
    "Why I fit",
    "Relevant evidence (each spaced with a break line)",
    "Possible ramp-up areas",
    "Under each heading, use short bullet points.",
    "Keep the whole answer under 220 words.",
    "Write in first person as if I am speaking.",
    "Do not use markdown",
  ].join("\n");

export const buildRoleFitMessages = (jobDescription) => [
  {
    content: [
      `You help visitors understand whether ${profileName} fits a role.`,
      "Use only the portfolio context below.",
      "Do not invent employers, projects, certifications, timelines, or AI depth.",
      "When evidence is thin, say so directly and move it into ramp-up areas.",
      "If the job description asks for skills or experience that are well evidenced in the portfolio, highlight that in the fit and evidence sections mentioning specific job, projects or achievements where the skill is demonstrated.",
      buildPortfolioContext(),
    ].join("\n\n"),
    role: "system",
  },
  {
    content: [
      `Job description:\n${jobDescription}`,
      buildOutputContract(),
    ].join("\n\n"),
    role: "user",
  },
];

const getPreferredModelRecord = (modelList) =>
  preferredModelIdentifiers
    .map((modelIdentifier) =>
      modelList.find(({ model_id: modelId }) => modelId === modelIdentifier),
    )
    .find(Boolean);

const getSmallestFallbackModelRecord = (modelList) =>
  [ ...modelList ]
    .filter(({ model_id: modelId }) => /instruct/i.test(modelId))
    .sort((firstModel, secondModel) => {
      const firstVram = firstModel.vram_required_MB ?? Number.MAX_SAFE_INTEGER;
      const secondVram =
        secondModel.vram_required_MB ?? Number.MAX_SAFE_INTEGER;
      return firstVram - secondVram;
    })[0] ?? null;

export const selectRoleFitModelId = (modelList = []) =>
  getPreferredModelRecord(modelList)?.model_id ??
  getSmallestFallbackModelRecord(modelList)?.model_id ??
  null;
