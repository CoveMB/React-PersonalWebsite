import { initStore } from "./useStore";

const scrollToOffset = (offset) => {
  window.scrollTo({
    behavior: "smooth",
    left: 0,
    top: offset,
  });
};

const getTargetOffset = (currentState, sectionName) => {
  const sectionOffsets = {
    cards: currentState.refsOffsets?.cards ?? 0,
    features: currentState.refsOffsets?.features ?? 0,
    ongoing: currentState.refsOffsets?.ongoing ?? 0,
    top: 0,
  };

  if (sectionName === "top") {
    return sectionOffsets.top;
  }

  return Math.max(sectionOffsets[sectionName] - 30, 0);
};

const configureRefStore = () => {
  initStore(
    {
      GO_TO_REF: (currentState, sectionName) => {
        scrollToOffset(getTargetOffset(currentState, sectionName));
      },
      SET_REFS: (currentState, refsOffsets) => ({ refsOffsets }),
    },
    {}
  );
};

export default configureRefStore;
