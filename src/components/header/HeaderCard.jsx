import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataHeader } from "../../parallaxEffects/parallaxEffects";
import Avatar from "./Avatar";
import HeaderCardContent from "./HeaderCardContent";

export default function HeaderCard() {
  return (
    <ScrollParallax className="parallaxTitle" parallaxData={parallaxDataHeader}>
      <div className="header-card scrollbarxcustom animated fadeIn">
        <div className="gradient-square-avatar">
          <Avatar />
        </div>
        <HeaderCardContent />
      </div>
    </ScrollParallax>
  );
}
