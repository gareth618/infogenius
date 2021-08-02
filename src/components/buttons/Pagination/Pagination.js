import React from 'react';
import { Link } from 'gatsby';
import * as styles from './Pagination.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

export default function Pagination({ olderPage, newerPage }) {
  if (olderPage == null && newerPage == null) {
    return <div style={{ marginTop: '-2rem' }} />;
  }

  const olderLink = (
    <div className={styles.older} style={{ visibility: olderPage == null ? 'hidden' : 'visible' }}>
      <Link to={olderPage}>
        <FontAwesomeIcon icon={faAngleDoubleLeft} />
        <span className={styles.small}>Older</span>
        <span className={styles.large}>Articole mai vechi</span>
      </Link>
    </div>
  );

  const newerLink = (
    <div className={styles.newer} style={{ visibility: newerPage == null ? 'hidden' : 'visible' }}>
      <Link to={newerPage}>
        <span className={styles.small}>Newer</span>
        <span className={styles.large}>Articole mai noi</span>
        <FontAwesomeIcon icon={faAngleDoubleRight} />
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
