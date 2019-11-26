import React, { Fragment } from 'react';
import Qualification from './Qualification';

const qualificationContainer = () => {
  const cardTitle = (topic) => {
    switch (topic) {
      case "learning":
        return <h2 className="cardTitle">Allways Learning</h2>;
      case "polyvalent":
        return <h2 className="cardTitle">Polyvalent Abilities</h2>;
      case "analytical":
        return <h2 className="cardTitle">Analytical Thinking</h2>;
      default:
        return null;
    }
  };

  return (
    <Fragment>
      <div className="cardBox makeItFlex flexColumnMobile">
        <Qualification topic="learning" cardTitle={cardTitle} />
        <Qualification topic="polyvalent" cardTitle={cardTitle} />
        <Qualification topic="analytical" cardTitle={cardTitle} />
      </div>
    </Fragment>
  );
};

export default qualificationContainer;
