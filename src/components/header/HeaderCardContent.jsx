import {
  focusAreas,
  milestoneItems,
  profileHeadline,
  profileName,
  profileSummary,
  resumeDownloadName,
  resumeFilePath,
} from "../../utils/profile";
import SocialLinks from "../shared/SocialLinks";

const doneImagePath = "/static/images/donesvg.svg";

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
      <p className="card-header-welcome">{profileHeadline}</p>
      <h1 className="headerCardTitle">{profileName}</h1>
      <p className="headerCardSummary">{profileSummary}</p>
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
