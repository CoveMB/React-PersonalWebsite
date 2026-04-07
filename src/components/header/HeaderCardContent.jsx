import React from "react";

const doneImagePath = "/static/images/donesvg.svg";
const resumeFilePath = encodeURI(
  "/static/documents/Resume Cove Marquis EN.pdf",
);

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
    href: "https://github.com/CoveMB",
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

const HeaderCardContent = () => (
  <>
    <div className="headerCardText">
      <p className="card-header-welcome">Hi, I'm</p>
      <h1 className="headerCardTitle">Cove Marquis-Bortoli</h1>
    </div>
    <div className="headerCardText">
      <p className="cardListCompetenceTitle headerCardSectionTitle">
        MILESTONES:
      </p>
      {milestoneItems.map(renderMilestone)}
      <div className="grabEmailPart" />
    </div>
    <div className="headerCardText headerCardBottomSection">
      <div className="headerCardBottomBlock">
        <p className="cardListCompetenceTitle headerCardActionTitle">
          CONTACT ME:
        </p>
        <div className="social-icons-header">
          {contactLinks.map(renderContactLink)}
        </div>
      </div>
      <div className="headerCardBottomBlock headerCardResumeBlock">
        <a
          aria-label="Download Cove Marquis-Bortoli CV"
          className="headerCardDownloadLink"
          download="Resume Cove Marquis EN.pdf"
          href={resumeFilePath}
        >
          Download my CV
        </a>
      </div>
    </div>
  </>
);

export default HeaderCardContent;
