export const profileEmailAddress = "marquisbenjamin23@gmail.com";
export const emailLink = `mailto:${profileEmailAddress}`;
const githubProfileUrl = "https://github.com/CoveMB";
const linkedinProfileUrl =
  "https://www.linkedin.com/in/cove-marquis-eth/?locale=en_US";
const instagramProfileUrl =
  "https://www.instagram.com/cove.suchness/?hl=en";
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
    style: { marginTop: "5px" },
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

export const trustSignalGroups = [
  {
    label: "Worked with",
    items: ["OpenZeppelin", "Aldo Group", "Next AI", "Centech", "Le Wagon"],
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
