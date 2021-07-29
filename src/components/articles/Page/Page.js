import React from 'react';
import renderExplicit from '@utils/renderExplicit';
import * as styles from './Page.module.css';

function Page({ info }) {
  return (
    <article>
      <h1 className={styles.title}>{info.title}</h1>
      <div className={styles.content}>
        {renderExplicit(info.content)}
      </div>
    </article>
  );
}

export default Page;
