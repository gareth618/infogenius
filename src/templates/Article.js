import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

import render from '@utils/explicit';
import { dateToString } from '@utils/helpers';
import { categoriesToJSX } from '@utils/jsxHelpers';

import { Layout } from '@components/layout';
import * as styles from '@styles/article.module.css';

function Article({ data, pageContext: { info, images } }) {
  const siteTitle = data.site.siteMetadata.title;
  const thumbnail = images.find(image => image.name === 'index').data;
  const categories = categoriesToJSX(info.categories);
  const date = dateToString(new Date(info.date));

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{info.title} – {siteTitle}</title>
        <meta name="description" content={info.excerpt} />
        <meta name="keywords" content={info.tags.join(', ')} />
        <meta name="author" content={info.author} />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>

      <Layout displaySidebar>
        <article className={styles.article}>
          <div className={styles.preview}>
            <GatsbyImage image={thumbnail} alt={info.title} />
            <h1 className={styles.title}>{info.title}</h1>
            <div className={styles.metadata}>de {info.author} | {date} | {categories}</div>
          </div>
          <div className={styles.content}>
            {render(info.content, images)}
          </div>
        </article>
      </Layout>
    </>
  );
}

export default Article;

export const pageQuery = graphql`
  query ArticleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
