import React from "react";
import Project from "./Project";

const ongoing = (props) => (
  <>
    <p className="cardText ongoingIntro" id={props.idElement}>
      <strong className="blueTitle"> Learn'N Build:</strong> During my personal
      and professional path I encounter different challenges. Learning new
      skills led me to turn them into opportunities and build real projects.
      Here are some of them sorted with most recent first:
    </p>
    <Project projectName="suiTooling" side="left" />
    <Project projectName="defender" side="right" />
    <Project projectName="astroLight" side="left" />
    <Project projectName="aldo" side="right" />
    <Project projectName="spockee" side="left" />
    <Project projectName="tooly" side="right" />
    <Project projectName="cominity" side="left" />
    <Project projectName="centech" side="right" />
    <Project projectName="leWagon" side="left" />
    <Project projectName="shareIn" side="right" />
    <Project projectName="airflow" side="left" />
  </>
);

export default ongoing;
