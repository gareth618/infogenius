import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import { Layout } from '@components/layout';
import { Page } from '@components/articles';

function PagePage({ data }) {
  const siteTitle = data.site.siteMetadata.title;
  const pageInfo = data.explicitPage;

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{pageInfo.title} – {siteTitle}</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>
      <Layout displaySidebar>
        <Page info={pageInfo} />
      </Layout>
    </>
  );
}

export default PagePage;

export const pageQuery = graphql`
  query PageQuery($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    explicitPage(slug: {eq: $slug}) {
      title
      content
    }
  }
`;
