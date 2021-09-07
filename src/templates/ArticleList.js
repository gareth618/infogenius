import React from 'react';
import uuidv4 from 'uuid';

import { Helmet } from 'react-helmet';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

import { slugify } from '@utils/helpers';
import { render, renderExcerpt } from '@explicit';

import { Layout } from '@components/layout';
import { Pagination } from '@components/others';
import * as styles from '@styles/article.module.css';

export default function ArticleList({ data, pageContext: { pageTitle, articles, olderPage, newerPage } }) {
  const siteMeta = data.site.siteMetadata;
  const helmetTitle = pageTitle === ''
    ? `${siteMeta.title} – ${siteMeta.motto}`
    : `${pageTitle} – ${siteMeta.title}`;

  const articlePreviews = articles.map((article, index) => {
    const thumbnail = article.media.images.find(image => image.name === 'index')?.data;
    const categories = article.categories.map((category, index) => (
      <React.Fragment key={uuidv4()}>
        {index > 0 ? ', ' : ''}
        <Link to={`/category/${slugify(category)}/`}>{category}</Link>
      </React.Fragment>
    ));
    return (
      <article key={uuidv4()} style={{ marginBottom: '2rem' }}>
        <div className={styles.preview}>
          <Link to={`/${article.slug}/`}>
            {thumbnail && <GatsbyImage image={thumbnail} alt={article.title} loading={index > 0 ? "lazy" : "eager"} />}
            <h1 className={styles.title}>{render(article.title)}</h1>
          </Link>
          <div className={styles.metadata}>de {article.author} | {article.date} | {categories}</div>
        </div>
        <div className="explicit">
          {renderExcerpt(article.content, article.media)}
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
      <Layout sidebar>
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
