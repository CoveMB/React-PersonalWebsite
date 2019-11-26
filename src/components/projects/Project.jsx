import React, { Fragment } from 'react';
import Plx from 'react-plx';

import { airflowProjectText, shareInProjectText, centechProjectText } from './projectText';

import { parallaxDataProjectLeft, parallaxDataProjectRight } from '../../parallaxEffects/parallaxEffects';

const project = (props) => {
  const { projectName, side } = props;

  const getParallaxData = () => {
    switch (side) {
      case "left":
        return parallaxDataProjectLeft;
      case "right":
        return parallaxDataProjectRight;
      default:
        return null;
    }
  };

  const getProjectText = () => {
    switch (projectName) {
      case "airflow":
        return airflowProjectText;
      case "shareIn":
        return shareInProjectText;
      case "centech":
        return centechProjectText;
      default:
        return null;
    }
  };

  const getGithubRepo = () => {
    switch (projectName) {
      case "airflow":
        return "https://github.com/BjMrq/Python-AirflowReportPipeline";
      case "shareIn":
        return "https://github.com/BjMrq/Rails-Share-in-App";
      case "centech":
        return "https://github.com/BjMrq/Rails-React-VizzMD-App";
      default:
        return null;
    }
  };

  const getWebsite = () => {
    switch (projectName) {
      case "airflow":
        return "https://github.com/BjMrq/Python-AirflowReportPipeline";
      case "shareIn":
        return "https://ruby-share-in-app.herokuapp.com/";
      case "centech":
        return "https://react-rails-vizzmd-mvp.herokuapp.com/p";
      default:
        return null;
    }
  };

  const getSide = () => {
    if (side === "left") {
      return (
        <div className="makeItFlex ongoingRow">
          <div className="project-image-n-details">
            <a href={getWebsite()} target="_blank"><img className={`projectImage${side}`} src={`/static/images/${projectName}.png`} alt={`${projectName} logo`} width="90px" /></a>
            <a className={`projectBtnPosition${side}`} href={getGithubRepo()} target="_blank"><img className="projectRepoBtn" src="/static/images/github.svg" alt="Github Icon" /></a>
          </div>
          { getProjectText() }
        </div>
      );
    }
    return (
      <div className="makeItFlex ongoingRow">
        { getProjectText() }
        <div className="project-image-n-details">
          <a href={getWebsite()} target="_blank"><img className={`projectImage${side}`} src={`/static/images/${projectName}.png`} alt={`${projectName} logo`} width="90px" /></a>
          <a className={`projectBtnPosition${side}`} href={getGithubRepo()} target="_blank"><img className="projectRepoBtn" src="/static/images/github.svg" alt="Github Icon" /></a>
        </div>
      </div>);
  };


  return (
    <Plx
      className="parallaxTitle"
      parallaxData={getParallaxData()}
    >
      <Fragment>
        <hr className="ongoingSeparator" />
        { getSide() }
      </Fragment>
    </Plx>
  );
};
export default project;
