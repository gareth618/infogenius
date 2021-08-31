import React from 'react';
import uuidv4 from 'uuid';

import { slugify } from '@utils/helpers';
import { graphql, useStaticQuery, Link } from 'gatsby';

import Logo from '@assets/logo.svg';
import * as stylesHeader from './header.module.css';
import * as stylesNavbar from './navbar.module.css';
import * as stylesCategs from './categs.module.css';
import * as stylesNavBtn from './navbtn.module.css';

import { SearchForm } from '@components/forms';
import { ScrollButton } from '@components/buttons';
import { ThemesButton } from '@components/buttons';
import { SearchButton } from '@components/buttons';
import { BurgerButton } from '@components/buttons';

export default function Header({ pageContainerRef }) {
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

  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    window.onscroll = () => setScrolled(document.documentElement.scrollTop > 80);
    setTimeout(window.onscroll, 0);
  }, []);
  const [droppedDown, setDroppedDown] = React.useState(false);

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

  const categoriesLarge = categories.map(categ => (
    <li key={uuidv4()}>
      <Link to={`/category/${slugify(categ.name)}/`}>
        <span className={stylesCategs.medScreen}>{categ.shortName}</span>
        <span className={stylesCategs.bigScreen}>{categ.name}</span>
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

  const [results, setResults] = React.useState([]);
  const resultList = results.map(result => (
    <li key={uuidv4()}>
      <Link to={`/${result.slug}/`}>
        {result.title.slice(0, result.beg)}<span>{result.title.slice(result.beg, result.end)}</span>{result.title.slice(result.end)}
      </Link>
    </li>
  ));

  return (
    <>
      <header ref={headerRef} className={stylesHeader.header + (scrolled ? ' ' + stylesHeader.scrolled : '')}>
        <div className={stylesNavbar.logoContainer}>
          <Link to="/">
            <img src={Logo} alt="home" draggable="false" />
          </Link>
          <span>v2.0</span>
        </div>

        <div className={stylesNavbar.navContainer}>
          <SearchForm
            searchRef={searchRef}
            toggleSearch={toggleSearch}
            searching={searching}
            setResults={setResults}
          />
          <nav className={stylesNavbar.navbar + (searching ? ' ' + stylesNavbar.searching : '')}>
            <ul className={stylesCategs.categoriesLarge}>
              {categoriesLarge}
            </ul>
            <div className={stylesNavBtn.navButtons}>
              <ScrollButton right={scrolled ? '0' : '-4%'} />
              <ThemesButton pageContainerRef={pageContainerRef} />
              <SearchButton onClick={toggleSearch} />
              <BurgerButton onClick={() => { setDroppedDown(!droppedDown); }} clicked={droppedDown} />
            </div>
          </nav>
        </div>
      </header>

      <ul className={stylesCategs.categoriesSmall} style={{
        top: `calc(${scrolled ? 60 : 80}px - ${droppedDown ? 0 : 3.2 * categories.length}rem)`,
        boxShadow: droppedDown ? '0 0 10px -10px rgba(0, 0, 0, .3)' : 'none'
      }}>
        {categoriesSmall}
      </ul>

      <ul className={stylesCategs.results} style={{
        top: `calc(${scrolled ? 60 : 80}px - ${searching ? 0 : 20}rem)`,
        boxShadow: searching ? '0 0 10px -10px rgba(0, 0, 0, .3)' : 'none'
      }}>
        {resultList}
      </ul>
    </>
  );
};
