import React from 'react';
import Project from './Project';

const ongoing = (props) => {

  const projectNames = {
    tooly  : 'tooly',
    leWagon: 'leWagon',
    centech: 'centech',
    shareIn: 'shareIn',
    airflow: 'airflow'
  };

  return (
    <>
      <p className="cardText ongoingIntro" id={props.idElement}>
        <strong className="blueTitle"> Learn'n build:</strong>
        {' '}
        During my personal and profesianal path I encounter different challenges. Learning new skills to overcome them led me to build real projects, here are some of them.
      </p>
      <Project
        projectNames={projectNames}
        projectName={projectNames.tooly}
        side="right"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.centech}
        side="left"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.leWagon}
        side="right"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.shareIn}
        side="left"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.airflow}
        side="right"
      />
    </>
  );

};

export default ongoing;
