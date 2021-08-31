import React from 'react';
import uuidv4 from 'uuid';
import { graphql, useStaticQuery, Link } from 'gatsby';

import { CookieNotice } from '@components/forms';
import * as styles from './Footer.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faFacebook, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  const data = useStaticQuery(
    graphql`
      query FooterQuery {
        site {
          siteMetadata {
            title
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

  const pages = data.pages;
  const icons = [
    { img: faFacebook, color: 'dodgerblue', alt: 'FaceBook', url: data.social.facebook },
    { img: faTwitter, color: 'deepskyblue', alt: 'Twitter', url: data.social.twitter },
    { img: faGithub, color: 'darkviolet', alt: 'GitHub', url: data.social.github },
    { img: faYoutube, color: 'red', alt: 'YouTube', url: data.social.youtube }
  ];

  const pagesList = pages.map(page => (
    <li key={uuidv4()}>
      <Link to={page.slug}>
        {page.name}
      </Link>
    </li>
  ));

  const iconsList = icons.map(icon => (
    <li key={uuidv4()}>
      <a href={icon.url} target="_blank" rel="noreferrer">
        <FontAwesomeIcon icon={icon.img} color={icon.color} />
      </a>
    </li>
  ));

  return (
    <footer>
      <nav className={styles.footerNav}>
        <ul>
          {pagesList}
        </ul>
      </nav>
      <div className={styles.footerInfo}>
        <div className={styles.copyright}>
          © 2017-{new Date().getFullYear()} <Link to="/">{data.title}.ro</Link>
        </div>
        <ul className={styles.social}>
          {iconsList}
        </ul>
      </div>
      <CookieNotice />
    </footer>
  );
};
