import React, { Fragment, useEffect } from 'react';
import TagManager from 'react-gtm-module';

const gtmScript = (props) => {
  useEffect(() => {
    if (window.location.href.match(/benjaminmarquis.ia/)) {
      const tagManagerArgs = {
        gtmId: 'GTM-PJVMQR7'
      };
      TagManager.initialize(tagManagerArgs);
    }
  }, []);


  return (
    <Fragment>
      {props.children}
    </Fragment>
  );
};

export default gtmScript;
