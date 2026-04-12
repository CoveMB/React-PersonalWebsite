import ScrollParallax from "../animation/ScrollParallax";
import { qualificationContentByTopic } from "../../content/siteContent";
import { subtleRevealParallaxData } from "../../parallaxEffects/parallaxEffects";

const renderCardTitle = ({ titleLines }) => (
  <h2 className="cardTitle">
    {titleLines[0]}
    <br />
    {titleLines[1]}
  </h2>
);

export default function Qualification({ topic }) {
  const qualificationContent = qualificationContentByTopic[topic];

  return (
    <div className="topic">
      <ScrollParallax
        className="qualificationCard"
        parallaxData={subtleRevealParallaxData}
      >
        <div className="qualificationCardHeader">
          <img alt={`svg ${topic}`} className="svgCard" src={`/static/images/svg${topic}.svg`} />
          {qualificationContent ? renderCardTitle(qualificationContent) : null}
        </div>
        <div className="qualificationCardBody">
          {qualificationContent ? (
            <p className="cardText">
              {qualificationContent.body}{" "}
              <strong className="blueTitle">
                {qualificationContent.emphasis}
              </strong>
              .
            </p>
          ) : null}
        </div>
      </ScrollParallax>
    </div>
  );
}
