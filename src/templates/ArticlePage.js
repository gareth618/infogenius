import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import { Layout } from '@components/layout';
import { Article } from '@components/articles';

function ArticlePage({ data }) {
  const siteTitle = data.site.siteMetadata.title;
  const articleInfo = data.explicitArticle;
  const articleImages = data.allFile.edges.map(edge => ({
    name: edge.node.name,
    data: edge.node.childImageSharp.gatsbyImageData
  }));

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{articleInfo.title} – {siteTitle}</title>
        <meta name="description" content={articleInfo.excerpt} />
        <meta name="keywords" content={articleInfo.tags.join(', ')} />
        <meta name="author" content={articleInfo.author} />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>
      <Layout displaySidebar>
        <Article
          displayFull
          info={articleInfo}
          images={articleImages}
        />
      </Layout>
    </>
  );
}

export default ArticlePage;

export const pageQuery = graphql`
  query ArticlePageQuery($slug: String!, $dirSlug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    explicitArticle(slug: {eq: $slug}) {
      title
      author
      date
      categories
      tags
      excerpt
      content
    }
    allFile(filter: {relativeDirectory: {eq: $dirSlug}, extension: {eq: "png"}}) {
      edges {
        node {
          name
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: NONE
              formats: WEBP
            )
          }
        }
      }
    }
  }
`;
