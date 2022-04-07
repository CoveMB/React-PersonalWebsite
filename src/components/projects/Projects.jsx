import React from "react";
import Project from "./Project";

const ongoing = (props) => {
  const projectNames = {
    aldo: "aldo",
    spockee: "spockee",
    tooly: "tooly",
    leWagon: "leWagon",
    centech: "centech",
    shareIn: "shareIn",
    airflow: "airflow",
    cominity: "cominity",
  };

  return (
    <>
      <p className="cardText ongoingIntro" id={props.idElement}>
        <strong className="blueTitle"> Learn'N Build:</strong> During my
        personal and professional path I encounter different challenges.
        Learning new skills led me to turn them into opportunities and build
        real projects.
        <br />
        <br />
        (Displayed from most recent to oldest)
      </p>
      <Project
        projectNames={projectNames}
        projectName={projectNames.aldo}
        side="right"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.spockee}
        side="left"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.tooly}
        side="right"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.cominity}
        side="left"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.centech}
        side="right"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.leWagon}
        side="left"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.shareIn}
        side="right"
      />
      <Project
        projectNames={projectNames}
        projectName={projectNames.airflow}
        side="left"
      />
    </>
  );
};

export default ongoing;
