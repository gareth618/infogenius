import React from 'react';
import uuidv4 from 'uuid';
import { navigate } from 'gatsby';
import { renderKbd } from '@utils/helpers';

import { Header } from '@components/layout';
import { Footer } from '@components/layout';
import { Notification } from '@utils/icons';
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
import '@styles/okaidia.css';

import firestore from '@utils/firestore';
import { onSnapshot, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Layout({ sidebar, children }) {
  const content = React.useMemo(() => (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.mainArea}>
          <section className={styles.content}>{children}</section>
          {sidebar && (
            <aside className={styles.sidebar}>
              <ins
                className="adsbygoogle"
                style={{ display: 'inline-block', width: 200, height: 600 }}
                data-ad-client="ca-pub-2051821579024751"
                data-ad-slot="2342079856"
              />
              <script dangerouslySetInnerHTML={{
                __html: 'setTimeout(() => (adsbygoogle = window.adsbygoogle || []).push({ }), 1618);'
              }} />
            </aside>
          )}
        </div>
        <Footer />
      </div>
    </>
  ), [sidebar, children]);

  React.useEffect(() => {
    renderKbd(navigator, document);
  });

  const [userEmail, setUserEmail] = React.useState(null);
  React.useEffect(() => onAuthStateChanged(getAuth(), user => {
    setUserEmail(user == null ? null : user.email);
  }), []);

  const [notifications, setNotifications] = React.useState([]);
  React.useEffect(() => onSnapshot(collection(firestore, 'users'), async () => {
    try {
      const notificationsDocRef = doc(firestore, 'users', userEmail);
      const notificationsDocOld = await getDoc(notificationsDocRef);
      if (notificationsDocOld.exists()) {
        setNotifications(notificationsDocOld.data().notifications);
      }
    }
    catch (err) { }
  }), [userEmail]);
  if (notifications.length === 0) return content;

  const notificationList = notifications.map(notification => (
    <button
      type="button"
      key={uuidv4()}
      onClick={async () => {
        const notificationsDocRef = doc(firestore, 'users', userEmail);
        const notificationsDocOld = await getDoc(notificationsDocRef);
        await setDoc(notificationsDocRef, {
          name: notificationsDocOld.data().name,
          notifications: notificationsDocOld.data().notifications.filter(
            notif => notif.comment !== notification.comment
          )
        });
        navigate(`/${notification.slug}/#comment-${notification.comment}`);
      }}
    >
      <Notification />&nbsp;&nbsp;<span>{notification.name}</span>
      {notification.type === 'child' && ' ți-a răspuns!'}
      {notification.type === 'sibling' && ' a răspuns.'}
      {notification.type === 'new' && ' a comentat.'}
    </button>
  ));

  return (
    <>
      {content}
      <div className={styles.notifications}>
        {notificationList}
      </div>
    </>
  );
};
