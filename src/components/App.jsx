"use client";

import { useEffect, useRef } from "react";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import NavigationObserver from "./navigation/NavigationObserver";
import DotNavigation from "./navigation/DotNavigation";
import ParallaxTitle from "./ParalaxTitle";
import Projects from "./projects/Projects";
import QualificationContainer from "./qualifications/QualificationContainer";
import RoleFitSection from "./ai/AI";
import CareerChronology from "./chronology/CareerChronology";
import TrustSignals from "./trust/TrustSignals";
import { getSectionTitle, getSiteSection } from "../content/siteContent";
import { initializeStores } from "../store/initializeStores";
import { useStore } from "../store/useStore";

initializeStores();

const createPageSection = ({ children, ...pageSection }) => ({
  ...pageSection,
  children,
});

const getObservedSections = (pageSections) =>
  pageSections.map(({ id, reference }) => ({
    id,
    reference,
  }));

const getSectionOffsets = (sections) => ({
  top: 0,
  ...Object.fromEntries(
    sections.map(({ id, reference }) => [ id, reference.current?.offsetTop ?? 0 ]),
  ),
});

const observeSectionOffsets = ({ dispatch, sections }) => {
  const updateOffsets = () => {
    dispatch("SET_REFS", getSectionOffsets(sections));
  };

  updateOffsets();
  window.addEventListener("resize", updateOffsets);

  if (typeof ResizeObserver === "undefined") {
    return () => {
      window.removeEventListener("resize", updateOffsets);
    };
  }

  const resizeObserver = new ResizeObserver(updateOffsets);

  sections
    .map(({ reference }) => reference.current)
    .filter(Boolean)
    .forEach((sectionElement) => {
      resizeObserver.observe(sectionElement);
    });

  return () => {
    window.removeEventListener("resize", updateOffsets);
    resizeObserver.disconnect();
  };
};

const renderPageSection = ({
  children,
  className,
  id,
  reference,
  sectionElementId,
}) => (
  <div className={className} id={sectionElementId} key={id} ref={reference}>
    {children}
  </div>
);

export default function App() {
  const cardsReference = useRef(null);
  const chronologyReference = useRef(null);
  const featuresReference = useRef(null);
  const ongoingReference = useRef(null);
  const [, dispatch] = useStore(false);
  const pageSections = [
    createPageSection({
      children: (
        <>
          <TrustSignals />
          <ParallaxTitle title={getSectionTitle("cards")} />
          <QualificationContainer />
        </>
      ),
      className: "normalizedBackground normalizedBackgroundToWhite",
      id: "cards",
      reference: cardsReference,
      sectionElementId: getSiteSection("cards")?.elementId,
    }),
    createPageSection({
      children: (
        <>
          <ParallaxTitle title={getSectionTitle("chronology")} />
          <CareerChronology />
        </>
      ),
      className: "normalizedBackgroundWhite",
      id: "chronology",
      reference: chronologyReference,
      sectionElementId: getSiteSection("chronology")?.elementId,
    }),
    createPageSection({
      children: (
        <>
          <ParallaxTitle title={getSectionTitle("features")} />
          <Projects />
        </>
      ),
      className: "normalizedBackgroundWhite",
      id: "features",
      reference: featuresReference,
      sectionElementId: getSiteSection("features")?.elementId,
    }),
    createPageSection({
      children: (
        <>
          <ParallaxTitle title={getSectionTitle("ongoing")} />
          <RoleFitSection />
        </>
      ),
      className: "normalizedBackgroundWhite roleFitLabSection",
      id: "ongoing",
      reference: ongoingReference,
      sectionElementId: getSiteSection("ongoing")?.elementId,
    }),
  ];

  useEffect(() => {
    return observeSectionOffsets({
      dispatch,
      sections: getObservedSections(pageSections),
    });
  }, [dispatch]);

  return (
    <>
      <NavigationObserver />
      <DotNavigation />
      <Header />
      {pageSections.map(renderPageSection)}
      <Footer />
    </>
  );
}
