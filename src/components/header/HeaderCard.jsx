import React from 'react';
import Plx from 'react-plx';
import BrandWhite from './Avatar';
import HeaderCardContent from './HeaderCardContent';


const parallaxData = [
  {
    start: "self",
    duration: 600,
    easing: "easeIn",
    properties: [
      {
        startValue: 0,
        endValue: 8,
        property: 'translateX',
      },
    ],
  },
];

const headerCard = () => {
  return (
    <Plx
      className="parallaxTitle"
      parallaxData={parallaxData}
    >
      <div
        className="header-card scrollbarxcustom"
      >
        <div className="gradient-square-avatar">
          <BrandWhite />
        </div>
        <HeaderCardContent />
      </div>
    </Plx>
  );
};

export default headerCard;
