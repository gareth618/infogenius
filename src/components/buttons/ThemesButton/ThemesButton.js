import React from 'react';
import * as styles from './ThemesButton.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const THEMES = [
  {
    name: 'light',
    icon: faSun,
    iconColor: 'gold',
    colors: {
      background: 'white',
      sidebar: 'moccasin',
      title: '#282828',
      text: '#444',
      link: 'dodgerblue',
      code: '#e8e8e8'
    }
  },
  {
    name: 'dark',
    icon: faMoon,
    iconColor: 'orchid',
    colors: {
      background: '#282828',
      sidebar: '#333',
      title: '#e8e8e8',
      text: '#eee',
      link: 'skyblue',
      code: '#383838'
    }
  }
];

export default function ThemesButton({ pageContainerRef }) {
  const [themeId, setThemeId] = React.useState(0);
  React.useEffect(() => {
    const storedThemeId = localStorage.getItem('InfoGenius.themeId');
    setThemeId(storedThemeId == null ? 0 : parseInt(storedThemeId));
  }, []);

  React.useEffect(() => {
    localStorage.setItem('InfoGenius.themeId', themeId);
    for (const color in THEMES[themeId].colors) {
      pageContainerRef.current.style.setProperty('--' + color, THEMES[themeId].colors[color]);
    }
  }, [themeId, pageContainerRef]);

  return (
    <button
      className={styles.themesBtn}
      onClick={() => setThemeId((themeId + 1) % THEMES.length)}
      type="button"
      aria-label="theme switcher"
    >
      <FontAwesomeIcon
        className="fa-fw"
        icon={THEMES[themeId].icon}
        color={THEMES[themeId].iconColor}
      />
    </button>
  );
};
