import ScrollParallax from "../animation/ScrollParallax";
import { subtleRevealParallaxData } from "../../parallaxEffects/parallaxEffects";

const getProjectMediaHref = ({ primaryHref, sourceHref }) =>
  primaryHref ?? sourceHref ?? "";

const getProjectMediaImageStyle = (mediaScale) => {
  if (!mediaScale || mediaScale === 1) {
    return undefined;
  }

  return {
    "--project-media-scale": mediaScale,
  };
};

export default function ProjectImage({
  imageAlt,
  mediaScale,
  primaryHref,
  projectImage,
  sourceHref,
}) {
  const projectMediaHref = getProjectMediaHref({
    primaryHref,
    sourceHref,
  });
  const projectMediaImageStyle = getProjectMediaImageStyle(mediaScale);
  const projectMediaContent = (
    <div className="projectMediaSurface">
      <div className="projectMediaViewport">
        <img
          alt={imageAlt}
          className="projectMediaImage"
          src={projectImage}
          style={projectMediaImageStyle}
        />
      </div>
    </div>
  );

  return (
    <ScrollParallax
      className="projectMediaCard"
      parallaxData={subtleRevealParallaxData}
    >
      {projectMediaHref ? (
        <a
          className="projectMediaSurfaceLink"
          href={projectMediaHref}
          rel="noreferrer"
          target="_blank"
        >
          {projectMediaContent}
        </a>
      ) : (
        projectMediaContent
      )}
    </ScrollParallax>
  );
}
