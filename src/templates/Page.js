import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import { Layout } from '@components/layout';
import render from '@utils/explicit';
import { explicit } from '@styles/explicit.module.css';

function Page({ data, pageContext: { info, images } }) {
  const siteTitle = data.site.siteMetadata.title;
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{info.title} – {siteTitle}</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>
      <Layout displaySidebar>
        <article>
          <h1 style={{ margin: 0, fontSize: '1.9rem', color: 'var(--title)' }}>
            {info.title}
          </h1>
          <div className={explicit} style={{ margin: '2rem 0 -1rem 0' }}>
            {render(info.content, images)}
          </div>
        </article>
      </Layout>
    </>
  );
}

export default Page;

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
