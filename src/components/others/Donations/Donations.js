import React from 'react';
import Patreon from '@assets/patreon.svg';
import * as styles from './Donations.module.css';

export default function Donations() {
  return (
    <div className={styles.donationForm}>
      <p className={styles.donationText}>
        Mulțumesc că ai citit acest articol.<br />
        Dacă vrei să susții blogul, poți cumpăra un abonament de 2$.
      </p>
      <a
        className={styles.donationLink}
        href="https://www.patreon.com/infogenius"
        target="_blank" rel="noreferrer"
      >
        <img src={Patreon} alt="patreon" />
      </a>
    </div>
  );
};
