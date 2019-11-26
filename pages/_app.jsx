import React from "react";
import App from "next/app";
import Head from 'next/head';

import WithGtmScript from '../src/components/hoc/WithGtmScript';

import '../public/static/css/application.scss';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <WithGtmScript>
        <Head>
          <title>Benjamin Marquis</title>
        </Head>
        <Component {...pageProps} />
      </WithGtmScript>
    );
  }
}

export default MyApp;
