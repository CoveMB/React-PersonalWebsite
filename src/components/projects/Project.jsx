import React from 'react';
import Plx from 'react-plx';
import { airflowProjectText, shareInProjectText, centechProjectText, toolyProjectText, leWagonProjectText, cominityProjectText } from './projectText';
import { parallaxDataProjectLeft, parallaxDataProjectRight } from '../../parallaxEffects/parallaxEffects';
import ProjectImage from './ProjectImage';
import ProjectGitLink from './ProjectGitLink';

const project = ({ projectName, side, projectNames }) => {

  const {
    tooly, leWagon, centech, shareIn, airflow, cominity
  } = projectNames;

  const getParallaxData = () => {

    switch (side) {

      case 'left':
        return parallaxDataProjectLeft;
      case 'right':
        return parallaxDataProjectRight;
      default:
        return null;

    }

  };

  const getProjectText = () => {

    switch (projectName) {

      case tooly:
        return toolyProjectText;
      case cominity:
        return cominityProjectText;
      case centech:
        return centechProjectText;
      case leWagon:
        return leWagonProjectText;
      case shareIn:
        return shareInProjectText;
      case airflow:
        return airflowProjectText;
      default:
        return null;

    }

  };

  const getProjectImage = () => {

    switch (projectName) {

      case tooly:
        return `/static/images/${projectName}.svg`;
      case cominity:
        return `/static/images/${projectName}.png`;
      case centech:
        return `/static/images/${projectName}.png`;
      case leWagon:
        return `/static/images/${projectName}.png`;
      case shareIn:
        return `/static/images/${projectName}.png`;
      case airflow:
        return `/static/images/${projectName}.png`;
      default:
        return null;

    }

  };

  const getGithubRepo = () => {

    switch (projectName) {

      case airflow:
        return 'https://github.com/BjMrq/Python-AirflowReportPipeline';
      case shareIn:
        return 'https://github.com/BjMrq/Rails-Share-in-App';
      case centech:
        return 'https://github.com/BjMrq/Rails-React-VizzMD-App';
      default:
        return null;

    }

  };

  const getWebsite = () => {

    switch (projectName) {

      case tooly:
        return 'https://tooly.ai/';
      case cominity:
        return 'https://cominity.ca/';
      case centech:
        return 'https://react-rails-vizzmd-mvp.herokuapp.com/p';
      case leWagon:
        return 'https://www.lewagon.com/';
      case shareIn:
        return 'https://ruby-share-in-app.herokuapp.com/';
      case airflow:
        return 'https://github.com/BjMrq/Python-AirflowReportPipeline';
      default:
        return null;

    }

  };

  const getSide = () => {

    if (side === 'left') {

      return (
        <div className="makeItFlex ongoingRow">
          <div className="project-image-n-details">
            <ProjectImage
              hrefSource={getWebsite()}
              projectImage={getProjectImage()}
              side={side}
              projectName={projectName}
            />
            {getGithubRepo()
            && (
              <ProjectGitLink
                hrefSource={getGithubRepo()}
                side={side}
                projectName={projectName}
              />
            )}
          </div>
          { getProjectText() }
        </div>
      );

    }

    return (
      <div className="makeItFlex ongoingRow">
        { getProjectText() }
        <div className="project-image-n-details">
          <ProjectImage
            hrefSource={getWebsite()}
            projectImage={getProjectImage()}
            side={side}
            projectName={projectName}
          />
          {getGithubRepo()
          && (
            <ProjectGitLink
              hrefSource={getGithubRepo()}
              side={side}
              projectName={projectName}
            />
          )}
        </div>
      </div>
    );

  };

  return (
    <Plx
      className="parallaxTitle"
      parallaxData={getParallaxData()}
    >
      <>
        <hr className="ongoingSeparator" />
        { getSide() }
      </>
    </Plx>
  );

};

export default project;
