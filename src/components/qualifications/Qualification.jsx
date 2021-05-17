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
            There is always something new to learn, and it motivates me. I developed a great capacity for adaptation and a passion for discovering new topics in various domains. Spreading this learning with others on the way. I like to research and propose
            {' '}
            <strong className="blueTitle">new and innovative solutions to challenging problems</strong>
            .
          </p>
        );
      case 'polyvalent':
        return (
          <p className="cardText">
            Different experiences and learnings helped me acquire multiple skills from back-end to front-end or DevOps. Allowing me to take charge of polyvalent missions, with a holistic point of view. I can prioritize and optimise work
            {' '}
            <strong className="blueTitle">across different scopes of a project </strong>
            {' '}
            and deliver within time constraints.
          </p>
        );
      case 'lead':
        return (
          <p className="cardText">
            The core of every project is the team that is responsible for it. As a lead developer and a scrum master, I have learned to orient individuals and spread knowledge to
            {' '}
            <strong className="blueTitle">empower the team and strengthen its effectiveness </strong>
            {' '}
            supporting the project&apos;s goals for continuous improvement.
          </p>
        );
      default:
        return null;

    }

  };

  return (
    <div
      className={props.topic === 'learning' ? 'topic topicNoBorder mobilepaddingNone' : 'topic'}
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
