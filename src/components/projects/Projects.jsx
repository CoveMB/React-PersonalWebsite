"use client";

import { useState } from "react";
import {
  getProjectsArchiveToggleLabel,
  projectsSectionContent,
} from "../../content/siteContent";
import Project from "./Project";
import { archivedProjects, featuredProjects } from "./projectCatalog";

const createProjectRenderer = ({
  caseStudyCollectionLabel,
  projectNumberOffset = 0,
}) => (project, projectIndex) => (
  <Project
    caseStudyCollectionLabel={caseStudyCollectionLabel}
    key={project.id}
    project={project}
    projectIndex={projectNumberOffset + projectIndex + 1}
  />
);

export default function Projects() {
  const [showArchivedProjects, setShowArchivedProjects] = useState(false);

  const archiveToggleLabel = getProjectsArchiveToggleLabel({
    archivedProjectCount: archivedProjects.length,
    showArchivedProjects,
  });
  const renderFeaturedProject = createProjectRenderer({
    caseStudyCollectionLabel: projectsSectionContent.caseStudyLabel,
  });
  const renderArchivedProject = createProjectRenderer({
    caseStudyCollectionLabel: projectsSectionContent.earlierWorkLabel,
    projectNumberOffset: featuredProjects.length,
  });

  return (
    <>
      <div className="projectsSectionIntro">
        <p className="projectsEyebrow">{projectsSectionContent.eyebrow}</p>
        <p className="cardText ongoingIntro">
          {projectsSectionContent.intro}
        </p>
      </div>

      {featuredProjects.map(renderFeaturedProject)}

      <div className="projectsArchiveAction">
        <button
          aria-expanded={showArchivedProjects}
          className="projectsArchiveToggle"
          onClick={() =>
            setShowArchivedProjects((currentValue) => !currentValue)
          }
          type="button"
        >
          {archiveToggleLabel}
        </button>
      </div>

      {showArchivedProjects ? (
        <div className="projectsArchiveSection">
          <p className="projectsArchiveTitle">
            {projectsSectionContent.archivedTitle}
          </p>
          {archivedProjects.map(renderArchivedProject)}
        </div>
      ) : null}
    </>
  );
}
