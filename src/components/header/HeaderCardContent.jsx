import React, { Fragment } from 'react';

const headerCardContent = () => {
  return (
    <Fragment>
      <div className="headerCardText">
        <p className="card-header-welcome">Hi, I'm</p>
        <h1 className="headerCardTitle">Benjamin Marquis</h1>
      </div>
      <div className="headerCardText">
        <h2 style={{ marginBottom: "20px" }}>
          🚀 Some Milestones:
        </h2>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">Machine Learning Apprentice</strong> (Coursera)</p>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">VizzMD's CTO</strong> (CENTEQ)</p>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">Full Stack Developer</strong> (Le Wagon)</p>
        <p className="cardListCompetence"><img style={{ marginLeft: "15px" }} className="svgDone" src="/static/images/donesvg.svg" alt="svg done" /><strong className="darkblueTitle">Sociology Master degree</strong> (UQAM)</p>
        <div className="grabEmailPart" />
      </div>
      <div className="headerCardText">
        <h2 style={{ marginBottom: "20px" }}>
          Find me there:
        </h2>
        <div className="social-icons-header">
          <a className="footerLink" href="mailto:bmarquiscom@gmail.com"><img className="svgSocialHeader" src="/static/images/email.svg" alt="email icon" /></a>
          <a className="footerLink" href="https://www.linkedin.com/in/benjamin-marquis-6956b367/?locale=en_US" target="_blank"><img className="svgSocialHeader" src="/static/images/linkedinSvg.svg" alt="LinkedIn Icon" /></a>
          <a className="footerLink" href="https://github.com/BjMrq" target="_blank"><img className="svgSocialHeader" src="/static/images/github.svg" alt="GitHub Icon" /></a>
          <a className="footerLink" href="https://www.instagram.com/bjmrq/?hl=en" target="_blank"><img className="svgSocialHeader" src="/static/images/instagram.svg" alt="Instagram Icon" /></a>
        </div>
      </div>
    </Fragment>
  );
};

export default headerCardContent;
