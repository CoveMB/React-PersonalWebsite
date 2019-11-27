import React from 'react';
import Plx from 'react-plx';
import Avatar from './Avatar';
import HeaderCardContent from './HeaderCardContent';

import { parallaxDataHeader } from '../../parallaxEffects/parallaxEffects';

const headerCard = () => {
  return (
    <Plx
      className="parallaxTitle"
      parallaxData={parallaxDataHeader}
    >
      <div
        className="header-card scrollbarxcustom animated fadeIn"
      >
        <div className="gradient-square-avatar">
          <Avatar />
        </div>
        <HeaderCardContent />
      </div>
    </Plx>
  );
};

export default headerCard;
