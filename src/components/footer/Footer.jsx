import {
  profileAvailability,
  profileLocation,
  profileTimezone,
  resumeDownloadName,
  resumeFilePath,
} from "../../utils/profile";
import SocialLinks from "../shared/SocialLinks";

const footerActionLinks = [
  {
    className: "footerActionLink footerActionPrimary",
    download: resumeDownloadName,
    href: resumeFilePath,
    label: "Resume",
  },
];

const footerMetaItems = [profileLocation, profileTimezone];

const footerNotes = ["Built with Next.js, and GSAP."];

const renderActionLink = ({
  className,
  download,
  href,
  label,
  rel,
  target,
}) => (
  <a
    className={className}
    download={download}
    href={href}
    key={label}
    rel={rel}
    target={target}
  >
    {label}
  </a>
);

const renderFooterMetaItem = (item) => (
  <li className="footerMetaItem" key={item}>
    {item}
  </li>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footerShell">
        <div className="footerLead">
          <h2 className="footerTitle">
            Building reliable product and developer tooling.
          </h2>
          <br />
          <ul className="footerMeta">
            {footerMetaItems.map(renderFooterMetaItem)}
          </ul>
        </div>
        <div className="footerActions">
          <p className="footerConnect">{profileAvailability}</p>
          <p className="footerConnect"> let's connect:</p>
          <div className="footerIconLinks">
            <SocialLinks
              imageClassName="svgFooter"
              linkClassName="footerIconLink"
            />
            {footerActionLinks.map(renderActionLink)}
          </div>
        </div>
      </div>
      <div className="footerBottom">
        <p className="footerCopyright">
          &copy; {currentYear} Cove Marquis-Bortoli. All rights reserved.
        </p>
        <div className="footerNotes">
          {footerNotes.map((note) => (
            <p className="footerNote" key={note}>
              {note}
            </p>
          ))}
        </div>
      </div>
    </footer>
  );
}
