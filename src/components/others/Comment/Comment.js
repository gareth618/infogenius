import React from 'react';
import { dateToString, timestampToString } from '@utils/helpers';

import { render } from '@explicit';
import * as styles from './Comment.module.css';

export default function Comment({ info }) {
  return (
    <div className={styles.comment}>
      <div className={styles.meta}>
        <img className={styles.avatar} src={`https://avatars.dicebear.com/api/jdenticon/${info.name}.svg`} alt={info.name} />
        <div>
          <div className={styles.name}>{info.name}</div>
          <div>{`pe ${dateToString(info.date)} la ${timestampToString(info.date)}`}</div>
        </div>
      </div>
      <div className="explicit">
        {render(info.content, [])}
      </div>
    </div>
  );
};
