import React from 'react';
import uuidv4 from 'uuid';
import { graphql, useStaticQuery, Link } from 'gatsby';

import * as styles from './Footer.module.css';
import { CookieNotice } from '@components/others';
import { GitHub, FaceBook, YouTube, Twitter } from '@utils/icons';

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
    { img: <FaceBook />, color: 'dodgerblue', alt: 'FaceBook', url: data.social.facebook },
    { img: <Twitter />, color: 'deepskyblue', alt: 'Twitter', url: data.social.twitter },
    { img: <GitHub />, color: 'darkviolet', alt: 'GitHub', url: data.social.github },
    { img: <YouTube />, color: 'red', alt: 'YouTube', url: data.social.youtube }
  ];

  const pagesList = pages.map(page => (
    <li key={uuidv4()}>
      <Link to={page.slug}>{page.name}</Link>
    </li>
  ));

  const iconsList = icons.map(icon => (
    <li key={uuidv4()}>
      <a style={{ color: icon.color }} href={icon.url} target="_blank" rel="noreferrer">{icon.img}</a>
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
