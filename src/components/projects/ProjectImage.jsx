import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataProjectImageLeft, parallaxDataProjectImageRight } from "../../parallaxEffects/parallaxEffects";

const parallaxDataBySide = {
  left: parallaxDataProjectImageLeft,
  right: parallaxDataProjectImageRight,
};

export default function ProjectImage({ hrefSource, projectImage, projectName, side }) {
  return (
    <ScrollParallax className={`parallaxImage${projectName}`} parallaxData={parallaxDataBySide[side]}>
      <a href={hrefSource} rel="noreferrer" target="_blank">
        <img alt={`${projectName} logo`} className={`projectImage${side} projectImage${projectName}`} src={projectImage} width="90" />
      </a>
    </ScrollParallax>
  );
}
