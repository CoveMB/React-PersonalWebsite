import React from 'react';
import Plx from 'react-plx';

import { parallaxDataProjectImageRight, parallaxDataProjectImageLeft, parallaxDataProjectImageEyesRight } from '../../parallaxEffects/parallaxEffects';

export default function ProjectImage({
  side, projectName, projectImage, hrefSource
}) {

  const getParallaxEffect = (specific) => {

    if (specific === 'toolyEyes') {

      return parallaxDataProjectImageEyesRight;

    }

    switch (side) {

      case 'right':
        return parallaxDataProjectImageRight;
      case 'left':
        return parallaxDataProjectImageLeft;
      default:
        return null;

    }

  };

  return (
    <>
      <Plx
        className={`parallaxImage${projectName}`}
        parallaxData={getParallaxEffect()}
      >
        <a
          href={hrefSource}
          target="_blank"
          rel="noreferrer"
        >
          <img
            className={`projectImage${side} projectImage${projectName}`}
            src={projectImage}
            alt={`${projectName} logo`}
            width="90px"
          />
        </a>
      </Plx>
      { projectName === 'tooly'
      && (
        <Plx
          className={`parallaxImage${projectName}`}
          parallaxData={getParallaxEffect('toolyEyes')}
        >
          <a
            href={hrefSource}
            target="_blank"
            rel="noreferrer"
          >
            <img
              className={`projectImage${side} projectImage${projectName}`}
              src={`${projectImage.replace('.svg', 'Eyes.svg')}`}
              alt={`${projectName} logo`}
              width="90px"
            />
          </a>
        </Plx>
      )}
    </>
  );

}
