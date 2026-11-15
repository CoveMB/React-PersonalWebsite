// Each positive item quotes the public resume or a published portfolio narrative.
// Project evidence describes the work in that case study; it is not a claim of
// years of professional experience in every technology mentioned.
const resumeUrl = "/static/documents/Resume%20Cove%20Marquis%20EN.md";
const projectUrl = "/#features";
const resume = (id, sourceId, label, sourceQuote, capabilities) => ({
  id, sourceType: "resume", sourceId, sourceQuote, sourceUrl: resumeUrl,
  label, capabilities, maturity: "documented", experienceType: "professional",
});
const project = (id, sourceId, label, sourceQuote, capabilities) => ({
  id, sourceType: "project", sourceId, sourceQuote, sourceUrl: projectUrl,
  label, capabilities, maturity: "documented", experienceType: "other",
});

export const roleFitEvidenceCatalog = Object.freeze([
  resume("rest-apis", "Spockee", "REST APIs and realtime services",
    "Built REST APIs and real-time WebSocket services with JavaScript, TypeScript, Koa, and Express for a multi-service platform.",
    ["rest", "websocket", "javascript", "typescript", "koa", "express"]),
  resume("microservices", "Aldo", "Microservices and event-driven systems",
    "Developed end-to-end projects using microservices and event-driven architecture.",
    ["microservices", "event-driven"]),
  resume("typescript", "Aldo", "Tested TypeScript services",
    "Built and tested TypeScript solutions using functional programming practices.",
    ["typescript", "testing"]),
  resume("react", "OpenZeppelin", "React interfaces and Sui applications",
    "Built full-stack applications on Sui with Move smart contracts, TypeScript tooling, and React interfaces, including trading and account-management features.",
    ["react", "typescript", "move", "smart-contracts", "blockchain"]),
  resume("node-backend", "Tooly", "Node.js and React product engineering",
    "Built full-stack features with TypeScript, Node.js (Koa), and React, alongside Docker-based development environments.",
    ["nodejs", "koa", "react", "typescript", "docker"]),
  resume("aws", "Aldo", "AWS serverless delivery",
    "Deployed services on AWS, including Lambda, DynamoDB, SNS, SQS, and EventBridge.",
    ["aws", "lambda", "dynamodb"]),
  resume("cicd", "Aldo", "CI/CD pipelines",
    "Built, maintained, and improved CI/CD pipelines.", ["cicd"]),
  resume("docker-terraform", "Spockee", "Infrastructure and delivery tooling",
    "Managed Docker environments, AWS infrastructure with Terraform, and CI/CD pipelines while helping the team coordinate work through Scrum.",
    ["docker", "aws", "terraform", "cicd", "scrum"]),
  resume("svelte", "OpenZeppelin", "Svelte and AWS microservices",
    "Developed OpenZeppelin Defender features across TypeScript clients, AWS-based microservices, and a Svelte frontend.",
    ["svelte", "typescript", "aws", "microservices"]),
  resume("agile", "OpenZeppelin", "Agile delivery practices",
    "Maintained CI/CD and AWS deployment workflows while contributing to Scrum, Kanban, and AI-assisted development practices.",
    ["cicd", "aws", "scrum", "kanban", "agile"]),
  resume("architecture", "Egeria Systems", "Architecture and technical planning",
    "Lead project discovery and technical planning, from defining requirements and evaluating technologies to designing architectures and implementation plans tailored to organisational systems and processes.",
    ["architecture"]),
  resume("nextjs", "Egeria Systems", "Reusable Next.js applications",
    "Build a reusable Next.js and TypeScript scaffolding system that generates foundations for web projects and manages modular capabilities over their lifecycle, including Cloudflare, authentication, multilingual content, analytics, and other integrations.",
    ["nextjs", "typescript", "cloudflare", "analytics"]),
  resume("product", "VizzMD", "Product development and MVP",
    "Built the first MVP with Rails and React, turning an early product concept into a working application.",
    ["rails", "react"]),
  resume("analytics", "LCI Education", "Marketing analytics and data engineering",
    "Built automated data pipelines and reporting workflows to make marketing performance easier to track and understand.",
    ["analytics"]),
  resume("mentoring", "Aldo", "Developer onboarding and training",
    "Handled onboarding and training for developers joining the team.",
    ["mentoring"]),
  resume("git", "Technical Skills", "Git tooling",
    "**Tools:** Git, CLI tooling, IDE extensions", ["git"]),
  project("cominity-infra", "cominity", "Kubernetes in an agency project",
    "I worked with **Docker, Kubernetes, AWS Lambda, and CI/CD pipelines**, applying different deployment approaches according to project needs. I also supported junior developers.",
    ["docker", "kubernetes", "aws", "lambda", "cicd", "mentoring"]),
  project("airflow-python", "airflow", "Python data pipeline project",
    "I built an **Apache Airflow pipeline** that collected advertising, analytics, and CRM data through APIs, processed it with **Python and Pandas**, and loaded it into **BigQuery** for reporting.",
    ["python", "analytics"]),
  project("tooly-graphql", "tooly", "GraphQL product stack",
    "I worked across the **TypeScript, Node.js, Koa, React, and GraphQL** stack, making architecture decisions while developing the MVP.",
    ["typescript", "nodejs", "koa", "react", "graphql"]),
  {
    id: "owner-no-professional-java",
    sourceType: "owner_confirmation",
    sourceId: "explicit_owner_statement",
    label: "No professional Java work (owner-confirmed)",
    sourceQuote: "The portfolio owner explicitly confirmed no professional Java work.",
    capabilities: [],
    explicitlyAbsent: ["java"],
    maturity: "documented",
    experienceType: "unclaimed",
  },
].map((item) => Object.freeze({
  ...item,
  capabilities: Object.freeze(item.capabilities),
  ...(item.explicitlyAbsent ? { explicitlyAbsent: Object.freeze(item.explicitlyAbsent) } : {}),
})));

export const getRoleFitEvidenceCatalog = () => roleFitEvidenceCatalog;
export const isPositiveEvidenceEligible = (evidence) =>
  evidence?.maturity === "documented" &&
  evidence?.sourceType !== "owner_confirmation" &&
  evidence?.sourceQuote?.length > 0 &&
  ["professional", "other"].includes(evidence.experienceType);
