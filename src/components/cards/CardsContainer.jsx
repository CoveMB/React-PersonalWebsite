import React, { Fragment } from 'react';
import Card from './Card';

const cardsContainer = () => {
  const cardTitle = (topic) => {
    switch (topic) {
      case "personalised":
        return <h2 className="cardTitle">Thérapie Personalisée</h2>;
      case "engagement":
        return <h2 className="cardTitle">Engagement Patient</h2>;
      case "mesure":
        return <h2 className="cardTitle">Mesure de résultats</h2>;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="cardBox makeItFlex flexColumnMobile">
        <Card topic="personalised" cardTitle={cardTitle} />
        <Card topic="engagement" cardTitle={cardTitle} />
        <Card topic="mesure" cardTitle={cardTitle} />
      </div>
    </Fragment>
  );
};

export default cardsContainer;
