import { useSyncExternalStore } from "react";

let actions = {};
let globalState = {};
let listeners = [];

const emitChange = () => {
  listeners.forEach((listener) => {
    listener();
  });
};

const subscribe = (listener) => {
  listeners = [ ...listeners, listener ];

  return () => {
    listeners = listeners.filter((registeredListener) => registeredListener !== listener);
  };
};

const getSnapshot = () => globalState;

const dispatch = (actionIdentifier, payload) => {
  const action = actions[actionIdentifier];

  if (!action) {
    return;
  }

  const nextState = action(globalState, payload);

  if (nextState && typeof nextState === "object") {
    globalState = {
      ...globalState,
      ...nextState,
    };
  }

  emitChange();
};

export const useStore = (shouldListen = true) => {
  const snapshot = useSyncExternalStore(
    shouldListen ? subscribe : () => () => {},
    getSnapshot,
    getSnapshot
  );

  return [ snapshot, dispatch ];
};

export const initStore = (userActions, initialState) => {
  if (initialState) {
    globalState = {
      ...globalState,
      ...initialState,
    };
  }

  actions = {
    ...actions,
    ...userActions,
  };
};
