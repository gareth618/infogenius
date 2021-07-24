import React from 'react';
import { graphql, useStaticQuery, Link } from 'gatsby';
import uuidv4 from 'uuid';

import { CookieNotice } from '@components/forms';
import * as styles from './Footer.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faFacebook, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  const query = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            pages {
              name
              slug
            }
            social {
              facebook
              github
              twitter
              youtube
            }
          }
        }
      }
    `
  ).site.siteMetadata;

  const pages = query.pages;
  const icons = [
    { img: faFacebook, color: 'dodgerblue', alt: 'FaceBook', url: query.social.facebook },
    { img: faTwitter, color: 'deepskyblue', alt: 'Twitter', url: query.social.twitter },
    { img: faGithub, color: 'darkviolet', alt: 'GitHub', url: query.social.github },
    { img: faYoutube, color: 'red', alt: 'YouTube', url: query.social.youtube }
  ];

  const pagesList = pages.map(page =>
    <li key={uuidv4()}>
      <Link to={page.slug}>
        {page.name}
      </Link>
    </li>
  );

  const iconsList = icons.map(icon =>
    <li key={uuidv4()}>
      <a href={icon.url} target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={icon.img} color={icon.color} />
      </a>
    </li>
  );

  return (
    <footer>
      <nav className={styles.footerNav}>
        <ul>
          {pagesList}
        </ul>
      </nav>

      <div className={styles.footerInfo}>
        <div className={styles.copyright}>
          © 2017-{new Date().getFullYear()} <Link to="/">InfoGenius.ro</Link>
        </div>
        <ul className={styles.social}>
          {iconsList}
        </ul>
      </div>

      <CookieNotice />
    </footer>
  );
}

export default Footer;
