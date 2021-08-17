import React from 'react';
import { Helmet } from 'react-helmet';
import { graphql, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import uuidv4 from 'uuid';

import * as styles from '@styles/article.module.css';
import * as stylesExplicit from '@styles/explicit.module.css';

import render from '@explicit/renderer';
import { slugify, dateToString } from '@utils/helpers';
import { categoriesToJSX } from '@utils/jsxHelpers';

import { Layout } from '@components/layout';
import { Donations } from '@components/others';

export default function Article({ data, pageContext }) {
  const siteTitle = data.site.siteMetadata.title;
  const thumbnail = pageContext.images.find(image => image.name === 'index').data;
  const categories = categoriesToJSX(pageContext.categories);
  const date = dateToString(new Date(pageContext.date));

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{pageContext.title} – {siteTitle}</title>
        <meta name="description" content={pageContext.description.replace(/--/g, '–').replace(/\.\.\./g, '…')} />
        <meta name="keywords" content={pageContext.tags.join(', ')} />
        <meta name="author" content={pageContext.author} />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>

      <Layout displaySidebar>
        <article>
          <div className={styles.preview}>
            <GatsbyImage image={thumbnail} alt={pageContext.title} loading="eager" />
            <h1 className={styles.title}>{pageContext.title}</h1>
            <div className={styles.metadata}>de {pageContext.author} | {date} | {categories}</div>
          </div>
          <div className={stylesExplicit.explicit} style={{ marginTop: '2rem' }}>
            {render(pageContext.content, {
              images: pageContext.images,
              videos: pageContext.videos,
              scripts: pageContext.scripts
            })}
          </div>
        </article>

        <ul className={styles.tags}>
          {pageContext.tags.map(tag => (
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
