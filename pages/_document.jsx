import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }


  render() {
    return (
      <Html>
        <Head>
          <link rel="shortcut icon" type="image/x-icon" href="/static/images/favicon.ico" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css" />

          <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
          <link rel="manifest" href="/static/manifest.json" />
          <link rel="mask-icon" href="/static/icons/safari-pinned-tab.svg" color="#5bbad5" />
          <link rel="shortcut icon" href="/static/icons/favicon.ico" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />


        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
