import React from 'react';
import uuidv4 from 'uuid';

import { CodeBlock } from '@components/explicit';
import * as styles from './CodeVariants.module.css';

export default function CodeVariants({ items }) {
  const [crtBlock, setCrtBlock] = React.useState(0);
  const buttons = items.map((item, index) => (
    <button
      type="button"
      key={uuidv4()}
      onClick={() => { setCrtBlock(index); }}
      className={styles.button}
    >
      {item.label}
    </button>
  ));

  const codeBlocks = items.map(item => <CodeBlock info={item} />);
  return (
    <>
      <div className={styles.buttonsContainer}>
        {buttons}
      </div>
      {codeBlocks[crtBlock]}
    </>
  );
};
