import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import * as styles from './SearchForm.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function SearchForm({ searchRef, toggleSearch, searching, setResults }) {
  const articles = useStaticQuery(
    graphql`
      query SearchFormQuery {
        allExplicitArticle(sort: {fields: date, order: DESC}) {
          edges {
            node {
              title
              slug
            }
          }
        }
      }
    `
  ).allExplicitArticle.edges.map(edge => ({
    title: edge.node.title.replace(/[$\\]/g, ''),
    slug: edge.node.slug
  }));

  const cleanUp = str => {
    return str
      .toLowerCase()
      .replace(/ă/g, 'a')
      .replace(/â/g, 'a')
      .replace(/î/g, 'i')
      .replace(/ș/g, 's')
      .replace(/ț/g, 't');
  };

  const [inputValue, setInputValue] = React.useState('');
  const search = value => {
    if (value === '') return [];
    const results = [];
    for (const article of articles) {
      const pos = cleanUp(article.title).indexOf(cleanUp(value));
      if (pos !== -1) {
        results.push({
          ...article,
          beg: pos,
          end: pos + value.length
        });
        if (results.length === 5) break;
      }
    }
    return results;
  };

  const handleChange = event => {
    const value = event.target.value.toLowerCase();
    setInputValue(value);
    setResults(search(value));
  };

  return (
    <>
      <form
        className={styles.searchForm + (searching ? ' ' + styles.searching : '')}
        onSubmit={event => { event.preventDefault(); }}
      >
        <input
          ref={searchRef}
          type="search"
          placeholder="Caută…"
          value={inputValue}
          onChange={handleChange}
        />
        <button
          onClick={event => { toggleSearch(); event.preventDefault(); }}
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
    </>
  );
};
