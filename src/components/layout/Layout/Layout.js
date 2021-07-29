import React from 'react';
import { Header } from '@components/layout';
import { Footer } from '@components/layout';

import '@fontsource/quicksand/600.css';
import '@fontsource/quicksand/700.css';
import '@fontsource/merriweather/400.css';
import '@fontsource/merriweather/400-italic.css';
import '@fontsource/merriweather/700.css';
import '@fontsource/merriweather/700-italic.css';

import '@styles/global.css';
import * as styles from './Layout.module.css';

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

function Layout({ displaySidebar, children }) {
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
}

export default Layout;