import React from 'react';
import Plx from 'react-plx';

import { parallaxDataProjectGitLinkRight, parallaxDataProjectGitLinkLeft } from '../../parallaxEffects/parallaxEffects';

export default function ProjectGitLink({
  side, projectName, hrefSource
}) {

  const getParallaxEffect = () => {

    switch (side) {

      case 'right':
        return parallaxDataProjectGitLinkRight;
      case 'left':
        return parallaxDataProjectGitLinkLeft;
      default:
        return null;

    }

  };

  return (
    <Plx
      className={`projectBtnPosition${side}`}
      parallaxData={getParallaxEffect()}
    >
      <a
        href={hrefSource}
        target="_blank"
        rel="noreferrer"
      >
        <img
          className="projectRepoBtn"
          src="/static/images/github.svg"
          alt="Github Icon"
        />
      </a>
    </Plx>
  );

}
