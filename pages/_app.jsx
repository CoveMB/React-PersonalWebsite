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
          <meta name="title" content="Benjamin Marquis" />
          <meta name="description" content="Find some of my last projects!" />
          <meta name="keywords" content="full-stack developer, machine learning, programming, developer, react, js, node, docker" />
          <meta name="robots" content="index, follow" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
          <meta name="language" content="English" />
          <meta property="og:title" content="Benjamin Marquis" />
          <meta property="og:site_name" content="benjaminmarquis.com - Find some of my projects!" />
          <meta property="og:url" content="https://benjaminmarquis.com/" />
          <meta property="og:description" content="Find some of my last Project!" />
          <meta property="og:type" content="profile" />
          <meta property="og:image" src="/static/images/ogimage.png" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="300" />
          <meta property="og:image:alt" content="A banner open graph image with a meeting image an my avatar" />
        </Head>
        <Component {...pageProps} />
      </WithGtmScript>
    );
  }
}

export default MyApp;
