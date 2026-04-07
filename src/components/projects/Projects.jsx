import Project from "./Project";

const projects = [
  { projectName: "suiTooling", side: "left" },
  { projectName: "defender", side: "right" },
  { projectName: "astroLight", side: "left" },
  { projectName: "aldo", side: "right" },
  { projectName: "spockee", side: "left" },
  { projectName: "tooly", side: "right" },
  { projectName: "cominity", side: "left" },
  { projectName: "centech", side: "right" },
  { projectName: "leWagon", side: "left" },
  { projectName: "shareIn", side: "right" },
  { projectName: "airflow", side: "left" },
];

export default function Projects() {
  return (
    <>
      <p className="cardText ongoingIntro">
        <strong className="blueTitle"> Learn'N Build:</strong> During my personal
        and professional path I encounter different challenges. Learning new
        skills led me to turn them into opportunities and build real projects.
        Here are some of them sorted with most recent first:
      </p>
      {projects.map((project) => (
        <Project key={project.projectName} projectName={project.projectName} side={project.side} />
      ))}
    </>
  );
}
