import React from 'react';
import uuidv4 from 'uuid';
import { navigate } from 'gatsby';

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
import 'prismjs/themes/prism-okaidia.css';

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
          {sidebar && <aside className={styles.sidebar} />}
        </div>
        <Footer />
      </div>
    </>
  ), [sidebar, children]);

  React.useEffect(() => {
    const os
      = navigator.userAgent.indexOf('Mac') !== -1 ? 'os-macos'
      : navigator.userAgent.indexOf('Linux') !== -1 ? 'os-linux'
      : 'os-other';
    const elements = document.getElementsByClassName(os);
    for (const element of elements) {
      element.style.display = 'inline';
    }
  });

  const [userEmail, setUserEmail] = React.useState(null);
  React.useEffect(() => onAuthStateChanged(getAuth(), user => {
    setUserEmail(user == null ? null : user.email.slice(0, -'@gmail.com'.length));
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
        navigate(`/${notification.slug}/`);
        setTimeout(() => navigate(`/${notification.slug}#comment-${notification.comment}`), 1618);
      }}
    >
      <Notification />&nbsp;&nbsp;<span>{notification.name}</span>
      {notification.type === 'reply' ? ' ți-a răspuns!' : ' a răspuns.'}
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
