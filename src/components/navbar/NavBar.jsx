import NavBrand from "./NavBrand";
import { navigationItems } from "../../navigation/navigationModel";
import { useStore } from "../../store/useStore";

const getNavigationButtonClassName = (isActive) =>
  isActive ? "navbarLink navbarLinkActive" : "navbarLink";

const renderNavigationItem = ({ ariaLabel, id, label }, dispatch, position) => (
  <button
    aria-current={id === position ? "location" : undefined}
    aria-label={ariaLabel}
    className={getNavigationButtonClassName(id === position)}
    key={id}
    onClick={() => dispatch("GO_TO_REF", id)}
    type="button"
  >
    {label}
  </button>
);

export default function NavBar() {
  const [ state, dispatch ] = useStore();
  const navigationClassName =
    state.position === "top" ? "navbar navbarAtTop" : "navbar navbarScrolled";

  return (
    <nav className={navigationClassName}>
      <div className="navbarShell">
        <NavBrand />
        <div className="navbarLinks">
          {navigationItems.map((navigationItem) =>
            renderNavigationItem(navigationItem, dispatch, state.position)
          )}
        </div>
      </div>
    </nav>
  );
}
