import { initStore } from "./useStore";

const configurePositionStore = () => {
  initStore(
    {
      SET_POSITION: (currentState, newPosition) => ({ position: newPosition }),
    },
    { position: "top" }
  );
};

export default configurePositionStore;
