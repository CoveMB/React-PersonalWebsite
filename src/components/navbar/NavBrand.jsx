import {
  profileHeadline,
  profileName,
} from "../../utils/profile";
import { useStore } from "../../store/useStore";

export default function NavBrand() {
  const [ , dispatch ] = useStore();

  return (
    <button
      className="navBrandButton"
      onClick={() => dispatch("GO_TO_REF", "top")}
      type="button"
    >
      <img
        alt="avatar logo"
        className="navBrandAvatar"
        height="44"
        src="/static/images/avatar.jpg"
        width="44"
      />
      <span className="navBrandText">
        <span className="navBrandName">{profileName}</span>
        <span className="navBrandRole">{profileHeadline}</span>
      </span>
    </button>
  );
}
