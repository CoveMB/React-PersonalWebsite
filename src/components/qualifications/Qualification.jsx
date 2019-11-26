import React from 'react';
import Plx from 'react-plx';

import { parallaxDataLN, parallaxDataPO, parallaxDataAN } from '../../parallaxEffects/parallaxEffects';

const qualification = (props) => {
  const getParallaxData = (topic) => {
    switch (topic) {
      case "learning":
        return parallaxDataLN;
      case "polyvalent":
        return parallaxDataPO;
      case "analytical":
        return parallaxDataAN;
      default:
        return parallaxDataLN;
    }
  };

  const cardText = () => {
    switch (props.topic) {
      case "learning":
        return (
          <p className="cardText">
            A great capacity for adaptation and a passion for learning. Will learn how to do anything that need to be done or to be improve, automating what can be along the way. Like to research and propose <strong className="blueTitle">new and inovative solutions to challenging problems</strong>
          </p>
        );
      case "polyvalent":
        return (
          <p className="cardText">
            Different experiences that develloped a faculty to take charge of polyvalent missions, with an holistic point of view. Can prioritise and optimise work across many projects and deliver within time constraints.<strong className="blueTitle">To make plans in order to achieve defined goals.</strong>
          </p>);
      case "analytical":
        return (
          <p className="cardText">
            A critical analytical thinking developed through both my education in human and social sciences, in qualitative and quantitative research and also my programming experience. Which <strong className="blueTitle">allows me the analysis and understanding of data</strong> to take better decisions.
          </p>
        );
      default:
        return null;
    }
  };
  return (
    <div
      className={props.topic === "analytical" ? "topic topicNoBorder mobilepaddingNone" : "topic"}
    >
      <Plx
        parallaxData={getParallaxData(props.topic)}
      >
        <div className="cardTitleBlock">
          <img className="svgCard" src={`/static/images/svg${props.topic}.svg`} alt={`svg ${props.topic}`} />
          {props.cardTitle(props.topic)}
        </div>
        <div className="cardMobileTextLayout">

          {cardText()}
        </div>
      </Plx>
    </div>
  );
};

export default qualification;
