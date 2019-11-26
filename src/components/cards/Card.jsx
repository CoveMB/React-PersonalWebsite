import React from 'react';
import Plx from 'react-plx';

import { parallaxDataPT, parallaxDataPE, parallaxDataOM } from '../../parallaxEffects/parallaxEffects';

const card = (props) => {
  const getParallaxData = (topic) => {
    switch (topic) {
      case "personalised":
        return parallaxDataPT;
      case "engagement":
        return parallaxDataPE;
      case "mesure":
        return parallaxDataOM;
      default:
        return parallaxDataPT;
    }
  };

  const cardText = () => {
    switch (props.topic) {
      case "personalised":
        return (
          <p className="cardText">
              Personnaliser la thérapie a le potentiel d'assurer de meilleurs soins, adaptés aux patients avec une approche holistique et si nécessaire multidisciplinaire. elle permet aussi <strong className="blueTitle">d'améliorer les soins de santé tout en réduisant les coûts.</strong>
          </p>
        );
      case "engagement":
        return (
          <p className="cardText">
            L’engagement accru du patient dans ses soins de santé contribue à en améliorer les résultats. Les patients proactifs qui sont impliqués dans leurs traitements ont tendance à avoir une <strong className="blueTitle">progression plus rapide.</strong>
          </p>);
      case "mesure":
        return (
          <p className="cardText">
            Une meilleure mesure des résultats des traitements administrés permet de prendre des décisions plus éclairées sur les soins à attribuer aux patients. Ainsi que <strong className="blueTitle">d'établir un lien de confiance entre traitment et coût.</strong>
          </p>
        );
      default:
        return null;
    }
  };
  return (
    <div
      className={props.topic === "mesure" ? "topic topicNoBorder mobilepaddingNone" : "topic"}
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

export default card;
