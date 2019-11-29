import React, { Fragment } from 'react';
import Qualification from './Qualification';

const qualificationContainer = () => {
  const cardTitle = (topic) => {
    switch (topic) {
      case "learning":
        return (<h2 className="cardTitle">Always
          <br />Learning</h2>);
      case "polyvalent":
        return (<h2 className="cardTitle">Polyvalent
          <br />Abilities</h2>);
      case "analytical":
        return (<h2 className="cardTitle">Analytical
          <br />Thinking</h2>);
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
