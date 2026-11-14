// Every positive claim below is backed by the exact résumé bullet stored in
// public/static/documents/Resume Cove Marquis EN.md. Keep them in sync.
export const verifiedRoleFitEvidence = [
  {
    id: "rest-apis",
    label: "REST APIs",
    employer: "Spockee",
    resumeBullet: "Built REST APIs and real-time WebSocket services with JavaScript, TypeScript, Koa, and Express for a multi-service platform.",
    patterns: [/\bREST(?:ful)?\b/i, /\bAPIs?\b/i],
  },
  {
    id: "microservices",
    label: "microservices",
    employer: "Aldo",
    resumeBullet: "Developed end-to-end projects using microservices and event-driven architecture.",
    patterns: [/\bmicro[\s-]?services?\b/i, /\bevent[\s-]?driven\b/i],
  },
  {
    id: "typescript",
    label: "JavaScript / TypeScript",
    employer: "Aldo",
    resumeBullet: "Built and tested TypeScript solutions using functional programming practices.",
    patterns: [/\bJavaScript\b/i, /\bTypeScript\b/i],
  },
  {
    id: "react",
    label: "React",
    employer: "OpenZeppelin",
    resumeBullet: "Built full-stack applications on Sui with Move smart contracts, TypeScript tooling, and React interfaces, including trading and account-management features.",
    patterns: [/\bReact(?:\.js)?\b/i],
  },
  {
    id: "frontend",
    label: "front-end development",
    employer: "Tooly",
    resumeBullet: "Built full-stack features with TypeScript, Node.js (Koa), and React, alongside Docker-based development environments.",
    patterns: [/\bfront[\s-]?end\b/i, /\bHTML5?\b/i, /\bCSS3?\b/i],
  },
  {
    id: "aws",
    label: "AWS / serverless systems",
    employer: "Aldo",
    resumeBullet: "Deployed services on AWS, including Lambda, DynamoDB, SNS, SQS, and EventBridge.",
    patterns: [/\bAWS\b/i, /\bserverless\b/i, /\bLambda\b/i, /\bDynamoDB\b/i, /\bcloud\b/i],
  },
  {
    id: "cicd",
    label: "CI/CD",
    employer: "OpenZeppelin",
    resumeBullet: "Maintained CI/CD and AWS deployment workflows while contributing to Scrum, Kanban, and AI-assisted development practices.",
    patterns: [/\bCI\s*\/\s*CD\b/i, /\bCI\/CD\b/i, /\bDevOps\b/i, /\bcontinuous (?:integration|delivery|deployment)\b/i, /\bdeployment pipelines?\b/i],
  },
  {
    id: "agile",
    label: "Agile / Scrum",
    employer: "Aldo",
    resumeBullet: "Helped improve team development processes using Scrum.",
    patterns: [/\bAgile\b/i, /\bScrum\b/i, /\bKanban\b/i],
  },
  {
    id: "node-backend",
    label: "Node.js backend development",
    employer: "Spockee",
    resumeBullet: "Built REST APIs and real-time WebSocket services with JavaScript, TypeScript, Koa, and Express for a multi-service platform.",
    patterns: [/\bNode(?:\.js)?\b/i, /\bExpress(?:\.js)?\b/i, /\bKoa\b/i],
  },
  {
    id: "architecture",
    label: "software architecture",
    employer: "Egeria Systems",
    resumeBullet: "Lead project discovery and technical planning, from defining requirements and evaluating technologies to designing architectures and implementation plans tailored to organisational systems and processes.",
    patterns: [/\b(?:software|system|technical|solution)\s+(?:design|architecture)\b/i, /\bdesign and development\b/i],
  },
  {
    id: "docker",
    label: "Docker / Terraform",
    employer: "Spockee",
    resumeBullet: "Managed Docker environments, AWS infrastructure with Terraform, and CI/CD pipelines while helping the team coordinate work through Scrum.",
    patterns: [/\bDocker\b/i, /\bTerraform\b/i],
  },
  {
    id: "svelte",
    label: "Svelte",
    employer: "OpenZeppelin",
    resumeBullet: "Developed OpenZeppelin Defender features across TypeScript clients, AWS-based microservices, and a Svelte frontend.",
    patterns: [/\bSvelte\b/i],
  },
  {
    id: "blockchain",
    label: "blockchain / smart contracts",
    employer: "OpenZeppelin",
    resumeBullet: "Built full-stack applications on Sui with Move smart contracts, TypeScript tooling, and React interfaces, including trading and account-management features.",
    patterns: [/\bblockchain\b/i, /\bsmart contracts?\b/i, /\bSolidity\b/i, /\bSui\b/i],
  },
  {
    id: "git",
    label: "Git",
    resumeBullet: "**Tools:** Git, CLI tooling, IDE extensions",
    evidenceText: "My résumé lists Git among my technical tools.",
    patterns: [/\bGit\b/i, /\bversion control\b/i],
  },
];

// A mention in a JOB AD is not evidence that the candidate has used it.
// These are common requirements not substantiated by the published résumé.
// This is deliberately a non-exhaustive list: never infer experience for
// unrecognised technologies, either.
const unverifiedTechnologies = [
  { group: "Java stack", label: "Java", patterns: [/\bJava\b/i] },
  { group: "Java stack", label: "J2EE", patterns: [/\bJ2EE\b/i, /\bJakarta\s+EE\b/i] },
  { group: "Java stack", label: "Spring", patterns: [/\bSpring\b(?!\s+Boot)/i] },
  { group: "Java stack", label: "Spring Boot", patterns: [/\bSpring\s+Boot\b/i] },
  { group: "Java stack", label: "Hibernate", patterns: [/\bHibernate\b/i] },
  { group: "Databases", label: "SQL", patterns: [/\bSQL\b/i] },
  { group: "Databases", label: "MySQL", patterns: [/\bMySQL\b/i] },
  { group: "Databases", label: "PostgreSQL", patterns: [/\bPostgreSQL\b/i, /\bPostgres\b/i] },
  { group: "Operating systems", label: "Linux", patterns: [/\bLinux\b/i] },
  { group: "Operating systems", label: "Unix", patterns: [/\bUnix\b/i] },
  { group: "Other front-end frameworks", label: "Angular", patterns: [/\bAngular(?:JS)?\b/i] },
  { group: "Other front-end frameworks", label: "Vue", patterns: [/\bVue(?:\.js)?\b/i] },
  { group: "Other databases", label: "MongoDB", patterns: [/\bMongoDB\b/i] },
  { group: "Other backend stacks", label: "Python", patterns: [/\bPython\b/i] },
  { group: "Other backend stacks", label: "Django", patterns: [/\bDjango\b/i] },
  { group: "Other backend stacks", label: "Flask", patterns: [/\bFlask\b/i] },
  { group: "Other backend stacks", label: "FastAPI", patterns: [/\bFastAPI\b/i] },
  { group: "Other backend stacks", label: "C#", patterns: [/\bC#(?!\w)/i] },
  { group: "Other backend stacks", label: ".NET", patterns: [/\.NET\b/i, /\bASP\.NET\b/i] },
  { group: "Other backend stacks", label: "Go", patterns: [/\bGolang\b/i, /\bGo\s+(?:language|programming|development|developer)\b/i] },
  { group: "Other infrastructure", label: "Kubernetes", patterns: [/\bKubernetes\b/i, /\bK8s\b/i] },
  { group: "Other infrastructure", label: "Azure", patterns: [/\bAzure\b/i] },
  { group: "Other infrastructure", label: "Google Cloud", patterns: [/\bGCP\b/i, /\bGoogle Cloud\b/i] },
  { group: "Other infrastructure", label: "Kafka", patterns: [/\bKafka\b/i] },
];

const isNegatedRequirement = (text, index, length) => {
  const prefix = text.slice(Math.max(0, index - 70), index).split(/[.!?;\n]/).pop() ?? "";
  const suffix = text.slice(index + length, index + length + 45);
  return /\b(?:no|without|not requiring|do not require|does not require|don't require)\b(?:\s+\w+){0,3}\s*$/i.test(prefix) ||
    /^(?:\s+\w+){0,2}\s+(?:is\s+)?(?:not required|not needed|unnecessary)\b/i.test(suffix);
};

const isOptionalRequirement = (text, index, length) => {
  const lineStart = text.lastIndexOf("\n", index) + 1;
  const nextLine = text.indexOf("\n", index + length);
  const lineEnd = nextLine < 0 ? text.length : nextLine;
  const before = text.slice(Math.max(lineStart, index - 45), index);
  const after = text.slice(index + length, Math.min(lineEnd, index + length + 90));
  const trailingQualifier = /[-–—]\s*(?:good to have|nice to have|optional|preferred)\b/i.exec(after);
  const qualifiedClause = trailingQualifier &&
    !/[.;]\s+(?=\w)/.test(after.slice(0, trailingQualifier.index));
  return /\b(?:optional(?:ly)?|nice to have|good to have|preferred)\b(?:\W*\w+){0,3}\W*$/i.test(before) ||
    Boolean(qualifiedClause) ||
    /^\s*(?:is\s+)?(?:optional|preferred|nice to have|good to have)\b/i.test(after);
};

const firstPositiveMention = (text, patterns) => {
  let firstIndex = Infinity;
  let requiredMentionFound = false;
  for (const pattern of patterns) {
    for (const match of text.matchAll(new RegExp(pattern.source, "gi"))) {
      if (isNegatedRequirement(text, match.index, match[0].length)) continue;
      firstIndex = Math.min(firstIndex, match.index);
      if (!isOptionalRequirement(text, match.index, match[0].length)) {
        requiredMentionFound = true;
      }
    }
  }
  return { position: firstIndex, optional: !requiredMentionFound };
};

export const matchRoleFitEvidence = (jobDescription) => {
  const supported = verifiedRoleFitEvidence
    .map((entry) => ({ ...entry, ...firstPositiveMention(jobDescription, entry.patterns) }))
    .filter((entry) => Number.isFinite(entry.position))
    .sort((a, b) => a.position - b.position);

  const gapsByGroup = new Map();
  for (const technology of unverifiedTechnologies) {
    const { position, optional } = firstPositiveMention(jobDescription, technology.patterns);
    if (!Number.isFinite(position)) continue;
    if (!gapsByGroup.has(technology.group)) {
      gapsByGroup.set(technology.group, { position, labels: [], optional: true });
    }
    const group = gapsByGroup.get(technology.group);
    group.position = Math.min(group.position, position);
    group.optional = group.optional && optional;
    group.labels.push(technology.label);
  }
  const gaps = [...gapsByGroup.values()]
    .sort((a, b) => Number(a.optional) - Number(b.optional) || a.position - b.position);
  return { supported, gaps };
};

const uniqueEvidence = (evidence) => {
  const seen = new Set();
  return evidence.filter((item) => {
    if (seen.has(item.resumeBullet)) return false;
    seen.add(item.resumeBullet);
    return true;
  });
};

const modelEvidenceIds = (text, eligible) => {
  const allowed = new Set(eligible.map(({ id }) => id));
  return (typeof text === "string" ? text.toLowerCase().match(/[a-z][a-z0-9-]*/g) : [])
    ?.filter((id) => allowed.has(id)) ?? [];
};

const renderEvidence = ({ employer, evidenceText, resumeBullet }) =>
  "- " + (evidenceText ??
    ("At " + employer + ", I " + resumeBullet[0].toLowerCase() + resumeBullet.slice(1)));

const humanList = (items) => {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return items.join(" and ");
  return items.slice(0, -1).join(", ") + ", and " + items.at(-1);
};

export const formatGroundedRoleFit = (jobDescription, modelResponse = "") => {
  const { supported, gaps } = matchRoleFitEvidence(jobDescription);
  const byId = new Map(supported.map((item) => [item.id, item]));
  const ranked = [...modelEvidenceIds(modelResponse, supported).map((id) => byId.get(id)), ...supported];
  const selected = uniqueEvidence(ranked).slice(0, 4);
  const fit = selected.length
    ? "- I have documented experience relevant to " +
      humanList(selected.slice(0, 3).map(({ label }) => label)) +
      ". This does not establish a match for every requirement."
    : "- I cannot verify a direct technical match from the experience documented in my public résumé.";
  const evidence = selected.length
    ? selected.map(renderEvidence).join("\n\n")
    : "- No directly matching experience was established by the published résumé.";
  const rampUp = gaps.length
    ? gaps.slice(0, 5).map(({ labels, optional }) => optional
      ? "- Optional technologies mentioned in the posting but not documented in my résumé: " + humanList(labels) + "."
      : "- My résumé does not document professional experience with " + humanList(labels) + ", which the posting mentions."
    ).join("\n") + "\n- This list is not exhaustive; other role requirements also need verification."
    : "- Any requirements not explicitly evidenced by the résumé need confirmation; the job posting itself is not proof of my experience.";

  return [
    "Why I fit", fit,
    "",
    "Relevant evidence", evidence,
    "",
    "Possible ramp-up areas", rampUp,
  ].join("\n");
};
