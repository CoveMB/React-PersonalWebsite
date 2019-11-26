import React from 'react';

import App from '../src/components/App';

import configureRefStore from '../src/store/refStore';
import configurePositionStore from '../src/store/positionStore';

configureRefStore();
configurePositionStore();

const rootPage = () => {
  return (
    <App />
  );
};

export default rootPage;
