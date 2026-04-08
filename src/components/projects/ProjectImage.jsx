import ScrollParallax from "../animation/ScrollParallax";
import {
  parallaxDataProjectImageLeft,
  parallaxDataProjectImageRight,
} from "../../parallaxEffects/parallaxEffects";

const maxVisibleTechBadges = 6;

const parallaxDataBySide = {
  left: parallaxDataProjectImageLeft,
  right: parallaxDataProjectImageRight,
};

const getProjectActionLinks = ({ primaryHref, primaryLabel, sourceHref }) => {
  const primaryAction = {
    href: primaryHref,
    isPrimary: true,
    label: primaryLabel,
  };

  if (!sourceHref) {
    return [primaryAction];
  }

  const sourceAction = {
    href: sourceHref,
    isPrimary: false,
    label: "Source",
  };

  if (!primaryHref) {
    return [sourceAction];
  }

  return [primaryAction, sourceAction];
};

const getProjectActionLinkClassName = (isPrimary) => {
  if (isPrimary) {
    return "projectActionLink projectActionPrimary";
  }

  return "projectActionLink";
};

const getProjectMediaImageStyle = (mediaScale) => {
  if (!mediaScale || mediaScale === 1) {
    return undefined;
  }

  return {
    "--project-media-scale": mediaScale,
  };
};

const getVisibleTechBadges = (techStack) =>
  techStack.slice(0, maxVisibleTechBadges);

const renderTechBadge = (technology) => (
  <li className="projectTechBadge" key={technology}>
    {technology}
  </li>
);

const renderProjectActionLink = ({ href, isPrimary, label }) => (
  <a
    className={getProjectActionLinkClassName(isPrimary)}
    href={href}
    key={`${label}-${href}`}
    rel="noreferrer"
    target="_blank"
  >
    {label}
  </a>
);

export default function ProjectImage({
  imageAlt,
  mediaScale,
  primaryHref,
  primaryLabel,
  projectImage,
  projectTitle,
  side,
  sourceHref,
  techStack,
}) {
  const projectActionLinks = getProjectActionLinks({
    primaryHref,
    primaryLabel,
    sourceHref,
  });
  const projectMediaImageStyle = getProjectMediaImageStyle(mediaScale);
  const visibleTechBadges = getVisibleTechBadges(techStack);

  return (
    <ScrollParallax
      className="projectMediaCard"
      parallaxData={parallaxDataBySide[side]}
    >
      <article>
        <a
          className="projectMediaFrameLink"
          href={primaryHref}
          rel="noreferrer"
          target="_blank"
        >
          <div className="projectMediaFrame">
            <div className="projectMediaFrameBar">
              <span className="projectMediaFrameDot" />
              <span className="projectMediaFrameDot" />
              <span className="projectMediaFrameDot" />
            </div>
            <div className="projectMediaViewport">
              <img
                alt={imageAlt}
                className="projectMediaImage"
                src={projectImage}
                style={projectMediaImageStyle}
              />
            </div>
          </div>
        </a>

        <div className="projectMediaMeta">
          <h3 className="projectMediaTitle">{projectTitle}</h3>

          <ul className="projectTechList">
            {visibleTechBadges.map(renderTechBadge)}
          </ul>

          <div className="projectActionLinks">
            {projectActionLinks.map(renderProjectActionLink)}
          </div>
        </div>
      </article>
    </ScrollParallax>
  );
}
