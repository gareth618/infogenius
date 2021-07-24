import React from 'react';
import * as styles from './SearchForm.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function SearchForm({ innerRef, onClick, searching }) {
  return (
    <form className={styles.searchForm + (searching ? ' ' + styles.searching : '' )}>
      <input
        ref={innerRef}
        type="search"
        placeholder="Caută…"
      />
      <button
        onClick={event => { onClick(); event.preventDefault(); }}
        type="reset"
        aria-label="close search"
      >
        <FontAwesomeIcon
          className="fa-fw"
          icon={faTimes}
          color="papayawhip"
        />
      </button>
    </form>
  );
}

export default SearchForm;
