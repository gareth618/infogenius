import React from 'react';
import uuidv4 from 'uuid';

import { ClipboardOne } from '@utils/icons';
import { ClipboardTwo } from '@utils/icons';
import * as styles from './CodeBlock.module.css';

import prism from 'prismjs';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-markdown';
import { GRAMMAR } from '@utils/explicit';
prism.languages.explicit = GRAMMAR;
prism.highlightAll = () => { };

export default function CodeBlock({ info }) {
  const [clicked, setClicked] = React.useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(info.code.join('\n'));
    setClicked(true);
    setTimeout(() => { setClicked(false); }, 1618);
  };

  const preClasses = [styles.codeBlock];
  if (info.crop) preClasses.push(styles.cropped);
  if (info.title != null) preClasses.push(styles.numbered);
  if (info.title != null) preClasses.push(styles[`digits${info.code.length.toString().length}`]);
  if (info.lang === 'bash' && info.code[0] !== '#!/bin/bash') preClasses.push(styles.dollars);

  const preStyles = ['markdown', 'bash', 'explicit'].includes(info.lang) ? { whiteSpace: 'pre-wrap' } : { overflowX: 'auto' };
  if (info.label != null) preStyles.borderTopLeftRadius = 0;
  if (info.label != null && info.title == null) preStyles.marginTop = 0;

  const lines = prism
    .highlight(info.code.join('\n'), prism.languages[info.lang], info.lang)
    .split('\n').map((line, index) => (
      <div
        key={uuidv4()}
        style={info.high[index] ? { background: '#333' } : { }}
        dangerouslySetInnerHTML={{ __html: line === '' ? '\n' : line }}
      />
    ));

  const codeBlock = (
    <div className={styles.codeWrapper}>
      <button
        type="button"
        className={styles.copyBtn + (info.code.length === 1 ? ' ' + styles.small : '')}
        style={clicked ? { pointerEvents: 'none' } : { }}
        onClick={clicked ? () => { } : copyCode}
      >
        {clicked ? <ClipboardTwo /> : <ClipboardOne />}
      </button>
      <pre
        className={preClasses.join(' ')}
        style={preStyles}
      >
        <code className={`language-${info.lang}`}>
          {lines}
        </code>
      </pre>
    </div>
  );

  if (info.title == null) return codeBlock;
  return (
    <div
      className={styles.macosWindow}
      style={info.label == null ? { } : { borderTopLeftRadius: 0 }}
    >
      <div className={styles.macosTopbar}>
        <div className={styles.macosMenu}>
          <div className={styles.macosCircle1} />
          <div className={styles.macosCircle2} />
          <div className={styles.macosCircle3} />
        </div>
        {info.title}
      </div>
      {codeBlock}
    </div>
  );
};
