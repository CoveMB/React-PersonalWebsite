import React from 'react';
import Plx from 'react-plx';

import { parallaxDataOpacity } from '../../parallaxEffects/parallaxEffects';

const opacityParallax = (props) => {
  console.log(props.nextId);
  return (
    <Plx
      className={props.classNameElement}
      parallaxData={parallaxDataOpacity(props.nextId)}
    >
      {props.children}
    </Plx>
  );
};

export default opacityParallax;
