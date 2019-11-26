import React from 'react';

const footer = () => {
  return (
    <div className="footer">
      <h2><a className="footerLink" href="mailto:bmarquiscom@gmail.com">bmarquiscom@gmail.com</a></h2>
      <a className="footerLink" href="https://www.linkedin.com/in/benjamin-marquis-6956b367/?locale=en_US" target="_blank"><img className="svgFooter" src="/static/images/linkedinSvg.svg" alt="LinkedIn Icon" /></a>
      <a className="footerLink" href="https://github.com/BjMrq" target="_blank"><img className="svgFooter" src="/static/images/github.svg" alt="GitHub Icon" /></a>
      <a className="footerLink" href="https://www.instagram.com/bjmrq/?hl=en" target="_blank"><img className="svgFooter" src="/static/images/instagram.svg" alt="Instagram Icon" /></a>
    </div>
  );
};

export default footer;
