import React from 'react';
import Plx from 'react-plx';

import { parallaxDataLN, parallaxDataPO, parallaxDataAN } from '../../parallaxEffects/parallaxEffects';

const qualification = (props) => {

  const getParallaxData = (topic) => {

    switch (topic) {

      case 'learning':
        return parallaxDataLN;
      case 'polyvalent':
        return parallaxDataPO;
      case 'analytical':
        return parallaxDataAN;
      default:
        return parallaxDataLN;

    }

  };

  const cardText = () => {

    switch (props.topic) {

      case 'learning':
        return (
          <p className="cardText">
            I Have a great capacity for adaptation and a passion for learning. I will learn how to do anything that I need to do or to be improved, automating what can be along the way. I like to research and propose
            {' '}
            <strong className="blueTitle">new and innovative solutions to challenging problems</strong>
          </p>
        );
      case 'polyvalent':
        return (
          <p className="cardText">
            My different experiences helped me acquire multiple skills, allowing me to take charge of polyvalent missions, with a holistic point of view. I can prioritize and optimise work across many scopes of a project and deliver within time constraints.
            <strong className="blueTitle"> I make plans in order to achieve defined goals.</strong>
          </p>
        );
      case 'analytical':
        return (
          <p className="cardText">
            I developed a critical analytical thinking through my education in human and social sciences, in qualitative and quantitative research. That my programming experience reinforced. Which
            {' '}
            <strong className="blueTitle">allows me the analysis and understanding of data</strong>
            {' '}
            to make better decisions.
          </p>
        );
      default:
        return null;

    }

  };

  return (
    <div
      className={props.topic === 'analytical' ? 'topic topicNoBorder mobilepaddingNone' : 'topic'}
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
