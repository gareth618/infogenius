import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from './Comment.module.css';

import { render } from '@explicit';
import { dateToString, timeToString } from '@utils/helpers';

export default function Comment({ info }) {
  const avatar = info.name === 'Gareth618'
    ? (
      <StaticImage
        src="./../../../assets/gareth618.png" alt="gareth618"
        placeholder="none" formats={['auto', 'webp', 'avif']}
      />
    )
    : (
      <img
        src={`https://avatars.dicebear.com/api/jdenticon/${info.code + info.name}.svg`}
        alt={info.name}
      />
    );
  return (
    <div className={styles.comment}>
      <div className={styles.meta}>
        <div className={styles.avatar}>
          {avatar}
        </div>
        <div>
          <div className={styles.name}>{info.name}</div>
          <div className={styles.date}>{`pe ${dateToString(info.date)} la ${timeToString(info.date)}`}</div>
        </div>
      </div>
      <div className="explicit">
        {render(info.content, { })}
      </div>
    </div>
  );
};
