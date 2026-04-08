import { Fragment } from "react";

const emphasisExpression = /(\*\*.*?\*\*)/g;

const removeEmphasisMarkers = (text) => text.replace(/\*\*/g, "");

const isEmphasizedSegment = (segment) =>
  segment.startsWith("**") && segment.endsWith("**");

const renderTextSegment = (segment, keyPrefix, segmentIndex) => {
  const key = `${keyPrefix}-${segmentIndex}`;

  if (isEmphasizedSegment(segment)) {
    return (
      <strong className="blueTitle" key={key}>
        {removeEmphasisMarkers(segment)}
      </strong>
    );
  }

  return <Fragment key={key}>{segment}</Fragment>;
};

const renderRichText = (text, keyPrefix) =>
  text
    .split(emphasisExpression)
    .filter(Boolean)
    .map((segment, segmentIndex) =>
      renderTextSegment(segment, keyPrefix, segmentIndex),
    );

const buildProjectText = ({ heading, paragraphs }) => (
  <p className="cardText ongoingText">
    <strong className="blueTitle">{heading}</strong>
    {paragraphs.map((paragraph, paragraphIndex) => (
      <Fragment key={`${heading}-${paragraphIndex}`}>
        <br />
        {renderRichText(paragraph, `${heading}-${paragraphIndex}`)}
      </Fragment>
    ))}
  </p>
);

const buildPlainText = ({ heading, paragraphs }) =>
  [heading, ...paragraphs.map(removeEmphasisMarkers)].join(" ");

const createProjectNarrative = ({ heading, paragraphs }) => ({
  heading,
  paragraphs,
  plainText: buildPlainText({ heading, paragraphs }),
  reactText: buildProjectText({ heading, paragraphs }),
});

export const projectNarrativesById = {
  suiTooling: createProjectNarrative({
    heading: "Building the tooling layer for a Sui marketplace dApp:",
    paragraphs: [
      "At OpenZeppelin, I built a **full-stack marketplace example** and the surrounding **tooling layer** to make Move contract development easier across environments.",
      "The work covered **contract publishing**, deployment artifacts, **network-aware configuration**, transaction helpers, and an **integration test harness** that could deploy contracts, seed state, and validate end-to-end flows.",
      "The result was a stronger **developer experience** and a more repeatable pipeline for building, testing, and operating **Sui applications** with Move smart contracts.",
    ],
  }),
  defender: createProjectNarrative({
    heading: "Securing smart contract operations at scale:",
    paragraphs: [
      "I worked on **OpenZeppelin Defender**, a platform teams use to deploy, monitor, and operate smart contracts in production with stronger operational safety.",
      "My scope spanned **full-stack product work**, from blockchain integration flows to AWS-backed microservices and the user-facing application layer.",
      "I shipped features around **contract administration**, **automation**, and **monitoring** so teams could react to on-chain events faster and reduce manual operational work.",
    ],
  }),
  astroLight: createProjectNarrative({
    heading: "A teaching dApp for DeFi and DAO concepts:",
    paragraphs: [
      "I built Astro Light as a hands-on way to teach **blockchain fundamentals** beyond slide decks and theory.",
      "The project combined a compact **DeFi and DAO experience** on Ethereum testnet where users could buy a token, swap, stake, and participate in a governance flow that changed the UI through on-chain decisions.",
      "It was designed as both a **learning sandbox** and a compact **smart contract demo**, turning wallets, contract calls, token flows, and governance into something people could actually use and understand.",
    ],
  }),
  aldo: createProjectNarrative({
    heading: "Modernizing the core of an e-commerce platform:",
    paragraphs: [
      "At Aldo, I joined the rebuild of the **order management system**, one of the most critical systems in the commerce stack.",
      "The platform was built around an **event-driven microservice architecture** using EventBridge, Lambda functions, and AWS messaging services, with the OMS coordinating multiple interconnected services.",
      "Alongside delivery work on **tested TypeScript services**, I created a **CLI and IDE extension** and helped with **onboarding and team enablement** so developers could move through the architecture and daily workflows faster.",
    ],
  }),
  skeepers: createProjectNarrative({
    heading: "Scaling a live-shopping product beyond MVP:",
    paragraphs: [
      "I joined Skeepers when the product had traction, but the engineering foundations needed to catch up with the ambition of the business.",
      "I built **Koa and Express services**, supported **WebSocket flows**, containerized the stack with Docker, and managed AWS infrastructure through **Terraform**.",
      "I also introduced **CI/CD pipelines**, **CLI tooling**, and more structured **Scrum practices** to help the team ship more reliably and grow into stronger delivery habits.",
    ],
  }),
  tooly: createProjectNarrative({
    heading: "Leading the technical direction of an MVP:",
    paragraphs: [
      "At Tooly, I led the technical side of the MVP while the company went through the **Next AI** incubation program.",
      "I built the stack with **TypeScript**, **Node and Koa**, **React**, and **GraphQL**, while making architectural decisions for a more scalable product.",
      "The role also extended into **product thinking**, from MVP experiments to shaping how the solution could better match user and business needs.",
    ],
  }),
  cominity: createProjectNarrative({
    heading: "Bringing DevOps discipline into agency delivery:",
    paragraphs: [
      "Alongside product work, I supported Cominity's agency projects and helped bring stronger engineering practices into client delivery.",
      "I set up **CI/CD pipelines**, containerized applications with **Docker**, used **Kubernetes** where orchestration made sense, and applied **serverless patterns** with AWS Lambda when they were the better fit.",
      "The work was as much about **technical execution** as it was about helping teams make practical infrastructure decisions and mentoring junior developers along the way.",
    ],
  }),
  centech: createProjectNarrative({
    heading: "Building an MVP inside an acceleration program:",
    paragraphs: [
      "At Centech, I joined VizzMD as **CTO and co-founder** to help turn a rehabilitation data-visualization idea into a real product.",
      "I helped shape both the **product direction** and the **technical direction**, including CRM setup and a first MVP built with **Rails and React**.",
      "It was my entry point into **startup building** and cross-functional ownership, working close to the business while still building the product itself.",
    ],
  }),
  leWagon: createProjectNarrative({
    heading: "Teaching full-stack development in the classroom:",
    paragraphs: [
      "After graduating from Le Wagon, I returned first as a teaching assistant and then as a teacher for the full-stack program.",
      "I taught **JavaScript** and core development concepts, helped students debug their projects, and adapted explanations to different learning styles.",
      "That experience strengthened my **communication**, **mentorship**, and **public speaking** skills while keeping me close to the fundamentals of product development.",
    ],
  }),
  shareIn: createProjectNarrative({
    heading: "Turning a career pivot into a real product:",
    paragraphs: [
      "Share In was my final project at Le Wagon, built as I shifted from data and marketing work into software development.",
      "We created a **Rails application** focused on connecting people through shared cultural interests, including **real-time messaging** powered by WebSockets.",
      "It was the project that turned self-taught **JavaScript and Python** into collaborative **full-stack product development** with a team.",
    ],
  }),
  airflow: createProjectNarrative({
    heading: "Automating reporting with a custom data pipeline:",
    paragraphs: [
      "While working in digital marketing, I built an **Apache Airflow pipeline** to reduce repetitive reporting work across multiple clients.",
      "The pipeline pulled data from advertising, analytics, and CRM APIs, loaded it into **BigQuery**, and used **Pandas** to create cleaner performance outputs and send results by email.",
      "I also packaged the environment with **Docker** and **Docker Compose** so the workflow was easier to run, reproduce, and improve over time.",
    ],
  }),
};

export const projectNarratives = Object.entries(projectNarrativesById).map(
  ([id, narrative]) => ({
    id,
    ...narrative,
  }),
);

export const suiToolingProjectText = projectNarrativesById.suiTooling.reactText;
export const defenderProjectText = projectNarrativesById.defender.reactText;
export const astroLightProjectText = projectNarrativesById.astroLight.reactText;
export const aldoProjectText = projectNarrativesById.aldo.reactText;
export const skeepersProjectText = projectNarrativesById.skeepers.reactText;
export const toolyProjectText = projectNarrativesById.tooly.reactText;
export const cominityProjectText = projectNarrativesById.cominity.reactText;
export const centechProjectText = projectNarrativesById.centech.reactText;
export const leWagonProjectText = projectNarrativesById.leWagon.reactText;
export const shareInProjectText = projectNarrativesById.shareIn.reactText;
export const airflowProjectText = projectNarrativesById.airflow.reactText;
