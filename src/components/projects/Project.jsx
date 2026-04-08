import ProjectImage from "./ProjectImage";

const getProjectRowClassName = (side) => {
  if (side === "left") {
    return "ongoingRow ongoingRowMediaFirst";
  }

  return "ongoingRow";
};

export default function Project({ project }) {
  return (
    <>
      <hr className="ongoingSeparator" />
      <div className={getProjectRowClassName(project.side)}>
        {project.text}
        <div className="project-image-n-details">
          <ProjectImage
            imageAlt={project.imageAlt}
            mediaScale={project.mediaScale}
            primaryHref={project.primaryHref}
            primaryLabel={project.primaryLabel}
            projectImage={project.image}
            projectTitle={project.title}
            side={project.side}
            sourceHref={project.sourceHref}
            techStack={project.techStack}
          />
        </div>
      </div>
    </>
  );
}
