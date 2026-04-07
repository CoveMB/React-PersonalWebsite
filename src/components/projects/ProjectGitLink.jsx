import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataProjectGitLinkLeft, parallaxDataProjectGitLinkRight } from "../../parallaxEffects/parallaxEffects";

const parallaxDataBySide = {
  left: parallaxDataProjectGitLinkLeft,
  right: parallaxDataProjectGitLinkRight,
};

export default function ProjectGitLink({ hrefSource, side }) {
  return (
    <ScrollParallax className={`projectBtnPosition${side}`} parallaxData={parallaxDataBySide[side]}>
      <a href={hrefSource} rel="noreferrer" target="_blank">
        <img alt="GitHub Icon" className="projectRepoBtn" src="/static/images/github.svg" />
      </a>
    </ScrollParallax>
  );
}
