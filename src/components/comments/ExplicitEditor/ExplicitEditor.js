import React from 'react';
import { renderKbd } from '@utils/helpers';
import * as styles from './ExplicitEditor.module.css';

import { render } from '@explicit';
import { Preview, Edit, Info } from '@utils/icons';

import prism from 'prismjs';
import { GRAMMAR } from '@utils/explicit';
prism.languages.explicit = GRAMMAR;
prism.highlightAll = () => { };

export default function ExplicitEditor({ input, setInput }) {
  const [shift, setShift] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const inputRef = React.useRef(null);
  const outputRef = React.useRef(null);

  React.useEffect(() => {
    if (preview) {
      renderKbd(navigator, document);
    }
  }, [preview]);

  const handleChange = event => {
    setInput(event.target.value
      .replace(/\t/g, '  ')
      .replace(/…/g, '...')
      .replace(/–/g, '--')
      .replace(/ /g, ' '));
  };

  const handleKeyUp = event => {
    if (event.code.slice(0, 5) === 'Shift') {
      setShift(false);
    }
  };

  const handleKeyDown = event => {
    if (event.code.slice(0, 5) === 'Shift') {
      setShift(true);
    }
    if (event.code === 'Tab') {
      const beg = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const lines = input.split('\n');
      const findLine = cnt => {
        for (let i = 0; i < lines.length; i++) {
          const now = lines[i].length + 1;
          cnt -= now;
          if (cnt < 0) return [i, cnt + now];
        }
        return [lines.length - 1, 0];
      };
      const [lineBeg, posBeg] = findLine(beg);
      const [lineEnd, posEnd] = findLine(end);
      if (shift) {
        let delBeg = 0;
        let delEnd = 0;
        let count = 0;
        for (let i = lineBeg; i <= lineEnd; i++) {
          const now = Math.min(lines[i].split('').findIndex(chr => chr !== ' '), 2);
          if (i === lineBeg) delBeg = now;
          if (i === lineEnd) delEnd = now;
          count += now;
          lines[i] = lines[i].slice(now);
        }
        setInput(lines.join('\n'));
        setTimeout(() => {
          inputRef.current.selectionStart = beg - delBeg + (posBeg < delBeg ? delBeg : 0);
          inputRef.current.selectionEnd = end - count + (posEnd < delEnd ? delEnd : 0);
        }, 0);
      }
      else {
        for (let i = lineBeg; i <= lineEnd; i++) {
          lines[i] = '  ' + lines[i];
        }
        setInput(lines.join('\n'));
        setTimeout(() => {
          inputRef.current.selectionStart = beg + 2;
          inputRef.current.selectionEnd = end + (lineEnd - lineBeg + 1) * 2;
        }, 0);
      }
      event.preventDefault();
    }
  };

  const content = preview
    ? (
      <div className={`explicit ${styles.result}`}>
        {render(input, { })}
      </div>
    ) : (
      <>
        <textarea
          ref={inputRef}
          className={styles.input}
          spellCheck={false}
          placeholder="Comentariu"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onScroll={() => {
            outputRef.current.scrollTop = inputRef.current.scrollTop;
            outputRef.current.scrollLeft = inputRef.current.scrollLeft;
          }}
        />
        <pre
          ref={outputRef}
          className={styles.output}
        >
          <code
            className="language-explicit"
            dangerouslySetInnerHTML={{
              __html: prism.highlight(input, prism.languages.explicit, 'explicit')
                + (input.slice(-1) === '\n' ? ' ' : '')
            }}
          />
        </pre>
      </>
    );

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.prevBtn}
        onClick={() => setPreview(!preview)}
      >
        {preview ? <Edit /> : <Preview />}
      </button>
      <a
        className={styles.infoBtn}
        href="https://infogenius.ro/explicit/"
        target="_blank"
        rel="noreferrer"
      >
        <Info />
      </a>
      {content}
    </div>
  );
};
