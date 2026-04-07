import { GoogleTagManager } from "@next/third-parties/google";
import { metadata, viewport } from "../next-seo.config";
import "../public/static/css/application.scss";

export { metadata, viewport };

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="en-CA" className="scrollNoOverflow">
      <head>
        <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Lato|Lustria|Handlee&display=swap" rel="stylesheet" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.2/animate.min.css" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <GoogleTagManager gtmId="GTM-PJVMQR7" />
      </body>
    </html>
  );
}
