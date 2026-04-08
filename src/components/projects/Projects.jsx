"use client";

import { useState } from "react";
import Project from "./Project";
import { archivedProjects, featuredProjects } from "./projectCatalog";

const renderProject = (project) => (
  <Project key={project.id} project={project} />
);

export default function Projects() {
  const [showArchivedProjects, setShowArchivedProjects] = useState(false);

  const archiveToggleLabel = showArchivedProjects
    ? "Hide earlier projects"
    : `Show ${archivedProjects.length} more projects`;

  return (
    <>
      <div className="projectsSectionIntro">
        <p className="projectsEyebrow">Featured work</p>
        <p className="cardText ongoingIntro">
          These projects show the throughline of my work across developer
          tooling, product engineering, blockchain systems, and delivery
          infrastructure. The featured cases are the strongest recent examples,
          with earlier projects available below in reverse-chronological order.
        </p>
      </div>

      {featuredProjects.map(renderProject)}

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
          {archivedProjects.map(renderProject)}
        </div>
      ) : null}
    </>
  );
}
