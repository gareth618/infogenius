import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import uuidv4 from 'uuid';

import Logo from '@assets/brand/logo.svg';
import * as styleHeader from './header.module.css';
import * as styleNavbar from './navbar.module.css';
import * as styleCategs from './categs.module.css';
import * as styleNavBtn from './navbtn.module.css';

import { SearchForm } from '@components/forms';
import { ScrollButton } from '@components/buttons';
import { ThemesButton } from '@components/buttons';
import { SearchButton } from '@components/buttons';
import { BurgerButton } from '@components/buttons';

function Header({ pageContainerRef }) {
  const categories = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          categories {
            name
            shortName
            slug
          }
        }
      }
    }
  `).site.siteMetadata.categories;

  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const updateScrolled = () => {
      setScrolled(document.documentElement.scrollTop > 80);
    };
    window.onscroll = updateScrolled;
    setTimeout(updateScrolled, 0);
  }, []);

  const [droppedDown, setDroppedDown] = React.useState(false);
  const toggleDroppedDown = () => {
    setDroppedDown(!droppedDown);
  };

  const [searching, setSearching] = React.useState(false);
  const headerRef = React.useRef(null);
  const searchRef = React.useRef(null);
  const search = () => {
    const nowSearching = !searching;
    headerRef.current.classList.toggle(styleHeader.disabled);
    setTimeout(() => {
      if (nowSearching) {
        searchRef.current.focus();
      }
      else {
        searchRef.current.blur();
      }
      headerRef.current.classList.toggle(styleHeader.disabled);
    }, 1000);
    setSearching(nowSearching);
  };

  const categoriesLarge = categories.map(categ =>
    <li key={uuidv4()}>
      <Link to={categ.slug}>
        <span className={styleCategs.medScreen}>{categ.shortName}</span>
        <span className={styleCategs.bigScreen}>{categ.name}</span>
      </Link>
    </li>
  );
  const categoriesSmall = categories.map(categ =>
    <li key={uuidv4()}>
      <Link to={categ.slug}>
        {categ.name}
      </Link>
    </li>
  );

  return (
    <>
      <header ref={headerRef} className={styleHeader.header + (scrolled ? ' ' + styleHeader.scrolled : '')}>
        <div className={styleNavbar.logoContainer}>
          <Link to="/">
            <img src={Logo} alt="home" draggable="false" />
          </Link>
          <span>v2.0</span>
        </div>

        <div className={styleNavbar.navContainer}>
          <SearchForm
            innerRef={searchRef}
            onClick={search}
            searching={searching}
          />

          <nav className={styleNavbar.navbar + (searching ? ' ' + styleNavbar.searching : '')}>
            <ul className={styleCategs.categoriesLarge}>
              {categoriesLarge}
            </ul>

            <div className={styleNavBtn.navButtons}>
              <ScrollButton right={scrolled ? '0' : '-4%'} />
              <ThemesButton pageContainerRef={pageContainerRef} />
              <SearchButton onClick={search} />
              <BurgerButton onClick={toggleDroppedDown} />
            </div>
          </nav>
        </div>
      </header>

      <ul className={styleCategs.categoriesSmall} style={{
        top: `calc(${scrolled ? '60' : '80'}px - ${droppedDown ? '0' : '15'}rem)`,
        boxShadow: droppedDown ? '0 0 10px 0 rgba(0, 0, 0, .3)' : 'none'
      }}>
        {categoriesSmall}
      </ul>
    </>
  );
}

export default Header;
