import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataProjectLeft, parallaxDataProjectRight } from "../../parallaxEffects/parallaxEffects";
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

const projectDetailsByName = {
  airflow: {
    githubRepository: "https://github.com/CoveMB/Python-AirflowReportPipeline",
    image: "/static/images/airflow.png",
    text: airflowProjectText,
    website: "https://github.com/CoveMB/Python-AirflowReportPipeline",
  },
  aldo: {
    image: "/static/images/aldo.png",
    text: aldoProjectText,
    website: "https://www.aldogroup.com/",
  },
  astroLight: {
    githubRepository: "https://github.com/CoveMB/solidity-DEFI-DAO",
    image: "/static/images/astroLight.svg",
    text: astroLightProjectText,
    website: "https://astro-light.on.fleek.co/",
  },
  centech: {
    githubRepository: "https://github.com/CoveMB/Rails-React-VizzMD-App",
    image: "/static/images/centech.png",
    text: centechProjectText,
    website: "https://react-rails-vizzmd-mvp.herokuapp.com",
  },
  cominity: {
    image: "/static/images/cominity.png",
    text: cominityProjectText,
    website: "https://cominity.ca/",
  },
  defender: {
    image: "/static/images/defender.png",
    text: defenderProjectText,
    website: "https://docs.openzeppelin.com/defender",
  },
  leWagon: {
    image: "/static/images/leWagon.png",
    text: leWagonProjectText,
    website: "https://www.lewagon.com/",
  },
  shareIn: {
    githubRepository: "https://github.com/CoveMB/Rails-Share-in-App",
    image: "/static/images/shareIn.png",
    text: shareInProjectText,
    website: "https://ruby-share-in-app.herokuapp.com/",
  },
  spockee: {
    image: "/static/images/spockee.svg",
    text: spockeeProjectText,
    website: "https://skeepers.io/en/live-shopping/",
  },
  suiTooling: {
    githubRepository: "https://github.com/OpenZeppelin/openzeppelin-sui-marketplace",
    image: "/static/images/suiTooling.svg",
    text: suiToolingProjectText,
    website: "https://www.sui.io/",
  },
  tooly: {
    image: "/static/images/tooly.png",
    text: toolyProjectText,
    website: "https://www.nextcanada.com/next-ai/",
  },
};

const parallaxDataBySide = {
  left: parallaxDataProjectLeft,
  right: parallaxDataProjectRight,
};

const renderProjectBody = ({ details, projectName, side }) => {
  const projectImage = (
    <div className="project-image-n-details">
      <ProjectImage hrefSource={details.website} projectImage={details.image} projectName={projectName} side={side} />
      {details.githubRepository ? <ProjectGitLink hrefSource={details.githubRepository} side={side} /> : null}
    </div>
  );

  if (side === "left") {
    return (
      <div className="makeItFlex ongoingRow">
        {projectImage}
        {details.text}
      </div>
    );
  }

  return (
    <div className="makeItFlex ongoingRow">
      {details.text}
      {projectImage}
    </div>
  );
};

export default function Project({ projectName, side }) {
  const projectDetails = projectDetailsByName[projectName];

  if (!projectDetails) {
    return null;
  }

  return (
    <ScrollParallax className="parallaxTitle" parallaxData={parallaxDataBySide[side]}>
      <>
        <hr className="ongoingSeparator" />
        {renderProjectBody({ details: projectDetails, projectName, side })}
      </>
    </ScrollParallax>
  );
}
