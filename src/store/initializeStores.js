import configurePositionStore from "./positionStore";
import configureRefStore from "./refStore";

let storesAreInitialized = false;

export const initializeStores = () => {
  if (storesAreInitialized) {
    return;
  }

  configureRefStore();
  configurePositionStore();
  storesAreInitialized = true;
};
