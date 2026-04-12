import {
  careerChronologyItems,
  careerChronologySectionContent,
} from "../../content/careerChronology";

const getCareerChronologyItemKey = ({
  dateLabel,
  organization,
  title,
}) => `${dateLabel}-${organization}-${title}`;

const getCareerChronologyMeta = ({ location, organization }) =>
  [ organization, location ].filter(Boolean).join(" | ");

const renderCareerChronologyItem = (careerChronologyItem) => (
  <li
    className="careerChronologyItem"
    key={getCareerChronologyItemKey(careerChronologyItem)}
  >
    <div className="careerChronologyDate">
      <span className="careerChronologyDateText">
        {careerChronologyItem.dateLabel}
      </span>
    </div>

    <div aria-hidden="true" className="careerChronologyConnector" />

    <article className="careerChronologyCard">
      <p className="careerChronologyCategory">
        {careerChronologyItem.category}
      </p>
      <h3 className="careerChronologyTitle">{careerChronologyItem.title}</h3>
      <p className="careerChronologyMeta">
        {getCareerChronologyMeta(careerChronologyItem)}
      </p>
      <p className="careerChronologySummary">
        {careerChronologyItem.summary}
      </p>
    </article>
  </li>
);

export default function CareerChronology() {
  return (
    <section
      aria-labelledby="career-chronology-title"
      className="careerChronologySection"
    >
      <div className="careerChronologyPanel">
        <div className="careerChronologyIntro">
          <p className="careerChronologyLead" id="career-chronology-title">
            {careerChronologySectionContent.summary}
          </p>
        </div>

        <ol className="careerChronologyList">
          {careerChronologyItems.map(renderCareerChronologyItem)}
        </ol>
      </div>
    </section>
  );
}
