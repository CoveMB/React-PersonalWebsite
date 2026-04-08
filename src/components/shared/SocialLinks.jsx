import { socialLinks } from "../../utils/profile";

const renderSocialLink = (
  { alt, href, imagePath, rel, style, target },
  imageClassName,
  linkClassName,
) => (
  <a
    aria-label={alt}
    className={linkClassName}
    href={href}
    key={href}
    rel={rel}
    style={style}
    target={target}
  >
    <img alt={alt} className={imageClassName} src={imagePath} />
  </a>
);

export default function SocialLinks({
  imageClassName,
  linkClassName,
  links = socialLinks,
}) {
  return links.map((link) =>
    renderSocialLink(link, imageClassName, linkClassName)
  );
}
