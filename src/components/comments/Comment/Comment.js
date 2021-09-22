import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

import { render } from '@explicit';
import { Reply, Close } from '@utils/icons';
import * as styles from './Comment.module.css';

export default function Comment({ info, setParentComment, preview }) {
  const avatar = info.email === 'bloggareth@gmail.com'
    ? (
      <StaticImage
        src="./../../../assets/gareth618.png" alt="gareth618"
        placeholder="none" formats={['auto', 'webp', 'avif']}
      />
    )
    : (
      <img
        src={`https://avatars.dicebear.com/api/jdenticon/${
          (info.email + info.name.toLowerCase()).split('').reduce(
            (pre, now) => pre * now.charCodeAt(0) % (1e9 + 7), 1
          ).toString().padStart(10, '0')
        }.svg`}
        alt={info.name}
      />
    );

  const button = preview
    ? (
      <button
        type="button"
        className={styles.replyBtn}
        onClick={() => setParentComment(null)}
      >
        <span className={styles.replyBtnText}>Anulează&nbsp;&nbsp;</span><Close />
      </button>
    )
    : (
      <button
        type="button"
        className={styles.replyBtn}
        onClick={() => setParentComment(info)}
      >
        <span className={styles.replyBtnText}>Răspunde&nbsp;&nbsp;</span><Reply />
      </button>
    );

  return (
    <div className={styles.comment} style={info.parent !== '' ? { marginLeft: 'calc(50px + 2rem)' } : { }}>
      <div className={styles.header}>
        <div className={styles.meta}>
          <div className={styles.avatar}>
            {avatar}
          </div>
          <div>
            <div className={styles.name} id={`comment-${info.id}`}>
              <a href={`#comment-${info.id}`}>{info.name}</a>
            </div>
            <div className={styles.date}>
              {`pe ${info.date} la ${info.time}`}
            </div>
          </div>
        </div>
        {info.parent === '' && button}
      </div>
      <div className="explicit">
        {render(info.content, { })}
      </div>
    </div>
  );
};
