import React from 'react';
import { Link } from 'gatsby';
import uuidv4 from 'uuid';

import slugify from '@utils/slugify';
import renderExplicit from '@utils/renderExplicit';

import { GatsbyImage } from 'gatsby-plugin-image';
import * as styles from './Article.module.css';

function Article({ info, images, displayFull }) {
  const infoDate = new Date(info.date);
  const dateDD = infoDate.getDate().toString().padStart(2, '0');
  const dateMM = (infoDate.getMonth() + 1).toString().padStart(2, '0');
  const dateYY = infoDate.getFullYear();
  const date = `${dateDD}/${dateMM}/${dateYY}`;

  const thumbnail = images.find(image => image.name === 'index').data;

  const categories = info.categories.map((category, index) =>
    <React.Fragment key={uuidv4()}>
      {index > 0 ? ', ' : ''}
      <Link to={`/category/${slugify(category)}/`}>
        {category}
      </Link>
    </React.Fragment>
  );

  if (displayFull) {
    return (
      <article className={styles.article}>
        <div className={styles.preview}>
          <GatsbyImage image={thumbnail} alt={info.title} />
          <h1 className={styles.title}>{info.title}</h1>
          <div className={styles.metadata}>
            de {info.author} | {date} | {categories}
          </div>
        </div>
        <div className={styles.content}>
          {renderExplicit(info.content)}
        </div>
      </article>
    );
  }
  else {
    return (
      <article className={styles.article}>
        <div className={styles.preview}>
          <Link to={info.slug}>
            <GatsbyImage image={thumbnail} alt={info.title} />
            <h1 className={styles.title}>{info.title}</h1>
          </Link>
          <div className={styles.metadata}>
            de {info.author} | {date} | {categories}
          </div>
          <p>{info.excerpt}</p>
        </div>
      </article>
    );
  }
}

export default Article;
