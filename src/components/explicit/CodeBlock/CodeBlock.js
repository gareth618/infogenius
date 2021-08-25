import React from 'react';
import * as styles from './CodeBlock.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard as faClipboardOne } from '@fortawesome/free-regular-svg-icons';
import { faClipboard as faClipboardTwo } from '@fortawesome/free-solid-svg-icons';

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
import 'prismjs/components/prism-asm6502';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-markdown';

export default function CodeBlock({ info }) {
  const preClasses = [styles.codeBlock];
  if (info.crop) preClasses.push(styles.cropped);
  if (info.title != null) preClasses.push(styles.numbered);
  if (info.title != null) preClasses.push(styles[`digits${info.code.length.toString().length}`]);

  const html = prism
    .highlight(info.code.join('\n'), prism.languages[info.lang], info.lang)
    .split('\n').map((line, index) => (
      `<div${info.high[index] ? ' style="background: #333"' : ''}>${line === '' ? '\n' : line}</div>`
    )).join('');

  const [clicked, setClicked] = React.useState(false);
  const copyCode = () => {
    navigator.clipboard.writeText(info.code.join('\n'));
    setClicked(true);
    setTimeout(() => { setClicked(false); }, 1618);
  };

  const codeBlock = (
    <div className={styles.codeWrapper}>
      <button
        onClick={clicked ? () => { } : copyCode}
        className={styles.copyBtn}
        style={clicked ? { pointerEvents: 'none' } : { }}
      >
        {clicked
          ? <FontAwesomeIcon className="fa-clipboard" icon={faClipboardTwo} />
          : <FontAwesomeIcon className="far-clipboard" icon={faClipboardOne} />}
      </button>
      <pre
        className={preClasses.join(' ')}
        style={['markdown', 'bash'].includes(info.lang) ? { whiteSpace: 'pre-wrap' } : { overflowX: 'scroll' }}
      >
        <code
          className={`language-${info.lang}`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </pre>
    </div>
  );

  if (info.title == null) return codeBlock;
  return (
    <div className={styles.macosWindow}>
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
