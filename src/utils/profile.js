export const profileEmailAddress = "marquisbenjamin23@gmail.com";
export const emailLink = `mailto:${profileEmailAddress}`;
const githubProfileUrl = "https://github.com/CoveMB";
const linkedinProfileUrl =
  "https://www.linkedin.com/in/cove-marquis-eth/?locale=en_US";
const instagramProfileUrl = "https://www.instagram.com/cove.suchness/?hl=en";
export const profileName = "Cove Marquis";
export const profileHeadline = "Senior full-stack blockchain developer";
export const profileSummary =
  "I build secure product applications and tooling across the full-stack. With a strong focus on product research and development and delivery quality. I value team collaboration and process improvement. Most recently, I worked on blockchain tooling and full-stack product engineering at OpenZeppelin.";
export const profileLocation = "Montreal, Canada";
export const profileTimezone = "Eastern Time (America/Toronto)";
export const profileAvailability = "Open to selected opportunities";

export const resumeDownloadName = "Resume Cove Marquis EN.pdf";
export const resumeFilePath = encodeURI(
  `/static/documents/${resumeDownloadName}`,
);

export const socialLinks = [
  {
    alt: "email icon",
    href: emailLink,
    imagePath: "/static/images/email.svg",
    target: "_top",
  },
  {
    alt: "LinkedIn Icon",
    href: linkedinProfileUrl,
    imagePath: "/static/images/linkedinSvg.svg",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    alt: "GitHub Icon",
    href: githubProfileUrl,
    imagePath: "/static/images/github.svg",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    alt: "Instagram Icon",
    href: instagramProfileUrl,
    imagePath: "/static/images/instagram.svg",
    rel: "noopener noreferrer",
    target: "_blank",
  },
];

export const focusAreas = [
  "Product development",
  "Process improvement",
  "Team support",
  "Developer experience",
];

const createHeroProofItem = ({
  category,
  summary,
  title,
}) => ({
  category,
  summary,
  title,
});

export const heroProofItems = [
  createHeroProofItem({
    category: "Engineering",
    summary:
      "Built full-stack applications on AWS-backed services, and CI/CD pipelines."
  }),
  createHeroProofItem({
    category: "Product",
    summary:
      "Led architecture, MVP scope, user research, and product-market fit decisions.",
  }),
  createHeroProofItem({
    category: "Team",
    summary:
      "Owned onboarding, facilitated Scrum, mentored developers, and improved daily workflows across delivery teams.",
  }),
];

const createMilestoneItem = ({ label, organization }) => ({
  label,
  organization,
});

export const milestoneItems = [
  createMilestoneItem({
    label: "Senior Full Stack Blockchain Developer",
    organization: "OpenZeppelin",
  }),
  createMilestoneItem({
    label: "Professional Scrum Master",
    organization: "PSMI",
  }),
  createMilestoneItem({
    label: "Tech Mentor",
    organization: "QueerTech Montreal",
  }),
  createMilestoneItem({
    label: "Lead Full Stack Developer",
    organization: "Skeepers",
  }),
  createMilestoneItem({
    label: "Product Ownership Bootcamp",
    organization: "Linky",
  }),
  createMilestoneItem({
    label: "Montreal cohort Tech Track",
    organization: "Next AI",
  }),
  createMilestoneItem({
    label: "Entrepreneur in Acceleration",
    organization: "Centech",
  }),
  createMilestoneItem({
    label: "CTO & Co-founder",
    organization: "VizzMD",
  }),
  createMilestoneItem({
    label: "Full Stack Teacher and Mentor",
    organization: "Le Wagon",
  }),
  createMilestoneItem({
    label: "Marketing and Data Pipelines",
    organization: "LCI Education",
  }),
];

export const trustSignalGroups = [
  {
    label: "Worked with",
    items: [
      "OpenZeppelin",
      "Aldo Group",
      "Next AI",
      "Centech",
      "Le Wagon",
      "LCI Education",
    ],
  },
  {
    label: "Learned from",
    items: [
      "Professional Scrum Master I",
      "Professional Scrum With Kanban I",
      "Certified Ethereum Developer",
      "Product Ownership Linky",
    ],
  },
  {
    label: "Mentored for",
    items: ["QueerTech Montreal", "Circonflex"],
  },
];
