import React, { Fragment } from 'react';

const mvp = () => {
  return (
    <Fragment>
      <hr className="ongoingSeparator" />
      <div className="makeItFlex ongoingRow">
        <p className="cardText ongoingText"><strong className="blueTitle">> Un  produit minimal viable:</strong> a déjà été développé selon les spécificités de cas de myélite aigüe chez les enfants dont le nombre de cas est en augmentation à travers le monde ces dernières années. Aujourd’hui, le défi est de développer un produit standard qui puisse être utilisé par l’ensemble des médecins en réadaptation.
        </p>
        <img className="onGoingImage" src="/static/images/mvp.png" alt="MVP Mockup" width="200" />
      </div>
    </Fragment>
  );
};
export default mvp;
