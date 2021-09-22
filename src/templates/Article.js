import React from 'react';
import uuidv4 from 'uuid';

import { Helmet } from 'react-helmet';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

import { render } from '@explicit';
import { slugify, sanitize } from '@utils/helpers';

import { Layout } from '@components/layout';
import { Donations } from '@components/others';
import { CommentContext } from '@components/comments';
import * as styles from '@styles/article.module.css';

export default function Article({ data, pageContext: article }) {
  const siteURL = data.site.siteMetadata.siteUrl;
  const siteTitle = data.site.siteMetadata.title;
  const cleanTitle = sanitize(article.title.replace(/[$\\]/g, '').replace(/`/g, ''));
  const thumbnail = article.media.images.find(image => image.name === 'index')?.data;
  const thumbnailURL = article.media.images.find(image => image.name === 'index')?.url;

  const categories = article.categories.map((category, index) => (
    <React.Fragment key={uuidv4()}>
      {index > 0 ? ', ' : ''}
      <Link to={`/category/${slugify(category)}/`}>{category}</Link>
    </React.Fragment>
  ));
  const tags = article.tags.map(tag => (
    <li key={uuidv4()}>
      <Link to={`/tag/${slugify(tag)}/`}>{tag}</Link>
    </li>
  ));

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{cleanTitle} – {siteTitle}</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.tags.join(', ')} />
        <meta name="author" content={article.author} />

        <meta property="og:title" content={cleanTitle} />
        <meta property="og:url" content={`${siteURL}/${article.slug}/`} />
        <meta property="og:image" content={`${siteURL}${thumbnailURL}`} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={article.description} />
        <meta property="og:locale" content="ro_RO" />

        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>

      <Layout sidebar>
        <article>
          <div className={styles.preview}>
            {thumbnail && <GatsbyImage image={thumbnail} alt={cleanTitle} loading="eager" />}
            <h1 className={styles.title}>{render(article.title)}</h1>
            <div className={styles.metadata}>de {article.author} | {article.date} | {categories}</div>
          </div>
          <div className="explicit" style={{ marginTop: '2rem' }}>
            {render(article.content, article.media)}
          </div>
        </article>
        <ul className={styles.tags}>{tags}</ul>
        <Donations />
        <CommentContext articleSlug={article.slug} />
      </Layout>
    </>
  );
};

export const pageQuery = graphql`
  query ArticleQuery {
    site {
      siteMetadata {
        title
        siteUrl
      }
    }
  }
`;
