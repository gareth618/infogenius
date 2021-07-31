import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from './Donations.module.css';

function Donations() {
  return (
    <div className={styles.donationForm}>
      <div className={styles.donationText}>
        <h2>Îți place conținutul acestui site?</h2>
        <p>Dacă vrei să mă susții în întreținerea server-ului și în a scrie mai multe articole de calitate pe acest blog, mă poți ajuta printr-o mică donație!</p>
      </div>
      <div className={styles.donationLink}>
        <a href="https://www.paypal.me/infogenius" target="_blank" rel="noreferrer">
          <StaticImage
            src="./../../../assets/paypal.png" alt="donează"
            placeholder="none" formats={['auto', 'webp', 'avif']}
          />
        </a>
      </div>
    </div>
  );
}

export default Donations;
