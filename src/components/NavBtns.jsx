import { useEffect } from "react";
import { useStore } from "../store/useStore";

const navigationButtons = [
  {
    ariaLabel: "Go to top section",
    id: "top",
    label: "Top",
  },
  {
    ariaLabel: "Go to peculiarities section",
    id: "cards",
    label: "Peculiarities",
  },
  {
    ariaLabel: "Go to projects section",
    id: "features",
    label: "Projects",
  },
  {
    ariaLabel: "Go to email section",
    id: "ongoing",
    label: "Contact",
  },
];

const sectionViewportRatio = 0.4;

const getCurrentSection = ({ currentPosition, refsOffsets, viewportHeight }) => {
  if (!refsOffsets) {
    return "top";
  }

  const viewportCheckpoint = currentPosition + viewportHeight * sectionViewportRatio;

  return navigationButtons.reduce((currentSection, { id }) => {
    const sectionOffset = refsOffsets[id] ?? 0;

    if (viewportCheckpoint >= sectionOffset) {
      return id;
    }

    return currentSection;
  }, "top");
};

export default function NavBtns() {
  const [ state, dispatch ] = useStore();

  useEffect(() => {
    const updatePosition = () => {
      const nextPosition = getCurrentSection({
        currentPosition: window.scrollY,
        refsOffsets: state.refsOffsets,
        viewportHeight: window.innerHeight,
      });

      if (state.position !== nextPosition) {
        dispatch("SET_POSITION", nextPosition);
      }
    };

    window.addEventListener("scroll", updatePosition);
    updatePosition();

    return () => {
      window.removeEventListener("scroll", updatePosition);
    };
  }, [ dispatch, state.position, state.refsOffsets ]);

  const getNavButtonClasses = (navButton) => {
    if (navButton === state.position) {
      return `NavBtn activateBtn NavBtn${navButton}`;
    }

    return `NavBtn NavBtn${navButton}`;
  };

  return (
    <>
      {navigationButtons.map(({ ariaLabel, id, label }) => (
        <button
          aria-current={id === state.position ? "location" : undefined}
          aria-label={ariaLabel}
          className={getNavButtonClasses(id)}
          key={id}
          onClick={() => dispatch("GO_TO_REF", id)}
          type="button"
        >
          <span className="NavBtnLabel">{label}</span>
          <span aria-hidden="true" className="NavBtnDot" />
        </button>
      ))}
    </>
  );
}
