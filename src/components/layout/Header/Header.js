import React from 'react';
import uuidv4 from 'uuid';

import { slugify } from '@utils/helpers';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Logo from '@assets/logo.svg';
import * as stylesHeader from './header.module.css';
import * as stylesNavbar from './navbar.module.css';

import { SearchForm } from '@components/others';
import { ScrollButton } from '@components/buttons';
import { ThemesButton } from '@components/buttons';
import { SearchButton } from '@components/buttons';
import { BurgerButton } from '@components/buttons';

export default function Header() {
  const categories = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          categories {
            name
            shortName
          }
        }
      }
    }
  `).site.siteMetadata.categories;

  const [droppedDown, setDroppedDown] = React.useState(false);
  const toggleDroppedDown = () => setDroppedDown(!droppedDown);

  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    window.onscroll = () => setScrolled(document.documentElement.scrollTop > 80);
    setTimeout(window.onscroll, 0);
  }, []);

  const [searching, setSearching] = React.useState(false);
  const headerRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const toggleSearch = () => {
    const nowSearching = !searching;
    headerRef.current.classList.toggle(stylesHeader.disabled);
    setTimeout(() => {
      if (nowSearching) searchRef.current.focus();
      else searchRef.current.blur();
      headerRef.current.classList.toggle(stylesHeader.disabled);
    }, 1000);
    if (nowSearching) setDroppedDown(false);
    setSearching(nowSearching);
  };

  const [results, setResults] = React.useState([]);
  const resultList = results.map(result => (
    <li key={uuidv4()}>
      <Link to={`/${result.slug}/`}>
        {result.title.slice(0, result.beg)}<span>{result.title.slice(result.beg, result.end)}</span>{result.title.slice(result.end)}
      </Link>
    </li>
  ));

  const categoriesLarge = categories.map(categ => (
    <li key={uuidv4()}>
      <Link to={`/category/${slugify(categ.name)}/`}>
        <span className={stylesNavbar.medScreen}>{categ.shortName}</span>
        <span className={stylesNavbar.bigScreen}>{categ.name}</span>
      </Link>
    </li>
  ));
  const categoriesSmall = categories.map(categ => (
    <li key={uuidv4()}>
      <Link to={`/category/${slugify(categ.name)}/`}>
        {categ.name}
      </Link>
    </li>
  ));

  return (
    <>
      <div className={stylesHeader.headerContainer}>
        <header ref={headerRef} className={stylesHeader.header + (scrolled ? ' ' + stylesHeader.scrolled : '')}>
          <div className={stylesHeader.logoContainer}>
            <Link to="/">
              <img src={Logo} alt="home" draggable="false" />
            </Link>
            <span>v2.1</span>
          </div>

          <div className={stylesHeader.navContainer}>
            <SearchForm
              searchRef={searchRef}
              toggleSearch={toggleSearch}
              searching={searching}
              setResults={setResults}
            />
            <nav className={stylesHeader.navbar + (searching ? ' ' + stylesHeader.searching : '')}>
              <ul className={stylesNavbar.categoriesLarge}>
                {categoriesLarge}
              </ul>
              <div className={stylesNavbar.navButtons}>
                <ScrollButton right={scrolled ? '0' : '-4%'} />
                <ThemesButton />
                <SearchButton onClick={toggleSearch} />
                <BurgerButton onClick={toggleDroppedDown} clicked={droppedDown} />
              </div>
            </nav>
          </div>
        </header>

        {searching && <ul className={stylesNavbar.results}>{resultList}</ul>}
      </div>

      <ul className={stylesNavbar.categoriesSmall} style={{
        top: `calc(${scrolled ? 60 : 80}px - ${droppedDown ? 0 : 3.2 * categories.length}rem)`,
        boxShadow: droppedDown ? '0 0 10px -10px rgba(0, 0, 0, .3)' : 'none'
      }}>
        {categoriesSmall}
      </ul>
    </>
  );
};
