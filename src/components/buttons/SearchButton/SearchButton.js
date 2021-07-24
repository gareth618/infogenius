import React from 'react';
import * as styles from './SearchButton.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function SearchButton({ onClick }) {
  return (
    <button
      className={styles.searchBtn}
      onClick={onClick}
      type="button"
      aria-label="search"
    >
      <FontAwesomeIcon
        className="fa-fw"
        icon={faSearch}
        color="papayawhip"
      />
    </button>
  );
}

export default SearchButton;
