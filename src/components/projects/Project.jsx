import React from "react";
import Plx from "react-plx";
import {
  parallaxDataProjectLeft,
  parallaxDataProjectRight,
} from "../../parallaxEffects/parallaxEffects";
import ProjectGitLink from "./ProjectGitLink";
import ProjectImage from "./ProjectImage";
import {
  airflowProjectText,
  aldoProjectText,
  astroLightProjectText,
  centechProjectText,
  cominityProjectText,
  defenderProjectText,
  leWagonProjectText,
  shareInProjectText,
  spockeeProjectText,
  suiToolingProjectText,
  toolyProjectText,
} from "./projectText";

const project = ({ projectName, side }) => {
  const projectNames = {
    suiTooling: "suiTooling",
    defender: "defender",
    astroLight: "astroLight",
    aldo: "aldo",
    spockee: "spockee",
    tooly: "tooly",
    leWagon: "leWagon",
    centech: "centech",
    shareIn: "shareIn",
    airflow: "airflow",
    cominity: "cominity",
  };

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
      case projectNames.suiTooling:
        return suiToolingProjectText;
      case projectNames.defender:
        return defenderProjectText;
      case projectNames.astroLight:
        return astroLightProjectText;
      case projectNames.aldo:
        return aldoProjectText;
      case projectNames.spockee:
        return spockeeProjectText;
      case projectNames.tooly:
        return toolyProjectText;
      case projectNames.cominity:
        return cominityProjectText;
      case projectNames.centech:
        return centechProjectText;
      case projectNames.leWagon:
        return leWagonProjectText;
      case projectNames.shareIn:
        return shareInProjectText;
      case projectNames.airflow:
        return airflowProjectText;
      default:
        return null;
    }
  };

  const getProjectImage = () => {
    switch (projectName) {
      case projectNames.suiTooling:
        return `/static/images/${projectName}.svg`;
      case projectNames.defender:
        return `/static/images/${projectName}.png`;
      case projectNames.astroLight:
        return `/static/images/${projectName}.svg`;
      case projectNames.aldo:
        return `/static/images/${projectName}.png`;
      case projectNames.spockee:
        return `/static/images/${projectName}.svg`;
      case projectNames.tooly:
        return `/static/images/${projectName}.png`;
      case projectNames.cominity:
        return `/static/images/${projectName}.png`;
      case projectNames.centech:
        return `/static/images/${projectName}.png`;
      case projectNames.leWagon:
        return `/static/images/${projectName}.png`;
      case projectNames.shareIn:
        return `/static/images/${projectName}.png`;
      case projectNames.airflow:
        return `/static/images/${projectName}.png`;
      default:
        return null;
    }
  };

  const getGithubRepo = () => {
    switch (projectName) {
      case projectNames.suiTooling:
        return "https://github.com/OpenZeppelin/openzeppelin-sui-marketplace";
      case projectNames.astroLight:
        return "https://github.com/CoveMB/solidity-DEFI-DAO";
      case projectNames.airflow:
        return "https://github.com/CoveMB/Python-AirflowReportPipeline";
      case projectNames.shareIn:
        return "https://github.com/CoveMB/Rails-Share-in-App";
      case projectNames.centech:
        return "https://github.com/CoveMB/Rails-React-VizzMD-App";
      default:
        return null;
    }
  };

  const getWebsite = () => {
    switch (projectName) {
      case projectNames.defender:
        return "https://docs.openzeppelin.com/defender";
      case projectNames.suiTooling:
        return "https://www.sui.io/";
      case projectNames.astroLight:
        return "https://astro-light.on.fleek.co/";
      case projectNames.aldo:
        return "https://www.aldogroup.com/";
      case projectNames.spockee:
        return "https://skeepers.io/en/live-shopping/";
      case projectNames.tooly:
        return "https://www.nextcanada.com/next-ai/";
      case projectNames.cominity:
        return "https://cominity.ca/";
      case projectNames.centech:
        return "https://react-rails-vizzmd-mvp.herokuapp.com";
      case projectNames.leWagon:
        return "https://www.lewagon.com/";
      case projectNames.shareIn:
        return "https://ruby-share-in-app.herokuapp.com/";
      case projectNames.airflow:
        return "https://github.com/CoveMB/Python-AirflowReportPipeline";
      default:
        return null;
    }
  };

  const getSide = () => {
    if (side === "left") {
      return (
        <div className="makeItFlex ongoingRow">
          <div className="project-image-n-details">
            <ProjectImage
              hrefSource={getWebsite()}
              projectImage={getProjectImage()}
              side={side}
              projectName={projectName}
            />
            {getGithubRepo() && (
              <ProjectGitLink
                hrefSource={getGithubRepo()}
                side={side}
                projectName={projectName}
              />
            )}
          </div>
          {getProjectText()}
        </div>
      );
    }

    return (
      <div className="makeItFlex ongoingRow">
        {getProjectText()}
        <div className="project-image-n-details">
          <ProjectImage
            hrefSource={getWebsite()}
            projectImage={getProjectImage()}
            side={side}
            projectName={projectName}
          />
          {getGithubRepo() && (
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
    <Plx className="parallaxTitle" parallaxData={getParallaxData()}>
      <>
        <hr className="ongoingSeparator" />
        {getSide()}
      </>
    </Plx>
  );
};

export default project;
