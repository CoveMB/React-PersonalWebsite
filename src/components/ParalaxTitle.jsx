import React from 'react';
import Plx from 'react-plx';

import { parallaxDataTitle } from '../parallaxEffects/parallaxEffects';

const paralaxTitle = (props) => {
  return (
    <Plx
      className="parallaxTitle"
      parallaxData={parallaxDataTitle}
    >
      <h2 className="sectionTitle" id={props.idElement}>{props.title}</h2>
    </Plx>
  );
};

export default paralaxTitle;
