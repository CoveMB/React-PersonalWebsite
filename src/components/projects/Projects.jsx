import React, { Fragment } from 'react';
import Plx from 'react-plx';

import { parallaxDataCentech, parallaxDataProjectRight } from '../../parallaxEffects/parallaxEffects';

import Project from './Project';
import Mvp from './Mvp';

const ongoing = (props) => {
  return (
    <Fragment>
      <p className="cardText ongoingIntro" id={props.idElement}><strong className="blueTitle">> Learn'n build:</strong> During my personal and profesianal path I encounter different challenges. Learning new skills to overcome them led me to build real projects, here are some of them.
      </p>
      <Project projectName="airflow" side="left" />
      <Project projectName="shareIn" side="right" />
      <Project projectName="centech" side="left" />
    </Fragment>
  );
};
export default ongoing;
