import React from 'react';
import * as styles from './BurgerButton.module.css';

export default function BurgerButton({ clicked, onClick }) {
  return (
    <button
      className={styles.burgerBtn + (clicked ? ' ' + styles.clicked : '')}
      onClick={onClick}
      type="button"
      aria-label="dropdown"
    >
      <div className={styles.bar1} />
      <div className={styles.bar2} />
      <div className={styles.bar3} />
    </button>
  );
};
