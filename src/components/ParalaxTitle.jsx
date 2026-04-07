import ScrollParallax from "./animation/ScrollParallax";
import { parallaxDataTitle } from "../parallaxEffects/parallaxEffects";

export default function ParallaxTitle({ idElement, title }) {
  return (
    <ScrollParallax className="parallaxTitle" parallaxData={parallaxDataTitle}>
      <h2 className="sectionTitle" id={idElement}>{title}</h2>
    </ScrollParallax>
  );
}
