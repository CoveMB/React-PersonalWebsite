import { initStore } from './useStore';

const configureRefStore = () => {
  const actions = {
    SET_REFS: (currentState, refsOffsets) => {
      return { refsOffsets };
    },
    GO_TO_REF: (currentState, goToElement) => {
      switch (goToElement) {
        case "top":
          window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
          break;
        case "cards":
          window.scrollTo({ left: 0, top: currentState.refsOffsets.cards - 30, behavior: 'smooth' });
          break;
        case "features":
          window.scrollTo({ left: 0, top: currentState.refsOffsets.features - 30, behavior: 'smooth' });
          break;
        case "ongoing":
          window.scrollTo({ left: 0, top: currentState.refsOffsets.ongoing - 30, behavior: 'smooth' });
          break;
        default:
          break;
      }
    }
  };
  initStore(actions, {});
};

export default configureRefStore;
