import ScrollParallax from "../animation/ScrollParallax";
import { heroCardScrollParallaxData } from "../../parallaxEffects/parallaxEffects";
import HeaderCard from "./HeaderCard";

export default function Header() {
  return (
    <section className="headerSection">
      <div aria-hidden="true" className="headerBackdrop" />
      <div className="headerShell">
        <ScrollParallax className="headerCardParallax" parallaxData={heroCardScrollParallaxData}>
          <HeaderCard />
        </ScrollParallax>
      </div>
    </section>
  );
}
