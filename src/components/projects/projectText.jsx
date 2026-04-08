import { Fragment } from "react";

const emphasize = (text) => <strong className="blueTitle">{text}</strong>;

const renderProjectParagraph = (heading, paragraph, index) => (
  <Fragment key={`${heading}-${index}`}>
    <br />
    {paragraph}
  </Fragment>
);

const buildProjectText = ({ heading, paragraphs }) => (
  <p className="cardText ongoingText">
    {emphasize(heading)}
    {paragraphs.map((paragraph, index) =>
      renderProjectParagraph(heading, paragraph, index),
    )}
  </p>
);

export const suiToolingProjectText = buildProjectText({
  heading: "Building the tooling layer for a Sui marketplace dApp:",
  paragraphs: [
    <>
      At OpenZeppelin, I built a {emphasize("full-stack marketplace example")}{" "}
      and the surrounding {emphasize("tooling layer")} to make Move contract
      development easier across environments.
    </>,
    <>
      The work covered {emphasize("contract publishing")}, deployment artifacts,{" "}
      {emphasize("network-aware configuration")}, transaction helpers, and an{" "}
      {emphasize("integration test harness")} that could deploy contracts, seed
      state, and validate end-to-end flows.
    </>,
    <>
      The result was a stronger {emphasize("developer experience")} and a more
      repeatable pipeline for building, testing, and operating{" "}
      {emphasize("Sui applications")} with Move smart contracts.
    </>,
  ],
});

export const defenderProjectText = buildProjectText({
  heading: "Securing smart contract operations at scale:",
  paragraphs: [
    <>
      I worked on {emphasize("OpenZeppelin Defender")}, a platform teams use to
      deploy, monitor, and operate smart contracts in production with stronger
      operational safety.
    </>,
    <>
      My scope spanned {emphasize("full-stack product work")}, from blockchain
      integration flows to AWS-backed microservices and the user-facing
      application layer.
    </>,
    <>
      I shipped features around {emphasize("contract administration")},{" "}
      {emphasize("automation")}, and {emphasize("monitoring")} so teams could
      react to on-chain events faster and reduce manual operational work.
    </>,
  ],
});

export const astroLightProjectText = buildProjectText({
  heading: "A teaching dApp for DeFi and DAO concepts:",
  paragraphs: [
    <>
      I built Astro Light as a hands-on way to teach{" "}
      {emphasize("blockchain fundamentals")} beyond slide decks and theory.
    </>,
    <>
      The project combined a compact {emphasize("DeFi and DAO experience")} on
      Ethereum testnet where users could buy a token, swap, stake, and
      participate in a governance flow that changed the UI through on-chain
      decisions.
    </>,
    <>
      It was designed as both a {emphasize("learning sandbox")} and a compact{" "}
      {emphasize("smart contract demo")}, turning wallets, contract calls, token
      flows, and governance into something people could actually use and
      understand.
    </>,
  ],
});

export const aldoProjectText = buildProjectText({
  heading: "Modernizing the core of an e-commerce platform:",
  paragraphs: [
    <>
      At Aldo, I joined the rebuild of the{" "}
      {emphasize("order management system")}, one of the most critical systems
      in the commerce stack.
    </>,
    <>
      The platform was built around an{" "}
      {emphasize("event-driven microservice architecture")} using EventBridge,
      Lambda functions, and AWS messaging services, with the OMS coordinating
      multiple interconnected services.
    </>,
    <>
      Alongside delivery work on {emphasize("tested TypeScript services")}, I
      created a {emphasize("CLI and IDE extension")} and helped with{" "}
      {emphasize("onboarding and team enablement")} so developers could move
      through the architecture and daily workflows faster.
    </>,
  ],
});

export const skeepersProjectText = buildProjectText({
  heading: "Scaling a live-shopping product beyond MVP:",
  paragraphs: [
    <>
      I joined Skeepers when the product had traction, but the engineering
      foundations needed to catch up with the ambition of the business.
    </>,
    <>
      I built {emphasize("Koa and Express services")}, supported{" "}
      {emphasize("WebSocket flows")}, containerized the stack with Docker, and
      managed AWS infrastructure through {emphasize("Terraform")}.
    </>,
    <>
      I also introduced {emphasize("CI/CD pipelines")},{" "}
      {emphasize("CLI tooling")}, and more structured{" "}
      {emphasize("Scrum practices")} to help the team ship more reliably and
      grow into stronger delivery habits.
    </>,
  ],
});

export const toolyProjectText = buildProjectText({
  heading: "Leading the technical direction of an MVP:",
  paragraphs: [
    <>
      At Tooly, I led the technical side of the MVP while the company went
      through the {emphasize("Next AI")} incubation program.
    </>,
    <>
      I built the stack with {emphasize("TypeScript")},{" "}
      {emphasize("Node and Koa")}, {emphasize("React")}, and{" "}
      {emphasize("GraphQL")}, while making architectural decisions for a more
      scalable product.
    </>,
    <>
      The role also extended into {emphasize("product thinking")}, from MVP
      experiments to shaping how the solution could better match user and
      business needs.
    </>,
  ],
});

export const cominityProjectText = buildProjectText({
  heading: "Bringing DevOps discipline into agency delivery:",
  paragraphs: [
    <>
      Alongside product work, I supported Cominity&apos;s agency projects and
      helped bring stronger engineering practices into client delivery.
    </>,
    <>
      I set up {emphasize("CI/CD pipelines")}, containerized applications with
      {emphasize("Docker")}, used {emphasize("Kubernetes")} where orchestration
      made sense, and applied {emphasize("serverless patterns")} with AWS Lambda
      when they were the better fit.
    </>,
    <>
      The work was as much about {emphasize("technical execution")} as it was
      about helping teams make practical infrastructure decisions and mentoring
      junior developers along the way.
    </>,
  ],
});

export const centechProjectText = buildProjectText({
  heading: "Building an MVP inside an acceleration program:",
  paragraphs: [
    <>
      At Centech, I joined VizzMD as {emphasize("CTO and co-founder")} to help
      turn a rehabilitation data-visualization idea into a real product.
    </>,
    <>
      I helped shape both the {emphasize("product direction")} and the{" "}
      {emphasize("technical direction")}, including CRM setup and a first MVP
      built with {emphasize("Rails and React")}.
    </>,
    <>
      It was my entry point into {emphasize("startup building")} and
      cross-functional ownership, working close to the business while still
      building the product itself.
    </>,
  ],
});

export const leWagonProjectText = buildProjectText({
  heading: "Teaching full-stack development in the classroom:",
  paragraphs: [
    <>
      After graduating from Le Wagon, I returned first as a teaching assistant
      and then as a teacher for the full-stack program.
    </>,
    <>
      I taught {emphasize("JavaScript")} and core development concepts, helped
      students debug their projects, and adapted explanations to different
      learning styles.
    </>,
    <>
      That experience strengthened my {emphasize("communication")},{" "}
      {emphasize("mentorship")}, and {emphasize("public speaking")} skills while
      keeping me close to the fundamentals of product development.
    </>,
  ],
});

export const shareInProjectText = buildProjectText({
  heading: "Turning a career pivot into a real product:",
  paragraphs: [
    <>
      Share In was my final project at Le Wagon, built as I shifted from data
      and marketing work into software development.
    </>,
    <>
      We created a {emphasize("Rails application")} focused on connecting people
      through shared cultural interests, including{" "}
      {emphasize("real-time messaging")} powered by WebSockets.
    </>,
    <>
      It was the project that turned self-taught{" "}
      {emphasize("JavaScript and Python")} into collaborative{" "}
      {emphasize("full-stack product development")} with a team.
    </>,
  ],
});

export const airflowProjectText = buildProjectText({
  heading: "Automating reporting with a custom data pipeline:",
  paragraphs: [
    <>
      While working in digital marketing, I built an{" "}
      {emphasize("Apache Airflow pipeline")} to reduce repetitive reporting work
      across multiple clients.
    </>,
    <>
      The pipeline pulled data from advertising, analytics, and CRM APIs, loaded
      it into {emphasize("BigQuery")}, and used {emphasize("Pandas")} to create
      cleaner performance outputs and send results by email.
    </>,
    <>
      I also packaged the environment with {emphasize("Docker")} and{" "}
      {emphasize("Docker Compose")} so the workflow was easier to run,
      reproduce, and improve over time.
    </>,
  ],
});
