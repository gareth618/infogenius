import React from 'react';
import * as styles from './CookieNotice.module.css';

export default function CookieNotice() {
  const [accepted, setAccepted] = React.useState(true);
  React.useEffect(() => {
    const storedAccepted = localStorage.getItem('InfoGenius.cookies');
    setAccepted(storedAccepted == null ? false : storedAccepted === 'true');
  }, []);
  React.useEffect(() => {
    localStorage.setItem('InfoGenius.cookies', accepted);
  }, [accepted]);

  return !accepted && (
    <div className={styles.cookieNotice}>
      <h2>
        Notificare cookie-uri
      </h2>
      <p>
        Acest website folosește cookie-uri pentru a îmbunătăți experiența utilizatorului.
        Navigând în continuare, vă exprimați acordul asupra folosirii cookie-urilor.
      </p>
      <button
        onClick={() => setAccepted(true)}
        type="button"
      >
        De acord!
      </button>
    </div>
  );
};
