import React from 'react';
import { Header } from '@components/layout';
import { Footer } from '@components/layout';
import * as styles from './Layout.module.css';

import '@fontsource/inter/500.css';
import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';

import '@fontsource/merriweather/400.css';
import '@fontsource/merriweather/400-italic.css';
import '@fontsource/merriweather/700.css';
import '@fontsource/merriweather/700-italic.css';

import '@fontsource/source-code-pro/500.css';
import '@fontsource/source-code-pro/500-italic.css';
import '@fontsource/source-code-pro/700.css';
import '@fontsource/source-code-pro/700-italic.css';

import '@styles/global.css';
import '@styles/themes.css';
import '@styles/explicit.css';

import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-okaidia.css';

export default function Layout({ sidebar, children }) {
  React.useEffect(() => {
    const os
      = navigator.userAgent.indexOf('Mac') !== -1 ? 'os-macos'
      : navigator.userAgent.indexOf('Linux') !== -1 ? 'os-linux'
      : 'os-other';
    const elements = document.getElementsByClassName(os);
    for (const element of elements) {
      element.style.display = 'inline';
    }
  }, []);

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.mainArea}>
          <section className={styles.content}>{children}</section>
          {sidebar && <aside className={styles.sidebar} />}
        </div>
        <Footer />
      </div>
    </>
  );
};
