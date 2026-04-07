import { useEffect } from "react";
import { useStore } from "../store/useStore";

const getCurrentSection = ({ currentPosition, refsOffsets }) => {
  if (!refsOffsets) {
    return "top";
  }

  if (currentPosition > refsOffsets.ongoing - 400) {
    return "ongoing";
  }

  if (currentPosition > refsOffsets.features - 400) {
    return "features";
  }

  if (currentPosition > refsOffsets.cards - 400) {
    return "cards";
  }

  return "top";
};

export default function NavBtns() {
  const [ state, dispatch ] = useStore();

  useEffect(() => {
    const updatePosition = () => {
      const nextPosition = getCurrentSection({
        currentPosition: window.scrollY,
        refsOffsets: state.refsOffsets,
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
      <button aria-label="Go to top section" className={getNavButtonClasses("top")} onClick={() => dispatch("GO_TO_REF", "top")} type="button" />
      <button aria-label="Go to peculiarities section" className={getNavButtonClasses("cards")} onClick={() => dispatch("GO_TO_REF", "cards")} type="button" />
      <button aria-label="Go to projects section" className={getNavButtonClasses("features")} onClick={() => dispatch("GO_TO_REF", "features")} type="button" />
      <button aria-label="Go to email section" className={getNavButtonClasses("ongoing")} onClick={() => dispatch("GO_TO_REF", "ongoing")} type="button" />
    </>
  );
}
