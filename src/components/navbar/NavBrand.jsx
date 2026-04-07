import { useStore } from "../../store/useStore";

export default function NavBrand() {
  const [ , dispatch ] = useStore();

  return (
    <button className="normalizeBtn" onClick={() => dispatch("GO_TO_REF", "top")} type="button">
      <img alt="avatar logo" className="navBrand" height="52" src="/static/images/avatar.jpg" width="52" />
    </button>
  );
}
