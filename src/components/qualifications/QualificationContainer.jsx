import Qualification from "./Qualification";

const cardTitles = {
  lead: (
    <h2 className="cardTitle">
      Team
      <br />
      Focused
    </h2>
  ),
  learning: (
    <h2 className="cardTitle">
      Always
      <br />
      Learning
    </h2>
  ),
  polyvalent: (
    <h2 className="cardTitle">
      Polyvalent
      <br />
      Abilities
    </h2>
  ),
};

const renderCardTitle = (topic) => cardTitles[topic] ?? null;

export default function QualificationContainer() {
  return (
    <div className="cardBox makeItFlex flexColumnMobile">
      <Qualification cardTitle={renderCardTitle} topic="lead" />
      <Qualification cardTitle={renderCardTitle} topic="polyvalent" />
      <Qualification cardTitle={renderCardTitle} topic="learning" />
    </div>
  );
}
