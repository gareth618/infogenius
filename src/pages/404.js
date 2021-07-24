import React from 'react';
import { Helmet } from 'react-helmet';
import { Layout } from '@components/layout';

function HomePage() {
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>Pagină negăsită! – InfoGenius</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>
      <Layout displaySidebar={false}>
        <h1 style={{
          margin: 0,
          fontSize: "10rem",
          fontFamily: "'Merriweather', serif",
          textAlign: "center",
          color: "var(--title)"
        }}>
          404
        </h1>
      </Layout>
    </>
  );
}

export default HomePage;
