import {
  resumeDownloadName,
  resumeFilePath,
} from "../../utils/profile";
import SocialLinks from "../shared/SocialLinks";

const doneImagePath = "/static/images/donesvg.svg";

const focusAreas = [
  "Full-stack delivery",
  "Process improvement",
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

const heroActionLinks = [
  {
    className: "headerCardPrimaryLink",
    download: resumeDownloadName,
    href: resumeFilePath,
    label: "Download resume",
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
        contracts, backend systems, and modern frontend applications, with a
        strong focus on process improvement and delivery quality. Most
        recently, I worked on blockchain tooling and full-stack product
        engineering at
        <strong> OpenZeppelin</strong>.
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
        Milestones
      </p>
      {milestoneItems.map(renderMilestone)}
      <div className="grabEmailPart" />
    </div>
    <div className="headerCardText headerCardBottomSection">
      <div className="headerCardBottomBlock">
        <p className="cardListCompetenceTitle headerCardActionTitle">Connect</p>
        <div className="social-icons-header">
          <SocialLinks
            imageClassName="svgSocialHeader"
            linkClassName="headerSocialLink"
          />
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
