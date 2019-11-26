import React, { Fragment, useEffect } from 'react';
import TagManager from 'react-gtm-module';

const gtmScript = (props) => {
  useEffect(() => {
    if (window.location.href.match(/vizzmd.com/)) {
      const tagManagerArgs = {
        gtmId: 'GTM-TRVFXQP'
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
