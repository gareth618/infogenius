import React from 'react';
import * as styles from './BurgerButton.module.css';

export default function BurgerButton({ onClick }) {
  const [clicked, setClicked] = React.useState(false);
  return (
    <button
      className={styles.burgerBtn + (clicked ? ' ' + styles.clicked : '')}
      onClick={() => { onClick(); setClicked(!clicked); }}
      type="button"
      aria-label="dropdown"
    >
      <div className={styles.bar1} />
      <div className={styles.bar2} />
      <div className={styles.bar3} />
    </button>
  );
};
