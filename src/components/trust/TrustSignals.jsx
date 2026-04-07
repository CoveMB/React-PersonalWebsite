import { trustSignalGroups } from "../../utils/profile";

const renderTrustSignalItem = (item) => (
  <li className="trustSignalsItem" key={item}>
    {item}
  </li>
);

const renderTrustSignalGroup = ({ items, label }) => (
  <div className="trustSignalsGroup" key={label}>
    <p className="trustSignalsGroupTitle">{label}</p>
    <ul className="trustSignalsList">{items.map(renderTrustSignalItem)}</ul>
  </div>
);

export default function TrustSignals() {
  return (
    <section
      aria-label="Selected organizations and credentials"
      className="trustSignalsSection"
    >
      <div className="trustSignalsPanel">
        <p className="trustSignalsEyebrow">
          Selected work and learning experiences
        </p>
        {trustSignalGroups.map(renderTrustSignalGroup)}
      </div>
    </section>
  );
}
