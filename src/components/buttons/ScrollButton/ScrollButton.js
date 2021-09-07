import React from 'react';
import { Scroll } from '@utils/icons';
import * as styles from './ScrollButton.module.css';

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
      <Scroll />
    </button>
  );
};
