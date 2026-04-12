import { initStore } from "./useStore";
import { getScrollTargetOffset } from "../navigation/navigationModel";
import { getPreferredScrollBehavior } from "../utils/motionPreference";

const scrollToOffset = (offset) => {
  window.scrollTo({
    behavior: getPreferredScrollBehavior(),
    left: 0,
    top: offset,
  });
};

const configureRefStore = () => {
  initStore(
    {
      GO_TO_REF: (currentState, sectionName) => {
        scrollToOffset(
          getScrollTargetOffset({
            refsOffsets: currentState.refsOffsets,
            sectionName,
          }),
        );
      },
      SET_REFS: (currentState, refsOffsets) => ({ refsOffsets }),
    },
    {}
  );
};

export default configureRefStore;
