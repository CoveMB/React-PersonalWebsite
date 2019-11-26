import React, { Fragment } from 'react';
import HeaderForm from './HeaderForm';

const headerCardContent = () => {
  return (
    <Fragment>
      <h1 className="headerCardTitle">Visualisez l’efficacité de vos traitements afin de les rendre plus efficients.</h1>
      <div className="headerCardText">
        <h2 style={{ marginBottom: "20px" }}>
          Avec VizzMD, les données de santé sont:
        </h2>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">Numériques</strong> (standardisées et rapide d’accès)</p>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">Visuelles</strong> (faciles à interpréter et comparer)</p>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">Accessibles</strong> (partagées entre thérapeutes)</p>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">Evolutive</strong> (Algorithme AI et Deep Learning))</p>
        <div className="grabEmailPart">
          <HeaderForm />
        </div>
      </div>
    </Fragment>
  );
};

export default headerCardContent;
