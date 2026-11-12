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

  if (!qualificationContent) {
    return null;
  }

  return (
    <div className="topic">
      <ScrollParallax
        className="qualificationCard"
        parallaxData={subtleRevealParallaxData}
      >
        <div className="qualificationCardHeader">
          <img alt="" className="svgCard" src={qualificationContent.icon} />
          {renderCardTitle(qualificationContent)}
        </div>
        <div className="qualificationCardBody">
          <p className="cardText">
            {qualificationContent.body}{" "}
            <strong className="blueTitle">{qualificationContent.emphasis}</strong>
          </p>
        </div>
      </ScrollParallax>
    </div>
  );
}
