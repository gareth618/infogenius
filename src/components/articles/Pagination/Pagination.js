import React from 'react';
import { Link } from 'gatsby';
import * as styles from './Pagination.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

function Pagination({ older, newer }) {
  if (!older && !newer) {
    return <div style={{ marginTop: 'min(-6%, -1.5rem)' }} />;
  }

  const olderLink =
    <div className={styles.older} style={{ visibility: older ? 'visible' : 'hidden' }}>
      <Link to="/page/3">
        <FontAwesomeIcon icon={faAngleDoubleLeft} />
        <span className={styles.small}>Older</span>
        <span className={styles.large}>Articole mai vechi</span>
      </Link>
    </div>;

  const newerLink =
    <div className={styles.newer} style={{ visibility: newer ? 'visible' : 'hidden' }}>
      <Link to="/page/1">
        <span className={styles.small}>Newer</span>
        <span className={styles.large}>Articole mai noi</span>
        <FontAwesomeIcon icon={faAngleDoubleRight} />
      </Link>
    </div>;

  return (
    <div className={styles.pagination}>
      {olderLink}
      {newerLink}
    </div>
  );
}

export default Pagination;
