"use client";

import { useEffect, useRef } from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import OpacityParallax from "./hoc/OpacityParallax";
import NavBtns from "./NavBtns";
import ParallaxTitle from "./ParalaxTitle";
import Projects from "./projects/Projects";
import QualificationContainer from "./qualifications/QualificationContainer";
import Story from "./speech/Speech";
import TrustSignals from "./trust/TrustSignals";
import NavBar from "./navbar/NavBar";
import { initializeStores } from "../store/initializeStores";
import { useStore } from "../store/useStore";

initializeStores();

const getSectionOffsets = ({
  cardsElement,
  featuresElement,
  ongoingElement,
}) => ({
  cards: cardsElement?.offsetTop ?? 0,
  features: featuresElement?.offsetTop ?? 0,
  ongoing: ongoingElement?.offsetTop ?? 0,
  top: 0,
});

const observeSectionOffsets = ({
  cardsElement,
  dispatch,
  featuresElement,
  ongoingElement,
}) => {
  const updateOffsets = () => {
    dispatch(
      "SET_REFS",
      getSectionOffsets({
        cardsElement,
        featuresElement,
        ongoingElement,
      }),
    );
  };

  updateOffsets();
  window.addEventListener("resize", updateOffsets);

  if (typeof ResizeObserver === "undefined") {
    return () => {
      window.removeEventListener("resize", updateOffsets);
    };
  }

  const resizeObserver = new ResizeObserver(updateOffsets);

  [cardsElement, featuresElement, ongoingElement]
    .filter(Boolean)
    .forEach((sectionElement) => {
      resizeObserver.observe(sectionElement);
    });

  return () => {
    window.removeEventListener("resize", updateOffsets);
    resizeObserver.disconnect();
  };
};

export default function App() {
  const cardsReference = useRef(null);
  const featuresReference = useRef(null);
  const ongoingReference = useRef(null);
  const [, dispatch] = useStore(false);

  useEffect(() => {
    return observeSectionOffsets({
      cardsElement: cardsReference.current,
      dispatch,
      featuresElement: featuresReference.current,
      ongoingElement: ongoingReference.current,
    });
  }, [dispatch]);

  return (
    <>
      <NavBtns />
      <NavBar />
      <Header />
      <OpacityParallax nextId="#projects">
        <div
          className="normalizedBackground"
          id="cardsDiv"
          ref={cardsReference}
        >
          <TrustSignals />
          <ParallaxTitle title="My Peculiarities" />
          <QualificationContainer />
        </div>
      </OpacityParallax>
      <OpacityParallax nextId="#story">
        <div className="normalizedBackgroundWhite" ref={featuresReference}>
          <ParallaxTitle idElement="projects" title="Some Of My Projects" />
          <Projects />
        </div>
      </OpacityParallax>
      <div className="normalizedBackgroundWhite" ref={ongoingReference}>
        <ParallaxTitle idElement="story" title="Speech me an email!" />
        <Story />
      </div>
      <Footer />
    </>
  );
}
