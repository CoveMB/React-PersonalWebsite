import React from "react";

const doneImagePath = "/static/images/donesvg.svg";
const resumeFilePath = encodeURI(
  "/static/documents/Resume Cove Marquis EN.pdf",
);
const githubProfileUrl = "https://github.com/CoveMB";

const focusAreas = [
  "Full-stack delivery",
  "Processes improvement",
  "Developer tooling",
];

const milestoneItems = [
  {
    label: "Senior Full Stack Blockchain Developer",
    organization: "OpenZeppelin",
  },
  {
    label: "Certified Ethereum Developer",
    organization: "Blockchain Council",
  },
  {
    label: "Professional Scrum Master",
    organization: "PSMI",
  },
  {
    label: "Tech Mentor",
    organization: "QueerTech Montreal",
  },
  {
    label: "Lead Full Stack Developer",
    organization: "Spockee",
  },
  {
    label: "Lead Full Stack Developer",
    organization: "Tooly",
  },
  {
    label: "Montreal cohort Tech Track",
    organization: "Next AI",
  },
  {
    label: "Entrepreneur in Acceleration",
    organization: "Centech",
  },
  {
    label: "CTO & Co-founder",
    organization: "VizzMD",
  },
  {
    label: "Full Stack Teacher and Mentor",
    organization: "Le Wagon",
  },
];

const contactLinks = [
  {
    alt: "email icon",
    href: "mailto:bmarquiscom@gmail.com",
    imagePath: "/static/images/email.svg",
    target: "_top",
  },
  {
    alt: "LinkedIn Icon",
    href: "https://www.linkedin.com/in/cove-marquis-eth/?locale=en_US",
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
    href: "https://www.instagram.com/cove.suchness/?hl=en",
    imagePath: "/static/images/instagram.svg",
    rel: "noopener noreferrer",
    target: "_blank",
  },
];

const heroActionLinks = [
  {
    className: "headerCardPrimaryLink",
    download: "Resume Cove Marquis EN.pdf",
    href: resumeFilePath,
    label: "View resume",
  },
];

const renderMilestone = ({ label, organization }) => (
  <div className="cardListCompetence" key={`${label}-${organization}`}>
    <strong className="darkblueTitle">
      <img className="svgDone" src={doneImagePath} alt="svg done" /> {label}
    </strong>{" "}
    | {organization}
  </div>
);

const renderContactLink = ({ alt, href, imagePath, rel, target }) => (
  <a className="footerLink" href={href} key={href} rel={rel} target={target}>
    <img className="svgSocialHeader" src={imagePath} alt={alt} />
  </a>
);

const renderHeroActionLink = ({
  className,
  download,
  href,
  label,
  rel,
  target,
}) => (
  <a
    aria-label={label}
    className={className}
    download={download}
    href={href}
    key={label}
    rel={rel}
    target={target}
  >
    {label}
  </a>
);

const renderFocusArea = (focusArea) => (
  <li className="headerCardFocusItem" key={focusArea}>
    {focusArea}
  </li>
);

const HeaderCardContent = () => (
  <>
    <div className="headerCardText">
      <p className="card-header-welcome">
        Senior full-stack blockchain developer
      </p>
      <h1 className="headerCardTitle">Cove Marquis-Bortoli</h1>
      <p className="headerCardSummary">
        I build secure product platforms and developer tooling across smart
        contracts, backend systems, and modern frontend applications. Most
        recently, I worked on blockchain tooling and product engineering at
        OpenZeppelin.
      </p>
      <div className="headerCardActions">
        {heroActionLinks.map(renderHeroActionLink)}
      </div>
    </div>
    <div className="headerCardText">
      <p
        className="cardListCompetenceTitle headerCardSectionTitle"
        style={{ marginTop: "40px" }}
      >
        Selected experience
      </p>
      {milestoneItems.map(renderMilestone)}
      <div className="grabEmailPart" />
    </div>
    <div className="headerCardText headerCardBottomSection">
      <div className="headerCardBottomBlock">
        <p className="cardListCompetenceTitle headerCardActionTitle">Connect</p>
        <div className="social-icons-header">
          {contactLinks.map(renderContactLink)}
        </div>
      </div>
      <div className="headerCardBottomBlock headerCardResumeBlock">
        <p className="cardListCompetenceTitle headerCardActionTitle">Focus</p>
        <ul className="headerCardFocusList">
          {focusAreas.map(renderFocusArea)}
        </ul>
      </div>
    </div>
  </>
);

export default HeaderCardContent;
