import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import uuidv4 from 'uuid';

import { dateToString } from '@utils/helpers';
import { categoriesToJSX } from '@utils/jsxHelpers';

import { Layout } from '@components/layout';
import * as styles from '@styles/article.module.css';

function ArticleList({ data, pageContext: { pageTitle, articles } }) {
  const siteMeta = data.site.siteMetadata;
  const helmetTitle = pageTitle === ''
    ? `${siteMeta.title} – ${siteMeta.motto}`
    : `${pageTitle} – ${siteMeta.title}`;

  const articlePreviews = articles.map(article => {
    const thumbnail = article.images.find(image => image.name === 'index').data;
    const categories = categoriesToJSX(article.info.categories);
    const date = dateToString(new Date(article.info.date));

    return (
      <article key={uuidv4()} className={styles.article}>
        <div className={styles.preview}>
          <Link to={`/${article.info.slug}/`}>
            <GatsbyImage image={thumbnail} alt={article.info.title} />
            <h1 className={styles.title}>{article.info.title}</h1>
          </Link>
          <div className={styles.metadata}>de {article.info.author} | {date} | {categories}</div>
          <p>{article.info.excerpt}</p>
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
      </Layout>
    </>
  );
}

export default ArticleList;

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
