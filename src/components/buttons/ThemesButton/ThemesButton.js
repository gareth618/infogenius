import React from 'react';
import { Light, Dark } from '@utils/icons';
import * as styles from './ThemesButton.module.css';

export default function ThemesButton() {
  const [theme, setTheme] = React.useState('light');
  React.useEffect(() => {
    const storedTheme = localStorage.getItem('InfoGenius.theme');
    setTheme(storedTheme == null ? 'light' : storedTheme);
  }, []);
  React.useEffect(() => {
    localStorage.setItem('InfoGenius.theme', theme);
    if (theme === 'light') document.documentElement.classList.remove('dark');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  }, [theme]);

  return (
    <button
      className={styles.themesBtn}
      style={{ color: theme === 'light' ? 'gold' : 'orchid' }}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      type="button"
      aria-label="theme switcher"
    >
      {theme === 'light' ? <Light /> : <Dark />}
    </button>
  );
};
