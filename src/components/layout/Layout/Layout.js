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
import '@styles/explicit.css';

import 'katex/dist/katex.min.css';
import 'prismjs/themes/prism-okaidia.css';

function PageContainer({ displaySidebar, pageContainerRef, children }) {
  return (
    <div className={styles.pageContainer} ref={pageContainerRef}>
      <div className={styles.mainArea + (displaySidebar ? '' : ' ' + styles.noSidebar)}>
        <section className={styles.content}>{children}</section>
        <aside className={styles.sidebar} />
      </div>
      <Footer />
    </div>
  );
}

export default function Layout({ displaySidebar, children }) {
  React.useEffect(() => {
    const os
      = navigator.appVersion.indexOf('Mac'  ) !== -1 ? 'os-macos'
      : navigator.appVersion.indexOf('Linux') !== -1 ? 'os-linux'
      : 'os-other';
    const elements = document.getElementsByClassName(os);
    for (const element of elements) {
      element.style.display = 'inline';
    }
  }, []);
  const pageContainerRef = React.useRef(null);
  return (
    <>
      <PageContainer
        displaySidebar={displaySidebar}
        pageContainerRef={pageContainerRef}
      >
        {children}
      </PageContainer>
      <Header pageContainerRef={pageContainerRef} />
    </>
  );
};
