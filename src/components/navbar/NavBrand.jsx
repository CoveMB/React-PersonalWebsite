import React from 'react';
import { useStore } from '../../store/useStore';

const navBrand = () => {
  const dispatch = useStore()[1];

  return (
    <button className="normalizeBtn" onClick={() => { dispatch("GO_TO_REF", "top"); }}><img className="navBrand" src="/static/images/avatar.jpg" alt="avatar logo" height="52" width="52" /></button>
  );
};

export default navBrand;
