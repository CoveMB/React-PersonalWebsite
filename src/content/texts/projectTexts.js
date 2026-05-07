const createProjectNarrativeText = ({
  build,
  context,
  outcome,
  summary,
}) => ({
  build,
  context,
  outcome,
  summary,
});

export const PROJECTS_SECTION_INTRO =
  "These projects show recent work across product engineering, systems delivery and developer tooling. Sorted in chronological order.";

export const PROJECT_SUI_TOOLING_SUMMARY =
  "Building the tooling layer for a Sui marketplace dApp";

export const PROJECT_SUI_TOOLING_CONTEXT =
  "At OpenZeppelin, I built a **full-stack marketplace example** and the surrounding **tooling layer** to make Move contract development easier across environments.";

export const PROJECT_SUI_TOOLING_BUILD =
  "The work covered **contract publishing**, deployment artifacts, **network-aware configuration**, transaction helpers, and an **integration test harness** that could deploy contracts, seed state, and validate end-to-end flows.";

export const PROJECT_SUI_TOOLING_OUTCOME =
  "The result was a stronger **developer experience** and a more repeatable pipeline for building, testing, and operating **Sui applications** with Move smart contracts.";

export const PROJECT_DEFENDER_SUMMARY =
  "Securing smart contract operations at scale";

export const PROJECT_DEFENDER_CONTEXT =
  "I worked on **OpenZeppelin Defender**, a platform teams use to deploy, monitor, and operate smart contracts in production with stronger operational safety.";

export const PROJECT_DEFENDER_BUILD =
  "My scope spanned **full-stack product work**, from blockchain integration flows to AWS-backed microservices and the user-facing application layer.";

export const PROJECT_DEFENDER_OUTCOME =
  "I shipped features around **contract administration**, **automation**, and **monitoring** so teams could react to on-chain events faster and reduce manual operational work.";

export const PROJECT_ASTRO_LIGHT_SUMMARY =
  "A teaching dApp for DeFi and DAO concepts";

export const PROJECT_ASTRO_LIGHT_CONTEXT =
  "I built Astro Light as a hands-on way to teach **blockchain fundamentals** beyond slide decks and theory.";

export const PROJECT_ASTRO_LIGHT_BUILD =
  "The project combined a compact **DeFi and DAO experience** on Ethereum testnet where users could buy a token, swap, stake, and participate in a governance flow that changed the UI through on-chain decisions.";

export const PROJECT_ASTRO_LIGHT_OUTCOME =
  "It was designed as both a **learning sandbox** and a compact **smart contract demo**, turning wallets, contract calls, token flows, and governance into something people could actually use and understand.";

export const PROJECT_ALDO_SUMMARY =
  "Modernizing the core of an e-commerce platform";

export const PROJECT_ALDO_CONTEXT =
  "At Aldo, I joined the rebuild of the **order management system**, one of the most critical systems in the commerce stack.";

export const PROJECT_ALDO_BUILD =
  "The platform was built around an **event-driven microservice architecture** using EventBridge, Lambda functions, and AWS messaging services, with the OMS coordinating multiple interconnected services.";

export const PROJECT_ALDO_OUTCOME =
  "Alongside delivery work on **tested TypeScript services**, I created a **CLI and IDE extension** and helped with **onboarding and team enablement** so developers could move through the architecture and daily workflows faster.";

export const PROJECT_SKEEPERS_SUMMARY =
  "Scaling a live-shopping product beyond MVP";

export const PROJECT_SKEEPERS_CONTEXT =
  "I joined Skeepers when the product had traction, but the engineering foundations needed to catch up with the ambition of the business.";

export const PROJECT_SKEEPERS_BUILD =
  "I built **Koa and Express services**, supported **WebSocket flows**, containerized the stack with Docker, and managed AWS infrastructure through **Terraform**.";

export const PROJECT_SKEEPERS_OUTCOME =
  "I also introduced **CI/CD pipelines**, **CLI tooling**, and more structured **Scrum practices** to help the team ship more reliably and grow into stronger delivery habits.";

export const PROJECT_TOOLY_SUMMARY =
  "Leading the technical direction of an MVP";

export const PROJECT_TOOLY_CONTEXT =
  "At Tooly, I led the technical side of the MVP while the company went through the **Next AI** incubation program.";

export const PROJECT_TOOLY_BUILD =
  "I built the stack with **TypeScript**, **Node and Koa**, **React**, and **GraphQL**, while making architectural decisions for a more scalable product.";

export const PROJECT_TOOLY_OUTCOME =
  "The role also extended into **product thinking**, from MVP experiments to shaping how the solution could better match user and business needs.";

export const PROJECT_COMINITY_SUMMARY =
  "Bringing DevOps discipline into agency delivery";

export const PROJECT_COMINITY_CONTEXT =
  "Alongside product work, I supported Cominity's agency projects and helped bring stronger engineering practices into client delivery.";

export const PROJECT_COMINITY_BUILD =
  "I set up **CI/CD pipelines**, containerized applications with **Docker**, used **Kubernetes** where orchestration made sense, and applied **serverless patterns** with AWS Lambda when they were the better fit.";

export const PROJECT_COMINITY_OUTCOME =
  "The work was as much about **technical execution** as it was about helping teams make practical infrastructure decisions and mentoring junior developers along the way.";

export const PROJECT_CENTECH_SUMMARY =
  "Building an MVP inside an acceleration program";

export const PROJECT_CENTECH_CONTEXT =
  "At Centech, I joined VizzMD as **CTO and co-founder** to help turn a rehabilitation data-visualization idea into a real product.";

export const PROJECT_CENTECH_BUILD =
  "I helped shape both the **product direction** and the **technical direction**, including CRM setup and a first MVP built with **Rails and React**.";

export const PROJECT_CENTECH_OUTCOME =
  "It was my entry point into **startup building** and cross-functional ownership, working close to the business while still building the product itself.";

export const PROJECT_LE_WAGON_SUMMARY =
  "Teaching full-stack development in the classroom";

export const PROJECT_LE_WAGON_CONTEXT =
  "After graduating from Le Wagon, I returned first as a teaching assistant and then as a teacher for the full-stack program.";

export const PROJECT_LE_WAGON_BUILD =
  "I taught **JavaScript** and core development concepts, helped students debug their projects, and adapted explanations to different learning styles.";

export const PROJECT_LE_WAGON_OUTCOME =
  "That experience strengthened my **communication**, **mentorship**, and **public speaking** skills while keeping me close to the fundamentals of product development.";

export const PROJECT_SHARE_IN_SUMMARY =
  "Turning a career pivot into a real product";

export const PROJECT_SHARE_IN_CONTEXT =
  "Share In was my final project at Le Wagon, built as I shifted from data and marketing work into software development.";

export const PROJECT_SHARE_IN_BUILD =
  "We created a **Rails application** focused on connecting people through shared cultural interests, including **real-time messaging** powered by WebSockets.";

export const PROJECT_SHARE_IN_OUTCOME =
  "It was the project that turned self-taught **JavaScript and Python** into collaborative **full-stack product development** with a team.";

export const PROJECT_AIRFLOW_SUMMARY =
  "Automating reporting with a custom data pipeline";

export const PROJECT_AIRFLOW_CONTEXT =
  "While working in digital marketing, I built an **Apache Airflow pipeline** to reduce repetitive reporting work across multiple clients.";

export const PROJECT_AIRFLOW_BUILD =
  "The pipeline pulled data from advertising, analytics, and CRM APIs, loaded it into **BigQuery**, and used **Pandas** to create cleaner performance outputs and send results by email.";

export const PROJECT_AIRFLOW_OUTCOME =
  "I also packaged the environment with **Docker** and **Docker Compose** so the workflow was easier to run, reproduce, and improve over time.";

export const projectNarrativeTextById = {
  aldo: createProjectNarrativeText({
    build: PROJECT_ALDO_BUILD,
    context: PROJECT_ALDO_CONTEXT,
    outcome: PROJECT_ALDO_OUTCOME,
    summary: PROJECT_ALDO_SUMMARY,
  }),
  airflow: createProjectNarrativeText({
    build: PROJECT_AIRFLOW_BUILD,
    context: PROJECT_AIRFLOW_CONTEXT,
    outcome: PROJECT_AIRFLOW_OUTCOME,
    summary: PROJECT_AIRFLOW_SUMMARY,
  }),
  astroLight: createProjectNarrativeText({
    build: PROJECT_ASTRO_LIGHT_BUILD,
    context: PROJECT_ASTRO_LIGHT_CONTEXT,
    outcome: PROJECT_ASTRO_LIGHT_OUTCOME,
    summary: PROJECT_ASTRO_LIGHT_SUMMARY,
  }),
  centech: createProjectNarrativeText({
    build: PROJECT_CENTECH_BUILD,
    context: PROJECT_CENTECH_CONTEXT,
    outcome: PROJECT_CENTECH_OUTCOME,
    summary: PROJECT_CENTECH_SUMMARY,
  }),
  cominity: createProjectNarrativeText({
    build: PROJECT_COMINITY_BUILD,
    context: PROJECT_COMINITY_CONTEXT,
    outcome: PROJECT_COMINITY_OUTCOME,
    summary: PROJECT_COMINITY_SUMMARY,
  }),
  defender: createProjectNarrativeText({
    build: PROJECT_DEFENDER_BUILD,
    context: PROJECT_DEFENDER_CONTEXT,
    outcome: PROJECT_DEFENDER_OUTCOME,
    summary: PROJECT_DEFENDER_SUMMARY,
  }),
  leWagon: createProjectNarrativeText({
    build: PROJECT_LE_WAGON_BUILD,
    context: PROJECT_LE_WAGON_CONTEXT,
    outcome: PROJECT_LE_WAGON_OUTCOME,
    summary: PROJECT_LE_WAGON_SUMMARY,
  }),
  shareIn: createProjectNarrativeText({
    build: PROJECT_SHARE_IN_BUILD,
    context: PROJECT_SHARE_IN_CONTEXT,
    outcome: PROJECT_SHARE_IN_OUTCOME,
    summary: PROJECT_SHARE_IN_SUMMARY,
  }),
  skeepers: createProjectNarrativeText({
    build: PROJECT_SKEEPERS_BUILD,
    context: PROJECT_SKEEPERS_CONTEXT,
    outcome: PROJECT_SKEEPERS_OUTCOME,
    summary: PROJECT_SKEEPERS_SUMMARY,
  }),
  suiTooling: createProjectNarrativeText({
    build: PROJECT_SUI_TOOLING_BUILD,
    context: PROJECT_SUI_TOOLING_CONTEXT,
    outcome: PROJECT_SUI_TOOLING_OUTCOME,
    summary: PROJECT_SUI_TOOLING_SUMMARY,
  }),
  tooly: createProjectNarrativeText({
    build: PROJECT_TOOLY_BUILD,
    context: PROJECT_TOOLY_CONTEXT,
    outcome: PROJECT_TOOLY_OUTCOME,
    summary: PROJECT_TOOLY_SUMMARY,
  }),
};
