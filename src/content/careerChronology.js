const createCareerChronologyItem = ({
  category,
  dateLabel,
  location = "",
  organization,
  summary,
  title,
}) => ({
  category,
  dateLabel,
  location,
  organization,
  summary,
  title,
});

export const careerChronologySectionContent = {
  summary:
    "A dated path through roles, certifications, and education from the resume.",
};

export const careerChronologyItems = [
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2022-Present",
    location: "Remote",
    organization: "OpenZeppelin",
    summary:
      "Full-stack blockchain delivery across Sui tooling, contract operations, React UI, AWS microservices, and CI/CD.",
    title: "Senior Full-Stack Blockchain Developer",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2022",
    organization: "Scrum.org",
    summary:
      "Professional Scrum with Kanban I certification focused on delivery flow and continuous improvement.",
    title: "Professional Scrum with Kanban I",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2022",
    organization: "Blockchain-Council.org",
    summary:
      "Certified Ethereum Developer I credential covering smart contract and blockchain foundations.",
    title: "Certified Ethereum Developer I",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2021",
    location: "Montreal, Canada",
    organization: "Aldo",
    summary:
      "Built event-driven TypeScript services on AWS, maintained CI/CD, and led onboarding plus developer-tooling improvements.",
    title: "Senior Software Developer",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2021",
    location: "Montreal, Canada",
    organization: "Spockee",
    summary:
      "Delivered Koa and Express applications, Terraform-managed AWS infrastructure, Docker orchestration, and Scrum facilitation.",
    title: "Full Stack Developer and Scrum Master",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2021",
    organization: "Scrum.org",
    summary:
      "Professional Scrum Master I certification for team facilitation and practical delivery management.",
    title: "Professional Scrum Master I",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2020",
    location: "Montreal, Canada",
    organization: "Tooly",
    summary:
      "Owned architecture and technical decisions while shipping the MVP and aligning the product with business needs.",
    title: "Lead Full Stack Developer and Devops",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2020",
    organization: "Linky Product Bootcamp",
    summary:
      "Product program focused on user needs, problem framing, and product decision-making.",
    title: "Product Manager Program I",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2019",
    location: "Montreal, Canada",
    organization: "VizzMD at Centech's Acceleration Program",
    summary:
      "Set startup and technology direction, drove market fit work, and built the MVP with Rails and React.",
    title: "Co-founder and CTO",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2019",
    location: "Montreal, Canada",
    organization: "Le Wagon",
    summary:
      "Taught programming and helped students build product projects while strengthening mentoring and technical communication.",
    title: "Teacher for the Full Stack Developer Program",
  }),
  createCareerChronologyItem({
    category: "Certification",
    dateLabel: "2019",
    organization: "Le Wagon Bootcamp",
    summary:
      "Completed the full-stack developer program with hands-on product and web engineering training.",
    title: "Full Stack Developer Program Certification",
  }),
  createCareerChronologyItem({
    category: "Role",
    dateLabel: "2018",
    location: "Montreal, Canada",
    organization: "LCI Education",
    summary:
      "Built reporting pipelines, automated performance metrics, and supported digital acquisition analytics.",
    title: "Web Analyst and Data Engineer",
  }),
  createCareerChronologyItem({
    category: "Education",
    dateLabel: "2017",
    organization: "University of Quebec at Montreal (UQAM)",
    summary:
      "Master's degree in Sociology, Magna Cum Laude, with research focused on discrimination and social integration models.",
    title: "Master's Degree in Sociology",
  }),
];
