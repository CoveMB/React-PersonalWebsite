import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataOpacity } from "../../parallaxEffects/parallaxEffects";

export default function OpacityParallax({ children, classNameElement, nextId }) {
  return (
    <ScrollParallax className={classNameElement} parallaxData={parallaxDataOpacity(nextId)}>
      {children}
    </ScrollParallax>
  );
}
