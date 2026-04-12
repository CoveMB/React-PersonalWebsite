import {
  heroProofItems,
  profileHeadline,
  profileName,
  profileSummary,
  resumeDownloadName,
  resumeFilePath,
} from "../../utils/profile";
import { getSiteSection } from "../../content/siteContent";
import SocialLinks from "../shared/SocialLinks";
import Avatar from "./Avatar";

const buildSectionJumpLink = ({ label, sectionId }) => {
  const sectionElementId = getSiteSection(sectionId)?.elementId;

  if (!sectionElementId) {
    return null;
  }

  return {
    className: "headerCardSecondaryLink",
    href: `#${sectionElementId}`,
    label,
  };
};

const jumpInLinks = [
  buildSectionJumpLink({
    label: "Work Style",
    sectionId: "cards",
  }),
  buildSectionJumpLink({
    label: "Career Path",
    sectionId: "chronology",
  }),
  buildSectionJumpLink({
    label: "Projects",
    sectionId: "features",
  }),
  buildSectionJumpLink({
    label: "Role-Fit AI",
    sectionId: "ongoing",
  }),
].filter(Boolean);

const resumeActionLink = {
  className: "headerCardPrimaryLink",
  download: resumeDownloadName,
  href: resumeFilePath,
  label: "Download resume",
};

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

const renderHeroProofItem = ({ category, summary }) => (
  <li className="headerCardProofItem" key={category}>
    <p className="headerCardProofCategory">{category}</p>
    <p className="headerCardProofSummary">{summary}</p>
  </li>
);

const HeaderCardContent = () => (
  <>
    <aside className="headerCardSidebar">
      <div className="gradient-square-avatar headerCardAvatarFrame">
        <Avatar />
      </div>

      <div className="headerCardSidebarBlock">
        {/* <p className="cardListCompetenceTitle headerCardActionTitle">Connect</p> */}
        <div className="social-icons-header">
          <SocialLinks
            imageClassName="svgSocialHeader"
            linkClassName="headerSocialLink"
          />
        </div>
        <div className="headerCardJumpList">
          {renderHeroActionLink(resumeActionLink)}
        </div>
      </div>

      {/* <div className="headerCardSidebarBlock">
        <p className="cardListCompetenceTitle headerCardActionTitle">Jump In</p>
        <div className="headerCardJumpList">
          {jumpInLinks.map(renderHeroActionLink)}
        </div>
      </div> */}
    </aside>

    <div className="headerCardMain">
      {/* <div className="headerCardIntro"> */}
        <p className="card-header-welcome">{profileHeadline}</p>
        <h1 className="headerCardTitle">{profileName}</h1>
        <p className="headerCardSummary">{profileSummary}</p>
      {/* </div> */}
    </div>

    <div
      aria-labelledby="header-card-proof-title"
      className="headerCardProofPanel"
    >
      <p
        className="cardListCompetenceTitle headerCardSectionTitle"
        id="header-card-proof-title"
      >
        Expertise
      </p>
      <ul className="headerCardProofList">
        {heroProofItems.map(renderHeroProofItem)}
      </ul>
    </div>
  </>
);

export default HeaderCardContent;
