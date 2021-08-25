import React from 'react';
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
import 'prismjs/components/prism-asm6502';
import 'prismjs/components/prism-latex';
import 'prismjs/components/prism-markdown';

export default function CodeBlock({ info }) {
  const codeBlock = (
    <pre
      className={styles.codeBlock}
      style={['markdown', 'bash'].includes(info.lang) ? { whiteSpace: 'pre-wrap' } : { overflowX: 'scroll' }}
    >
      <code
        className={`language-${info.lang}`}
        dangerouslySetInnerHTML={{
          __html: prism.highlight(info.code.join('\n'), prism.languages[info.lang], info.lang)
        }}
      />
    </pre>
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
