import { siteSections } from "../content/siteContent";

export const navigationItems = siteSections.map(
  ({ id, navigationAriaLabel, navigationLabel }) => ({
    ariaLabel: navigationAriaLabel,
    id,
    label: navigationLabel,
  }),
);

const sectionViewportRatio = 0.4;

export const getCurrentSection = ({
  currentPosition,
  refsOffsets,
  viewportHeight,
}) => {
  if (!refsOffsets) {
    return "top";
  }

  const viewportCheckpoint =
    currentPosition + viewportHeight * sectionViewportRatio;

  return navigationItems.reduce((currentSection, { id }) => {
    const sectionOffset = refsOffsets[id] ?? 0;

    if (viewportCheckpoint >= sectionOffset) {
      return id;
    }

    return currentSection;
  }, "top");
};

export const getScrollTargetOffset = ({ refsOffsets, sectionName }) => {
  const sectionOffset = refsOffsets?.[sectionName] ?? 0;

  if (sectionName === "top") {
    return 0;
  }

  return Math.max(sectionOffset - 30, 0);
};
