import Qualification from "./Qualification";

export default function QualificationContainer() {
  return (
    <div className="cardBox">
      <Qualification topic="lead" />
      <Qualification topic="polyvalent" />
      <Qualification topic="learning" />
    </div>
  );
}
