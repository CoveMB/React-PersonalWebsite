import { initStore } from './useStore';

const configurePositionStore = () => {
  const actions = {
    SET_POSITION: (currentState, newPosition) => {
      return { position: newPosition };
    }
  };
  initStore(actions, { position: "top" });
};

export default configurePositionStore;
