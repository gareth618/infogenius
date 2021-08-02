import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import { Layout } from '@components/layout';

export default function NotFoundPage({ data }) {
  const title = data.site.siteMetadata.title;
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>Pagină negăsită! – {title}</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>
      <Layout>
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
};

export const pageQuery = graphql`
  query GetTitle {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
