import { renderProjectRichText } from "./projectText";
import ProjectImage from "./ProjectImage";

const maximumVisibleTechBadges = 6;
const caseStudyNumberFormatter = new Intl.NumberFormat("en-US", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

const getProjectActionLinks = ({ primaryHref, primaryLabel, sourceHref }) => {
  const primaryAction = primaryHref
    ? [
        {
          href: primaryHref,
          isPrimary: true,
          label: primaryLabel,
        },
      ]
    : [];
  const sourceAction = sourceHref
    ? [
        {
          href: sourceHref,
          isPrimary: !primaryHref,
          label: "Source",
        },
      ]
    : [];

  return [...primaryAction, ...sourceAction];
};

const getProjectActionLinkClassName = (isPrimary) => {
  if (isPrimary) {
    return "projectActionLink projectActionPrimary";
  }

  return "projectActionLink";
};

const getProjectCaseStudyEyebrow = ({
  caseStudyCollectionLabel,
  projectIndex,
}) =>
  `${caseStudyCollectionLabel} ${caseStudyNumberFormatter.format(projectIndex)}`;

const getVisibleTechBadges = (techStack) =>
  techStack.slice(0, maximumVisibleTechBadges);

const renderCaseStudySection = ({ id, label, text }) => (
  <div className="projectCaseStudySection" key={id}>
    <p className="projectCaseStudySectionLabel">{label}</p>
    <p className="projectCaseStudySectionText">
      {renderProjectRichText(text, id)}
    </p>
  </div>
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

const renderTechBadge = (technology) => (
  <li className="projectTechBadge" key={technology}>
    {technology}
  </li>
);

export default function Project({
  caseStudyCollectionLabel,
  project,
  projectIndex,
}) {
  const projectActionLinks = getProjectActionLinks(project);
  const visibleTechBadges = getVisibleTechBadges(project.techStack);

  return (
    <>
      <hr className="ongoingSeparator" />
      <article className="projectCaseStudy">
        <div className="projectCaseStudyContent">
          <header className="projectCaseStudyHeader">
            <p className="projectCaseStudyEyebrow">
              {getProjectCaseStudyEyebrow({
                caseStudyCollectionLabel,
                projectIndex,
              })}
            </p>
            <h3 className="projectCaseStudyTitle">{project.title}</h3>
            <p className="projectCaseStudySummary">
              {project.caseStudy.summary}
            </p>
          </header>

          <div className="projectCaseStudySections">
            {project.caseStudy.sections.map(renderCaseStudySection)}
          </div>

          <div className="projectCaseStudyMeta">
            <div className="projectCaseStudyMetaBlock">
              <p className="projectCaseStudyMetaLabel">Focus Areas</p>
              <ul className="projectTechList">
                {visibleTechBadges.map(renderTechBadge)}
              </ul>
            </div>

            <div className="projectCaseStudyMetaBlock">
              <p className="projectCaseStudyMetaLabel">Links</p>
              <div className="projectActionLinks">
                {projectActionLinks.map(renderProjectActionLink)}
              </div>
            </div>
          </div>
        </div>

        <div className="projectCaseStudyMedia">
          <ProjectImage
            imageAlt={project.imageAlt}
            mediaScale={project.mediaScale}
            primaryHref={project.primaryHref}
            projectImage={project.image}
            sourceHref={project.sourceHref}
          />
        </div>
      </article>
    </>
  );
}
