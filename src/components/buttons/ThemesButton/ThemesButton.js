import React from 'react';
import { Light, Dark } from '@utils/icons';
import { useLocalStorage } from '@utils/hooks';
import * as styles from './ThemesButton.module.css';

export default function ThemesButton() {
  const [theme, setTheme] = useLocalStorage('InfoGenius.theme', 'light');
  React.useEffect(() => {
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
