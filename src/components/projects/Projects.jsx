"use client";

import { useState } from "react";
import Project from "./Project";

const projects = [
  { projectName: "suiTooling", side: "left" },
  { projectName: "defender", side: "right" },
  { projectName: "astroLight", side: "left" },
  { projectName: "aldo", side: "right" },
  { projectName: "spockee", side: "left" },
  { projectName: "tooly", side: "right" },
  { projectName: "cominity", side: "left" },
  { projectName: "centech", side: "right" },
  { projectName: "leWagon", side: "left" },
  { projectName: "shareIn", side: "right" },
  { projectName: "airflow", side: "left" },
];

const featuredProjectCount = 4;
const featuredProjects = projects.slice(0, featuredProjectCount);
const archivedProjects = projects.slice(featuredProjectCount);

const renderProject = ({ projectName, side }) => (
  <Project key={projectName} projectName={projectName} side={side} />
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
          During my personal and professional path I encounter different
          challenges. Learning new skills led me to turn them into opportunities
          and build real projects. Here are some of my recent work across
          blockchain tooling, product engineering, and developer experience
          sorted with most recent first:
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
