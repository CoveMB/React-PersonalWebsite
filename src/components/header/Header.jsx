import React, { Fragment } from 'react';
import Plx from 'react-plx';
import HeaderCard from './HeaderCard';
import HeaderWave from './HeaderWave';

const parallaxData = [
  {
    start: 300,
    duration: 450,
    easing: "linear",
    properties: [
      {
        startValue: 1,
        endValue: 0,
        property: 'opacity',
      },
    ],
  },
];

const parallaxDataCard = [
  {
    start: 0,
    duration: 600,
    easing: "linear",
    properties: [
      {
        startValue: 0,
        endValue: -800,
        property: 'translateY',
      },
    ],
  },
];

const header = () => {
  return (
    <Fragment>
      <Plx
        className="stickyHeader"
        parallaxData={parallaxData}
      >
        <div
          className="header-background"
        />
      </Plx>
      <Plx
        className=""
        parallaxData={parallaxDataCard}
      >
        <HeaderCard />
      </Plx>
      <HeaderWave />
    </Fragment>

  );
};

export default header;
