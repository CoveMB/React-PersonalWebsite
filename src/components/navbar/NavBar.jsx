import NavBrand from "./NavBrand";
import { useStore } from "../../store/useStore";

export default function NavBar() {
  const [ state ] = useStore();
  const navigationClassName = state.position !== "top" ? "navbar" : "navbarHidden";

  return <div className={navigationClassName}>{state.position !== "top" ? <NavBrand /> : null}</div>;
}
