const siteUrl = "https://cove-marquis-bortoli.xyz";
const canonicalUrl = `${siteUrl}/`;
const fullName = "Cove Marquis-Bortoli";
const roleTitle = "Senior Full Stack Blockchain Developer";
const defaultTitle = `${roleTitle} | ${fullName}`;
const siteName = `${fullName} Portfolio`;
const themeColor = "#52021b";
const description = "Portfolio of Cove Marquis-Bortoli, a senior full stack blockchain developer building secure products across blockchain, web, AI, and developer tooling.";
const keywords = [
  fullName,
  roleTitle,
  "full stack developer",
  "blockchain developer",
  "OpenZeppelin",
  "React",
  "Next.js",
  "developer tooling",
  "smart contracts",
  "AI projects",
];

const createAbsoluteUrl = (path) => `${siteUrl}${path}`;

const openGraphImages = [
  {
    url: createAbsoluteUrl("/static/images/header-min.jpg"),
    width: 3183,
    height: 2045,
    alt: "Portfolio header artwork for Cove Marquis-Bortoli",
    type: "image/jpeg",
  },
  {
    url: createAbsoluteUrl("/static/images/avatar.jpg"),
    width: 2210,
    height: 2209,
    alt: "Portrait of Cove Marquis-Bortoli",
    type: "image/jpeg",
  },
];

const iconLinks = {
  icon: [
    {
      url: "/static/images/favicon.ico",
    },
    {
      url: "/static/icons/favicon-32x32-dunplab-manifest-6031.png",
      sizes: "32x32",
      type: "image/png",
    },
    {
      url: "/static/icons/favicon-16x16-dunplab-manifest-6031.png",
      sizes: "16x16",
      type: "image/png",
    },
  ],
  apple: [
    {
      url: "/static/icons/apple-icon-180x180-dunplab-manifest-6031.png",
      sizes: "180x180",
      type: "image/png",
    },
  ],
};

export const siteMetadata = {
  canonicalUrl,
  description,
  fullName,
  keywords,
  openGraphImages,
  roleTitle,
  siteName,
  siteUrl,
  themeColor,
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${fullName}`,
  },
  description,
  applicationName: siteName,
  authors: [
    {
      name: fullName,
      url: canonicalUrl,
    },
  ],
  creator: fullName,
  publisher: fullName,
  keywords,
  alternates: {
    canonical: canonicalUrl,
    languages: {
      "en-CA": canonicalUrl,
      "x-default": canonicalUrl,
    },
  },
  openGraph: {
    type: "profile",
    locale: "en_CA",
    url: canonicalUrl,
    title: defaultTitle,
    description,
    siteName,
    images: openGraphImages,
    firstName: "Cove",
    lastName: "Marquis-Bortoli",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
    images: openGraphImages.map(({ url }) => url),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      maxSnippet: -1,
      maxImagePreview: "large",
      maxVideoPreview: -1,
    },
  },
  icons: iconLinks,
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": themeColor,
    "msapplication-tap-highlight": "no",
    "theme-color": themeColor,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor,
};

export default siteMetadata;
