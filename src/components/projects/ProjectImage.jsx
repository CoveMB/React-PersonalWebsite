import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataProjectImageLeft, parallaxDataProjectImageRight } from "../../parallaxEffects/parallaxEffects";

const parallaxDataBySide = {
  left: parallaxDataProjectImageLeft,
  right: parallaxDataProjectImageRight,
};

const renderTechBadge = (technology) => (
  <li className="projectTechBadge" key={technology}>
    {technology}
  </li>
);

const renderProjectActionLink = ({ href, isPrimary, label }) => (
  <a
    className={`projectActionLink ${isPrimary ? "projectActionPrimary" : "projectActionSecondary"}`}
    href={href}
    key={`${label}-${href}`}
    rel="noreferrer"
    target="_blank"
  >
    {label}
  </a>
);

const getProjectActionLinks = ({ primaryHref, primaryLabel, sourceHref }) => {
  const primaryAction = {
    href: primaryHref,
    isPrimary: true,
    label: primaryLabel,
  };

  if (!sourceHref || sourceHref === primaryHref) {
    return [ primaryAction ];
  }

  return [
    primaryAction,
    {
      href: sourceHref,
      isPrimary: false,
      label: "Source",
    },
  ];
};

export default function ProjectImage({
  imageAlt,
  primaryHref,
  primaryLabel,
  projectImage,
  projectName,
  projectTitle,
  side,
  sourceHref,
  techStack,
}) {
  const projectActionLinks = getProjectActionLinks({ primaryHref, primaryLabel, sourceHref });

  return (
    <ScrollParallax
      className={`parallaxImage${projectName} projectMediaCard`}
      parallaxData={parallaxDataBySide[side]}
    >
      <article>
        <a className="projectMediaFrameLink" href={primaryHref} rel="noreferrer" target="_blank">
          <div className="projectMediaFrame">
            <div className="projectMediaFrameBar">
              <span className="projectMediaFrameDot" />
              <span className="projectMediaFrameDot" />
              <span className="projectMediaFrameDot" />
            </div>
            <div className="projectMediaViewport">
              <img alt={imageAlt} className={`projectMediaImage projectMediaImage${projectName}`} src={projectImage} />
            </div>
          </div>
        </a>

        <div className="projectMediaMeta">
          <h3 className="projectMediaTitle">{projectTitle}</h3>

          <ul className="projectTechList">
            {techStack.map(renderTechBadge)}
          </ul>

          <div className="projectActionLinks">
            {projectActionLinks.map(renderProjectActionLink)}
          </div>
        </div>
      </article>
    </ScrollParallax>
  );
}
