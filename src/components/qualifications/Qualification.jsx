import React from 'react';
import Plx from 'react-plx';
import { parallaxDataAN, parallaxDataLN, parallaxDataPO } from '../../parallaxEffects/parallaxEffects';

const qualification = (props) => {

  const getParallaxData = (topic) => {

    switch (topic) {

      case 'learning':
        return parallaxDataLN;
      case 'polyvalent':
        return parallaxDataPO;
      case 'lead':
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
            My different experiences helped me acquire multiple skills from back-end to front-end or devops, allowing me to take charge of polyvalent missions, with a holistic point of view. I can prioritize and optimise work
            {' '}
            <strong className="blueTitle">across different scopes of a project </strong>
            {' '}
            and deliver within time constraints.
          </p>
        );
      case 'lead':
        return (
          <p className="cardText">
            I understand that a project can only go as far as the team can bring it. As a lead developer and a scrum master, I have learned to orient individuals and spread knowledge to
            {' '}
            <strong className="blueTitle">empower the team and strengthen its effectiveness</strong>
            {' '}
            for continuous improvement
            .
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
