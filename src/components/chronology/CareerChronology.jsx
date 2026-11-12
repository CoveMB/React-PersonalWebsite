import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBriefcase, faCertificate, faGraduationCap } from "@fortawesome/free-solid-svg-icons";
import {
  careerChronologyItems,
  careerChronologySectionContent,
} from "../../content/careerChronology";

const categoryIcons = {
  Role: faBriefcase,
  Certification: faCertificate,
  Education: faGraduationCap,
};

const getCareerChronologyItemKey = ({
  dateLabel,
  organization,
  title,
}) => `${dateLabel}-${organization}-${title}`;

const getCareerChronologyMeta = ({ location, organization }) =>
  [ organization, location ].filter(Boolean).join(" | ");

const renderCareerChronologyItem = (careerChronologyItem) => (
  <li
    className={`careerChronologyItem careerChronologyItem--${careerChronologyItem.category.toLowerCase()}`}
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
        <FontAwesomeIcon
          aria-hidden="true"
          className="careerChronologyCategoryIcon"
          icon={categoryIcons[careerChronologyItem.category]}
        />
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
