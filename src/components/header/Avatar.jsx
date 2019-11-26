import React from 'react';
import logo from '../../../public/static/images/avatar.jpg';

const avatar = () => {
  return (
    <div className="brand">
      <img className="header-card-avatar" src={logo} alt="VizzMD logo" />
    </div>
  );
};

export default avatar;
