import React from 'react';
import uuidv4 from 'uuid';

import { graphql, useStaticQuery, Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import * as styles from './Article.module.css';

function Article({ metadata, display }) {
  const thumbnail = useStaticQuery(
    graphql`
      query {
        file(relativePath: {eq: "trie.png"}) {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: NONE
              formats: WEBP
            )
          }
        }
      }
    `
  ).file.childImageSharp.gatsbyImageData;

  const categories = metadata.categories.map((categ, index) =>
    <React.Fragment key={uuidv4()}>
      {index > 0 ? ', ' : ''}
      <Link to={categ.slug}>
        {categ.name}
      </Link>
    </React.Fragment>
  );

  const thumbnailAndTitle =
    <>
      <GatsbyImage image={thumbnail} alt={metadata.title} />
      <h1 className={styles.title}>{metadata.title}</h1>
    </>;

  return (
    <article className={styles.article}>
      {display === 'preview'
        ? <Link to={metadata.slug}>{thumbnailAndTitle}</Link>
        : thumbnailAndTitle}
      <div className={styles.metadata}>
        de {metadata.author} | {metadata.date} | {categories}
      </div>
      {display === 'preview'
        ? <div className={styles.content}><p>{metadata.excerpt}</p></div>
        : <div
            className={styles.content}
            style={{ marginTop: '2rem', marginBottom: 'min(-6%, -1.5rem)' }}
            dangerouslySetInnerHTML={{ __html: metadata.content }}
          />}
    </article>
  );
}

export default Article;
