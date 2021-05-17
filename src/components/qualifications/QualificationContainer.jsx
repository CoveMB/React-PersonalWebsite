import React from 'react';
import Qualification from './Qualification';

const qualificationContainer = () => {

  const cardTitle = (topic) => {

    switch (topic) {

      case 'learning':
        return (
          <h2 className="cardTitle">
            Always
            <br />
            Learning
          </h2>
        );
      case 'polyvalent':
        return (
          <h2 className="cardTitle">
            Polyvalent
            <br />
            Abilities
          </h2>
        );
      case 'lead':
        return (
          <h2 className="cardTitle">
            Team
            <br />
            Focused
          </h2>
        );
      default:
        return null;

    }

  };

  return (
    <>
      <div className="cardBox makeItFlex flexColumnMobile">
        <Qualification topic="learning" cardTitle={cardTitle} />
        <Qualification topic="polyvalent" cardTitle={cardTitle} />
        <Qualification topic="lead" cardTitle={cardTitle} />
      </div>
    </>
  );

};

export default qualificationContainer;
