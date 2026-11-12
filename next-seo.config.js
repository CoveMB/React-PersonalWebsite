const siteUrl = "https://cove-marquis-bortoli.xyz";
const canonicalUrl = `${siteUrl}/`;
const fullName = "cove marquis-bortoli";
const roleTitle = "Senior Full-Stack Engineer & Technology Consultant";
const defaultTitle = `${roleTitle} | ${fullName}`;
const siteName = `${fullName} Portfolio`;
const themeColor = "#F8F8F8";
const description = "Portfolio of cove marquis-bortoli, a senior full-stack engineer and technology consultant working across software architecture, web applications, UX design, blockchain, developer tooling, and automation.";
const keywords = [
  fullName,
  roleTitle,
  "full stack developer",
  "technology consultant",
  "web application development",
  "user experience design",
  "Egeria Systems",
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
    alt: "Portfolio header artwork for cove marquis-bortoli",
    type: "image/jpeg",
  },
  {
    url: createAbsoluteUrl("/static/images/avatar.jpg"),
    width: 2210,
    height: 2209,
    alt: "Portrait of cove marquis-bortoli",
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
    firstName: "cove",
    lastName: "marquis-bortoli",
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
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default siteMetadata;
