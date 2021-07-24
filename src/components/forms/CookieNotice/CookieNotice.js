import React from 'react';
import * as styles from './CookieNotice.module.css';

function CookieNotice() {
  const [accepted, setAccepted] = React.useState(true);
  React.useEffect(() => {
    const storedAccepted = localStorage.getItem('InfoGenius.cookiesAccepted');
    setAccepted(storedAccepted == null ? false : storedAccepted === 'true');
  }, []);
  React.useEffect(() => {
    localStorage.setItem('InfoGenius.cookiesAccepted', accepted);
  }, [accepted]);

  return (
    <div
      className={styles.cookieNotice}
      style={{ display: accepted ? 'none' : 'block' }}
    >
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
        aria-label="cookie notice"
      >
        De acord!
      </button>
    </div>
  );
}

export default CookieNotice;
