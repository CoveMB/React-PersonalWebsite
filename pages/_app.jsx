import React from "react";
import App from "next/app";
import { DefaultSeo } from 'next-seo';
import Head from 'next/head';

import WithGtmScript from '../src/components/hoc/WithGtmScript';

import SEO from '../next-seo.config';

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
        <DefaultSeo {...SEO} />
        <Head>
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        </Head>
        <Component {...pageProps} />
      </WithGtmScript>
    );
  }
}

export default MyApp;
