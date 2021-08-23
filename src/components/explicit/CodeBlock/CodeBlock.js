import React from 'react';
import prism from 'prismjs';
import * as styles from './CodeBlock.module.css';

export default function CodeBlock({ info }) {
  return (
    <div style={{ borderRadius: '.5rem', background: '#181818' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '15px', height: '15px', borderRadius: '50%', margin: '.7rem .2rem .7rem 1rem', background: '#ff605c' }} />
        <div style={{ width: '15px', height: '15px', borderRadius: '50%', margin: '.7rem .2rem', background: '#ffbd44' }} />
        <div style={{ width: '15px', height: '15px', borderRadius: '50%', margin: '.7rem .2rem', background: '#00ca4e' }} />
      </div>
      <pre className={styles.codeBlock} style={{ marginTop: 0, borderRadius: '0 0 .5rem .5rem' }}>
        <code className="language-javascript" dangerouslySetInnerHTML={{
          __html: prism.highlight(info.code, prism.languages.javascript, 'javascript')
        }} />
      </pre>
    </div>
  );
};
