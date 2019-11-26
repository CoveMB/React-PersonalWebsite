import React, { Fragment } from 'react';
import Plx from 'react-plx';

import { parallaxDataPaper, parallaxDataMockup } from '../../parallaxEffects/parallaxEffects';

const features = () => {
  return (
    <Fragment>
      <div className="numerisationImg scrollbarycustom">
        <Plx
          parallaxData={parallaxDataPaper}
          className="paperImg"
        >
          <img className="asiaImg" src="/static/images/paperWork.png" alt="Paper for spinal cord injuries" />
        </Plx>
        <Plx
          parallaxData={parallaxDataMockup}
          className="mockupPlx"
        >
          <img className="mockupImg" src="/static/images/VizzMDMockup.png" alt="VizzMD Mockup" width="300" />
        </Plx>
      </div>
      <h3 className="numerisationText">La numérisation permet de conserver l’intégrité des données confrontée à l’usure du temps, à rendre l’accès des dossiers plus facile et rapide.</h3>
    </Fragment>
  );
};
export default features;
