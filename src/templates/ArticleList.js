import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import uuidv4 from 'uuid';

import { Layout } from '@components/layout';
import { Article } from '@components/articles';

function ArticleList({ pageContext, data }) {
  const siteMeta = data.site.siteMetadata;
  const helmetTitle = pageContext.homePage
    ? `${siteMeta.title} – ${siteMeta.motto}`
    : `${pageContext.title} – ${siteMeta.title}`;

  const articlePreviews = pageContext.articlePreviews.map(entry =>
    <Article
      key={uuidv4()}
      info={entry.info}
      images={entry.images}
    />
  );

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{helmetTitle}</title>
        <meta name="description" content={siteMeta.description} />
        <meta name="keywords" content={siteMeta.keywords.join(', ')} />
        <meta name="author" content={siteMeta.author} />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>
      <Layout displaySidebar>
        {articlePreviews}
      </Layout>
    </>
  );
}

export default ArticleList;

export const pageQuery = graphql`
  query HomePageQuery {
    site {
      siteMetadata {
        title
        motto
        author
        description
        keywords
      }
    }
  }
`;
