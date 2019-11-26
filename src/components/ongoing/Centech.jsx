import React, { Fragment } from 'react';

const centech = () => {
  return (
    <Fragment>
      <hr className="ongoingSeparator" />
      <div className="makeItFlex ongoingRow">
        <img className="onGoingImage" src="/static/images/centech.jpg" alt="Centech Logo" width="300" />
        <p className="cardText ongoingText"><strong className="blueTitle">> Les moyens de réussir:</strong> en septembre 2019 le projet est sélectionné dans la cohorte MedTech du Centech, un programme qui vise à transformer des idées en produit avec une équipe dédiée à son développement.
        </p>
      </div>
    </Fragment>
  );
};
export default centech;
