import { Fragment } from "react";
import { projectNarrativeTextById } from "../../content/projectTexts";

const emphasisExpression = /(\*\*.*?\*\*)/g;
const caseStudySectionLabels = {
  build: "Build",
  context: "Context",
  outcome: "Outcome",
};

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

export const renderProjectRichText = (text, keyPrefix) =>
  text
    .split(emphasisExpression)
    .filter(Boolean)
    .map((segment, segmentIndex) =>
      renderTextSegment(segment, keyPrefix, segmentIndex),
    );

const createCaseStudySection = (id, text) => ({
  id,
  label: caseStudySectionLabels[id],
  text,
});

const createCaseStudySections = ({ build, context, outcome }) => [
  createCaseStudySection("context", context),
  createCaseStudySection("build", build),
  createCaseStudySection("outcome", outcome),
];

const buildPlainText = ({ sections, summary }) =>
  [
    summary,
    ...sections.map(({ text }) => removeEmphasisMarkers(text)),
  ].join(" ");

const createProjectCaseStudy = ({ build, context, outcome, summary }) => {
  const sections = createCaseStudySections({
    build,
    context,
    outcome,
  });

  return {
    plainText: buildPlainText({ sections, summary }),
    sections,
    summary,
  };
};

const buildProjectCaseStudiesById = (allProjectNarrativeText) =>
  Object.fromEntries(
    Object.entries(allProjectNarrativeText).map(([projectId, narrativeText]) => [
      projectId,
      createProjectCaseStudy(narrativeText),
    ]),
  );

export const projectCaseStudiesById = buildProjectCaseStudiesById(
  projectNarrativeTextById,
);
