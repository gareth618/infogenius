import React from 'react';
import prism from 'prismjs';
import * as styles from './CodeBlock.module.css';

export default function CodeBlock({ info }) {
  const codeBlock = (
    <pre className={styles.codeBlock}>
      <code className={`language-${info.lang}`} dangerouslySetInnerHTML={{
        __html: prism.highlight(info.code.join('\n'), prism.languages[info.lang], info.lang)
      }} />
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
