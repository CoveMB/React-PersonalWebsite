import {
  focusAreas,
  heroProofItems,
  profileHeadline,
  profileName,
  profileSummary,
  resumeDownloadName,
  resumeFilePath,
} from "../../utils/profile";
import SocialLinks from "../shared/SocialLinks";
import Avatar from "./Avatar";

const heroActionLinks = [
  {
    className: "headerCardPrimaryLink",
    download: resumeDownloadName,
    href: resumeFilePath,
    label: "Download resume",
  },
  {
    className: "headerCardSecondaryLink",
    href: "#projects",
    label: "View selected work",
  },
];

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

const renderHeroProofItem = ({ category, summary, title }) => (
  <li className="headerCardProofItem" key={category}>
    <p className="headerCardProofCategory">{category}</p>
    <p className="headerCardProofTitle">{title}</p>
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
        <p className="cardListCompetenceTitle headerCardActionTitle">Connect</p>
        <div className="social-icons-header">
          <SocialLinks
            imageClassName="svgSocialHeader"
            linkClassName="headerSocialLink"
          />
        </div>
      </div>

      <div className="headerCardSidebarBlock">
        <p className="cardListCompetenceTitle headerCardActionTitle">Focus</p>
        <ul className="headerCardFocusList">
          {focusAreas.map(renderFocusArea)}
        </ul>
      </div>
    </aside>

    <div className="headerCardMain">
      <div className="headerCardIntro">
        <p className="card-header-welcome">{profileHeadline}</p>
        <h1 className="headerCardTitle">{profileName}</h1>
        <p className="headerCardSummary">{profileSummary}</p>
      </div>

      <div className="headerCardActions">
        {heroActionLinks.map(renderHeroActionLink)}
      </div>
    </div>

    <section
      aria-labelledby="header-card-proof-title"
      className="headerCardProofPanel"
    >
      <p
        className="cardListCompetenceTitle headerCardSectionTitle"
        id="header-card-proof-title"
      >
        Selected work
      </p>
      <ul className="headerCardProofList">
        {heroProofItems.map(renderHeroProofItem)}
      </ul>
    </section>
  </>
);

export default HeaderCardContent;
