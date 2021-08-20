import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import uuidv4 from 'uuid';

import * as styles from '@styles/article.module.css';
import * as stylesExplicit from '@styles/explicit.module.css';

import { Pagination } from '@components/others';
import { Layout } from '@components/layout';

import { getExcerpt } from '@explicit/renderer';
import { categoriesToJSX } from '@utils/jsxHelpers';

export default function ArticleList({ data, pageContext: { pageTitle, articles, olderPage, newerPage } }) {
  const siteMeta = data.site.siteMetadata;
  const helmetTitle = pageTitle === ''
    ? `${siteMeta.title} – ${siteMeta.motto}`
    : `${pageTitle} – ${siteMeta.title}`;

  const articlePreviews = articles.map((article, index) => {
    const thumbnail = article.media.images.find(image => image.name === 'index')?.data;
    const categories = categoriesToJSX(article.categories);
    return (
      <article key={uuidv4()} style={{ marginBottom: '2rem' }}>
        <div className={styles.preview}>
          <Link to={`/${article.slug}/`}>
            {thumbnail && <GatsbyImage image={thumbnail} alt={article.title} loading={index > 0 ? "lazy" : "eager"} />}
            <h1 className={styles.title}>{article.title}</h1>
          </Link>
          <div className={styles.metadata}>de {article.author} | {article.date} | {categories}</div>
        </div>
        <div className={stylesExplicit.explicit}>
          {getExcerpt(article)}
        </div>
      </article>
    );
  });

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
        <Pagination
          olderPage={olderPage}
          newerPage={newerPage}
        />
      </Layout>
    </>
  );
};

export const pageQuery = graphql`
  query ArticleListQuery {
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
