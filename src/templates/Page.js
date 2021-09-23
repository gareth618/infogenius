import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import { render } from '@explicit';
import { Layout } from '@components/layout';

export default function Page({ data, pageContext: page }) {
  const siteTitle = data.site.siteMetadata.title;
  return (
    <>
      <Helmet>
        <title>{page.title} – {siteTitle}</title>
      </Helmet>
      <Layout sidebar>
        <article>
          <h1 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--title)' }}>
            {render(page.title)}
          </h1>
          <div className="explicit" style={{ margin: '2rem 0 -1rem 0' }}>
            {render(page.content, page.media)}
          </div>
        </article>
      </Layout>
    </>
  );
};

export const pageQuery = graphql`
  query PageQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
