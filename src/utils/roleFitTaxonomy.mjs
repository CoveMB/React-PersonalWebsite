// Explicit, conservative vocabulary. A shared word is not technical equivalence.
const entries = [
  ["java", "Java", ["Java"]],
  ["javascript", "JavaScript", ["JavaScript", "ECMAScript"]],
  ["typescript", "TypeScript", ["TypeScript"]],
  ["j2ee", "J2EE", ["J2EE", "Jakarta EE", "Java EE"]],
  ["spring-boot", "Spring Boot", ["Spring Boot"]],
  ["spring", "Spring", ["Spring Framework", "Spring"]],
  ["hibernate", "Hibernate", ["Hibernate"]],
  ["react", "React", ["React.js", "ReactJS", "React"]],
  ["angular", "Angular", ["AngularJS", "Angular"]],
  ["vue", "Vue", ["Vue.js", "VueJS", "Vue"]],
  ["svelte", "Svelte", ["Svelte"]],
  ["nextjs", "Next.js", ["Next.js", "NextJS"]],
  ["html", "HTML", ["HTML5", "HTML"]],
  ["css", "CSS", ["CSS3", "CSS"]],
  ["nodejs", "Node.js", ["Node.js", "NodeJS"]],
  ["koa", "Koa", ["Koa"]],
  ["express", "Express", ["Express.js", "ExpressJS", "Express"]],
  ["rest", "REST APIs", ["RESTful APIs", "REST APIs", "REST API", "RESTful"]],
  ["websocket", "WebSockets", ["WebSockets", "WebSocket"]],
  ["graphql", "GraphQL", ["GraphQL"]],
  ["microservices", "Microservices", ["microservices", "micro-services", "microservice"]],
  ["event-driven", "Event-driven architecture", ["event-driven", "event driven"]],
  ["aws", "AWS", ["Amazon Web Services", "AWS"]],
  ["lambda", "AWS Lambda", ["AWS Lambda", "Lambda"]],
  ["dynamodb", "DynamoDB", ["DynamoDB"]],
  ["azure", "Azure", ["Azure"]],
  ["gcp", "Google Cloud", ["Google Cloud", "GCP"]],
  ["kubernetes", "Kubernetes", ["Kubernetes", "K8s"]],
  ["docker", "Docker", ["Docker"]],
  ["terraform", "Terraform", ["Terraform"]],
  ["cloudflare", "Cloudflare", ["Cloudflare"]],
  ["cicd", "CI/CD", ["CI/CD", "CI / CD", "continuous integration", "continuous delivery"]],
  ["git", "Git", ["Git"]],
  ["scrum", "Scrum", ["Scrum"]],
  ["kanban", "Kanban", ["Kanban"]],
  ["agile", "Agile", ["Agile"]],
  ["sql", "SQL", ["SQL"]],
  ["mysql", "MySQL", ["MySQL"]],
  ["postgresql", "PostgreSQL", ["PostgreSQL", "Postgres"]],
  ["mongodb", "MongoDB", ["MongoDB"]],
  ["nosql", "NoSQL", ["NoSQL"]],
  ["database", "Databases", ["databases", "database", "DB technologies"]],
  ["linux", "Linux", ["Linux"]],
  ["unix", "Unix", ["Unix"]],
  ["python", "Python", ["Python"]],
  ["django", "Django", ["Django"]],
  ["flask", "Flask", ["Flask"]],
  ["fastapi", "FastAPI", ["FastAPI"]],
  ["kafka", "Kafka", ["Kafka"]],
  ["csharp", "C#", ["C#"]],
  ["dotnet", ".NET", ["ASP.NET", ".NET"]],
  ["ruby", "Ruby", ["Ruby"]],
  ["rails", "Rails", ["Ruby on Rails", "Rails"]],
  ["solidity", "Solidity", ["Solidity"]],
  ["move", "Move", ["Move smart contracts", "Move"]],
  ["smart-contracts", "Smart contracts", ["smart contracts", "smart contract"]],
  ["blockchain", "Blockchain", ["blockchain"]],
  ["testing", "Automated testing", ["integration tests", "automated testing", "unit tests", "testing"]],
  ["analytics", "Analytics", ["analytics tracking", "web analytics", "analytics"]],
  ["mentoring", "Mentoring", ["mentoring", "onboarding", "training developers"]],
  ["architecture", "Software architecture", ["software architecture", "system architecture", "technical architecture"]],
];

export const capabilityCatalog = Object.freeze(entries.map(([key, label, aliases]) => ({
  key, label, aliases,
})));
const byKey = new Map(capabilityCatalog.map((item) => [item.key, item]));
const escaped = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
const expressions = capabilityCatalog.flatMap((item) => item.aliases.map((alias) => ({
  ...item,
  alias,
  // Escape before and after a token, not after the whole regexp: C# and .NET need support.
  regex: new RegExp(`(?<![\\p{L}\\p{N}_])${escaped(alias)}(?![\\p{L}\\p{N}_])`, "giu"),
})));

export const capabilityLabel = (key) => byKey.get(key)?.label ?? key;
export const normalizeCapability = (term) => {
  if (typeof term !== "string" || term.length > 120) return null;
  const cleaned = term.trim().toLowerCase();
  return capabilityCatalog.find(({ key, aliases }) => key === cleaned ||
    aliases.some((alias) => alias.toLowerCase() === cleaned))?.key ?? null;
};

export const findCapabilities = (text) => {
  if (typeof text !== "string") return [];
  const hits = expressions.flatMap(({ key, regex }) =>
    [...text.matchAll(regex)].map((match) => ({ key, label: match[0], start: match.index, end: match.index + match[0].length })));
  // Prefer the longest explicit token; never count Spring inside Spring Boot.
  hits.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const accepted = [];
  for (const hit of hits) {
    if (accepted.some((entry) => hit.start < entry.end && entry.start < hit.end)) continue;
    accepted.push(hit);
  }
  return accepted.sort((a, b) => a.start - b.start);
};

const transfer = {
  java: [{ candidateKey: "nodejs", reasonCode: "different_language_runtime" }],
  spring: [{ candidateKey: "express", reasonCode: "different_backend_framework" }, { candidateKey: "koa", reasonCode: "different_backend_framework" }],
  "spring-boot": [{ candidateKey: "nodejs", reasonCode: "different_backend_framework" }],
  vue: [{ candidateKey: "react", reasonCode: "different_frontend_framework" }],
  angular: [{ candidateKey: "react", reasonCode: "different_frontend_framework" }],
  azure: [{ candidateKey: "aws", reasonCode: "different_cloud_provider" }],
  gcp: [{ candidateKey: "aws", reasonCode: "different_cloud_provider" }],
  django: [{ candidateKey: "rails", reasonCode: "different_backend_framework" }],
};
export const getTransferableRelations = (capabilityKey) => transfer[capabilityKey] ?? [];

export const transferReasonText = {
  different_language_runtime: "Related backend work uses a different programming language and runtime.",
  different_backend_framework: "Related backend work uses a different framework and stack.",
  different_frontend_framework: "Related interface work uses a different frontend framework.",
  different_cloud_provider: "Related cloud work uses a different provider and services.",
};
