import ScrollParallax from "../animation/ScrollParallax";
import {
  parallaxDataProjectLeft,
  parallaxDataProjectRight,
} from "../../parallaxEffects/parallaxEffects";
import ProjectImage from "./ProjectImage";
import {
  airflowProjectText,
  aldoProjectText,
  astroLightProjectText,
  centechProjectText,
  cominityProjectText,
  defenderProjectText,
  leWagonProjectText,
  shareInProjectText,
  spockeeProjectText,
  suiToolingProjectText,
  toolyProjectText,
} from "./projectText";

const projectDetailsByName = {
  airflow: {
    imageLabel: "Airflow reporting pipeline preview",
    githubRepository: "https://github.com/CoveMB/Python-AirflowReportPipeline",
    image: "/static/images/airflow.png",
    techStack: [
      "Python",
      "Airflow",
      "BigQuery",
      "Docker",
      "Docker Compose",
      "Reporting",
    ],
    text: airflowProjectText,
    title: "Airflow Reporting Pipeline",
    website: "https://github.com/CoveMB/Python-AirflowReportPipeline",
    websiteLabel: "Source",
  },
  aldo: {
    imageLabel: "Aldo OMS platform preview",
    image: "/static/images/aldo.png",
    techStack: [
      "TypeScript",
      "Functional",
      "Lambda",
      "DynamoDB",
      "EventBridge",
      "Microservices",
      "Event-Driven",
      "Scrum",
    ],
    text: aldoProjectText,
    title: "Aldo OMS Modernization",
    website: "https://www.aldogroup.com/",
    websiteLabel: "Company site",
  },
  astroLight: {
    imageLabel: "Astro Light dApp preview",
    githubRepository: "https://github.com/CoveMB/solidity-DEFI-DAO",
    image: "/static/images/astroLight.svg",
    techStack: [
      "Solidity",
      "Ethereum",
      "Smart Contracts",
      "DeFi",
      "DAO",
      "Governance",
      "Token Swap",
      "Teaching dApp",
    ],
    text: astroLightProjectText,
    title: "Astro Light",
    website: "https://astro-light.on.fleek.co/",
    websiteLabel: "View live",
  },
  centech: {
    imageLabel: "VizzMD MVP preview",
    githubRepository: "https://github.com/CoveMB/Rails-React-VizzMD-App",
    image: "/static/images/centech.png",
    techStack: ["Rails", "React", "MVP", "Product", "Data Visualization"],
    text: centechProjectText,
    title: "VizzMD",
    website: "https://react-rails-vizzmd-mvp.herokuapp.com",
    websiteLabel: "View project",
  },
  cominity: {
    imageLabel: "Cominity project preview",
    image: "/static/images/cominity.png",
    techStack: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Serverless",
      "Lambda",
      "CI/CD",
      "DevOps",
      "Mentoring",
    ],
    text: cominityProjectText,
    title: "Cominity",
    website: "https://cominity.ca/",
    websiteLabel: "Visit site",
  },
  defender: {
    imageLabel: "OpenZeppelin Defender preview",
    image: "/static/images/defender.png",
    techStack: [
      "TypeScript",
      "Svelte",
      "AWS",
      "Lambda",
      "DynamoDB",
      "Microservices",
      "Monitoring",
      "Smart Contracts",
      "Blockchain Automation",
      "SCRUM",
    ],
    text: defenderProjectText,
    title: "OpenZeppelin Defender",
    website: "https://docs.openzeppelin.com/defender",
    websiteLabel: "View docs",
  },
  leWagon: {
    imageLabel: "Le Wagon teaching preview",
    image: "/static/images/leWagon.png",
    techStack: ["Teaching", "Mentoring"],
    text: leWagonProjectText,
    title: "Le Wagon",
    website: "https://www.lewagon.com/",
    websiteLabel: "Visit site",
  },
  shareIn: {
    imageLabel: "Share In app preview",
    githubRepository: "https://github.com/CoveMB/Rails-Share-in-App",
    image: "/static/images/shareIn.png",
    techStack: ["Rails", "JavaScript", "WebSockets", "Real-Time Chat"],
    text: shareInProjectText,
    title: "Share In",
    website: "https://ruby-share-in-app.herokuapp.com/",
    websiteLabel: "View project",
  },
  spockee: {
    imageLabel: "Spockee platform preview",
    image: "/static/images/spockee.svg",
    techStack: [
      "TypeScript",
      "WebSockets",
      "Docker",
      "Terraform",
      "AWS",
      "CLI Tooling",
      "VSCode Extension",
      "CI/CD",
      "Scrum",
    ],
    text: spockeeProjectText,
    title: "Spockee",
    website: "https://skeepers.io/en/live-shopping/",
    websiteLabel: "Visit site",
  },
  suiTooling: {
    imageLabel: "Sui tooling project preview",
    githubRepository:
      "https://github.com/OpenZeppelin/openzeppelin-sui-marketplace",
    image: "/static/images/suiTooling.svg",
    techStack: [
      "TypeScript",
      "Move",
      "React",
      "Sui",
      "Smart Contracts",
      "Deployment Tooling",
      "Contract Calls Automation",
      "Test Harness",
      "Developer Experience",
    ],
    text: suiToolingProjectText,
    title: "Sui Marketplace Tooling",
    website: "https://www.sui.io/",
    websiteLabel: "View ecosystem",
  },
  tooly: {
    imageLabel: "Tooly product preview",
    image: "/static/images/tooly.png",
    techStack: [
      "TypeScript",
      "Node",
      "React",
      "GraphQL",
      "Machine Learning",
      "Architecture",
      "Product",
      "Docker",
      "Next AI",
    ],
    text: toolyProjectText,
    title: "Tooly",
    website: "https://www.nextcanada.com/next-ai/",
    websiteLabel: "Visit program",
  },
};

const parallaxDataBySide = {
  left: parallaxDataProjectLeft,
  right: parallaxDataProjectRight,
};

const renderProjectBody = ({ details, projectName, side }) => {
  const projectImage = (
    <div className="project-image-n-details">
      <ProjectImage
        imageAlt={details.imageLabel}
        primaryHref={details.website}
        primaryLabel={details.websiteLabel}
        projectImage={details.image}
        projectName={projectName}
        projectTitle={details.title}
        side={side}
        sourceHref={details.githubRepository}
        techStack={details.techStack}
      />
    </div>
  );

  if (side === "left") {
    return (
      <div className="makeItFlex ongoingRow">
        {projectImage}
        {details.text}
      </div>
    );
  }

  return (
    <div className="makeItFlex ongoingRow">
      {details.text}
      {projectImage}
    </div>
  );
};

export default function Project({ projectName, side }) {
  const projectDetails = projectDetailsByName[projectName];

  if (!projectDetails) {
    return null;
  }

  return (
    <ScrollParallax
      className="parallaxTitle"
      parallaxData={parallaxDataBySide[side]}
    >
      <>
        <hr className="ongoingSeparator" />
        {renderProjectBody({ details: projectDetails, projectName, side })}
      </>
    </ScrollParallax>
  );
}
