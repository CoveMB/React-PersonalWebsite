import { navigationItems } from "../../navigation/navigationModel";
import { useStore } from "../../store/useStore";

const getNavigationButtonClassName = (isActive) =>
  isActive
    ? "sectionDotNavigationButton sectionDotNavigationButtonActive"
    : "sectionDotNavigationButton";

const renderNavigationItem = ({ ariaLabel, id, label }, dispatch, position) => {
  const isActive = id === position;

  return (
    <div className="sectionDotNavigationItem" key={id}>
      <span className="sectionDotNavigationLabel">{label}</span>
      <button
        aria-current={isActive ? "location" : undefined}
        aria-label={ariaLabel}
        className={getNavigationButtonClassName(isActive)}
        onClick={() => dispatch("GO_TO_REF", id)}
        type="button"
      />
    </div>
  );
};

export default function DotNavigation() {
  const [ state, dispatch ] = useStore();

  return (
    <nav aria-label="Section navigation" className="sectionDotNavigation">
      {navigationItems.map((navigationItem) =>
        renderNavigationItem(navigationItem, dispatch, state.position)
      )}
    </nav>
  );
}
