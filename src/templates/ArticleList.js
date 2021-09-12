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
  const siteURL = data.site.siteMetadata.siteUrl;
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
        {pageTitle === '' && <meta name="description" content={siteMeta.description} />}
        {pageTitle === '' && <meta name="keywords" content={siteMeta.keywords.join(', ')} />}
        {pageTitle === '' && <meta name="author" content={siteMeta.author} />}

        {pageTitle === '' && <meta property="og:title" content={siteMeta.title} />}
        {pageTitle === '' && <meta property="og:url" content={siteURL} />}
        {pageTitle === '' && <meta property="og:image" content="https://scontent.fias1-1.fna.fbcdn.net/v/t1.6435-9/195414240_146098597509238_4783600710085528272_n.png?_nc_cat=100&ccb=1-5&_nc_sid=e3f864&_nc_ohc=g2iTbZZnazwAX9OiO5k&_nc_ht=scontent.fias1-1.fna&oh=95ff6d29020c70fba3d32ef205a4b653&oe=61650AB9" />}
        {pageTitle === '' && <meta property="og:type" content="website" />}
        {pageTitle === '' && <meta property="og:description" content={siteMeta.description} />}
        {pageTitle === '' && <meta property="og:locale" content="ro_RO" />}

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
