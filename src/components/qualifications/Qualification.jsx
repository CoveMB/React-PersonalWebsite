import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataAN, parallaxDataLN, parallaxDataPO } from "../../parallaxEffects/parallaxEffects";

const parallaxDataByTopic = {
  lead: parallaxDataLN,
  learning: parallaxDataAN,
  polyvalent: parallaxDataPO,
};

const cardTextByTopic = {
  lead: (
    <p className="cardText">
      The core of every project is the team that is responsible for it. As a lead developer and a scrum master, I have learned to orient individuals and spread knowledge to
      <strong className="blueTitle"> empower the team and strengthen its effectiveness </strong>
      supporting the project&apos;s goals for continuous improvement.
    </p>
  ),
  learning: (
    <p className="cardText">
      There is always something new to learn, and it motivates me. I developed a great capacity for adaptation and a passion for discovering new topics in various domains. Spreading this learning with others on the way. I like to research and propose
      <strong className="blueTitle"> new and innovative solutions to challenging problems</strong>
      .
    </p>
  ),
  polyvalent: (
    <p className="cardText">
      Different experiences and learnings helped me acquire multiple skills from back-end to front-end or DevOps. Allowing me to take charge of polyvalent missions, with a holistic point of view. I can prioritize and optimise work
      <strong className="blueTitle"> across different scopes of a project </strong>
      and deliver within time constraints.
    </p>
  ),
};

export default function Qualification({ cardTitle, topic }) {
  const topicClassName = topic === "learning" ? "topic topicNoBorder mobilepaddingNone" : "topic";

  return (
    <div className={topicClassName}>
      <ScrollParallax parallaxData={parallaxDataByTopic[topic] ?? parallaxDataLN}>
        <div className="cardTitleBlock">
          <img alt={`svg ${topic}`} className="svgCard" src={`/static/images/svg${topic}.svg`} />
          {cardTitle(topic)}
        </div>
        <div className="cardMobileTextLayout">{cardTextByTopic[topic] ?? null}</div>
      </ScrollParallax>
    </div>
  );
}
