import React from 'react';
import { Link } from 'gatsby';
import { Old, New } from '@utils/icons';
import * as styles from './Pagination.module.css';

export default function Pagination({ olderPage, newerPage }) {
  if (olderPage == null && newerPage == null) {
    return <div style={{ marginTop: '-2rem' }} />;
  }

  const olderLink = olderPage && (
    <div className={styles.older} style={{ visibility: olderPage == null ? 'hidden' : 'visible' }}>
      <Link to={olderPage}>
        <Old />
        <span className={styles.small}>Older</span>
        <span className={styles.large}>Articole mai vechi</span>
      </Link>
    </div>
  );

  const newerLink = newerPage && (
    <div className={styles.newer} style={{ visibility: newerPage == null ? 'hidden' : 'visible' }}>
      <Link to={newerPage}>
        <span className={styles.small}>Newer</span>
        <span className={styles.large}>Articole mai noi</span>
        <New />
      </Link>
    </div>
  );

  return (
    <div className={styles.pagination}>
      {olderLink}
      {newerLink}
    </div>
  );
};
