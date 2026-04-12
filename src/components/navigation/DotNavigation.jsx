import { useEffect, useState } from "react";
import { navigationItems } from "../../navigation/navigationModel";
import { useStore } from "../../store/useStore";

const getNavigationButtonClassName = (isActive) =>
  isActive
    ? "sectionDotNavigationButton sectionDotNavigationButtonActive"
    : "sectionDotNavigationButton";

const getHeaderSectionElement = () => document.querySelector(".headerSection");

const hasHeaderScrolledPastViewport = (headerSectionElement) =>
  headerSectionElement?.getBoundingClientRect().bottom <= 0;

const renderNavigationItem = ({ ariaLabel, id, label }, dispatch, position) => {
  const isActive = id === position;

  return (
    <div className="sectionDotNavigationItem" key={id}>
      <span className="sectionDotNavigationLabel">{label}</span>
      <button
        aria-current={isActive ? "location" : undefined}
        aria-label={ariaLabel}
        className={getNavigationButtonClassName(isActive)}
        onClick={() => dispatch("GO_TO_REF", id)}
        type="button"
      />
    </div>
  );
};

export default function DotNavigation() {
  const [ state, dispatch ] = useStore();
  const [ isNavigationVisible, setIsNavigationVisible ] = useState(false);
  const navigationClassName = isNavigationVisible
    ? "sectionDotNavigation sectionDotNavigationVisible"
    : "sectionDotNavigation";

  useEffect(() => {
    const headerSectionElement = getHeaderSectionElement();

    if (!headerSectionElement) {
      setIsNavigationVisible(true);
      return undefined;
    }

    const updateNavigationVisibility = () => {
      setIsNavigationVisible(
        hasHeaderScrolledPastViewport(headerSectionElement),
      );
    };

    updateNavigationVisibility();

    if (typeof IntersectionObserver === "undefined") {
      window.addEventListener("scroll", updateNavigationVisibility, {
        passive: true,
      });
      window.addEventListener("resize", updateNavigationVisibility);

      return () => {
        window.removeEventListener("scroll", updateNavigationVisibility);
        window.removeEventListener("resize", updateNavigationVisibility);
      };
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setIsNavigationVisible(
          !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
        );
      },
      { threshold: 0 },
    );

    intersectionObserver.observe(headerSectionElement);

    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  return (
    <nav
      aria-hidden={!isNavigationVisible}
      aria-label="Section navigation"
      className={navigationClassName}
    >
      {navigationItems.map((navigationItem) =>
        renderNavigationItem(navigationItem, dispatch, state.position)
      )}
    </nav>
  );
}
