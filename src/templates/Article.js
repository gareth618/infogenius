import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import uuidv4 from 'uuid';

import * as styles from '@styles/article.module.css';
import * as stylesExplicit from '@styles/explicit.module.css';

import render from '@explicit/renderer';
import { slugify } from '@utils/helpers';
import { categoriesToJSX } from '@utils/jsxHelpers';

import { Layout } from '@components/layout';
import { Donations } from '@components/others';

export default function Article({ data, pageContext: article }) {
  const siteTitle = data.site.siteMetadata.title;
  const thumbnail = article.media.images.find(image => image.name === 'index')?.data;
  const categories = categoriesToJSX(article.categories);

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{article.title} – {siteTitle}</title>
        <meta name="description" content={article.description} />
        <meta name="keywords" content={article.tags.join(', ')} />
        <meta name="author" content={article.author} />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>

      <Layout displaySidebar>
        <article>
          <div className={styles.preview}>
            {thumbnail && <GatsbyImage image={thumbnail} alt={article.title} loading="eager" />}
            <h1 className={styles.title}>{article.title}</h1>
            <div className={styles.metadata}>de {article.author} | {article.date} | {categories}</div>
          </div>
          <div className={stylesExplicit.explicit} style={{ marginTop: '2rem' }}>
            {render(article.content, article.media)}
          </div>
        </article>

        <ul className={styles.tags}>
          {article.tags.map(tag => (
            <li key={uuidv4()}>
              <Link to={`/tag/${slugify(tag)}/`}>
                {tag}
              </Link>
            </li>
          ))}
        </ul>

        <Donations />
      </Layout>
    </>
  );
};

export const pageQuery = graphql`
  query ArticleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
