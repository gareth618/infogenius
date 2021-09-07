import React from 'react';
import { Search } from '@utils/icons';
import * as styles from './SearchButton.module.css';

export default function SearchButton({ onClick }) {
  return (
    <button
      className={styles.searchBtn}
      onClick={onClick}
      type="button"
      aria-label="search"
    >
      <Search />
    </button>
  );
};
