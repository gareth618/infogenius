import React from 'react';
import * as styles from './ScrollButton.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandPointUp } from '@fortawesome/free-solid-svg-icons';

export default function ScrollButton({ right }) {
  const scrollBack = () => {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      className={styles.scrollBtn}
      style={{ right }}
      onClick={scrollBack}
      type="button"
      aria-label="scroll back"
    >
      <FontAwesomeIcon
        className="fa-fw"
        icon={faHandPointUp}
        color="lawngreen"
      />
    </button>
  );
};
