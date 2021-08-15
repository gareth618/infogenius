import React from 'react';
import { Link } from 'gatsby';
import uuidv4 from 'uuid';
import { katexify } from '@utils/helpers';
import * as styles from '@styles/explicit.module.css';

function renderText(str) {
  const arr = str
    .replace(/--/g, '–')
    .replace(/\.\.\./g, '…')
    .split('\n')
    .map(it => <React.Fragment key={uuidv4()}>{it}</React.Fragment>);
  const jsx = [];
  for (let i = 0; i < arr.length - 1; i++) {
    jsx.push(arr[i]);
    jsx.push(<br key={uuidv4()} />);
  }
  jsx.push(arr[arr.length - 1]);
  return jsx;
}

function renderCode(str) {
  str = str.slice(1, -1);
  return <code>{str.replace(/``/g, '`').trim()}</code>;
}

function renderMath(str, lft, rgh) {
  str = str.slice(1, -1);
  try { return <span dangerouslySetInnerHTML={{ __html: katexify(str, 'inline', lft || '', rgh || '') }} /> }
  catch (err) { return `$${str}$`; }
}

function renderKbrd(str) {
  str = str.slice(1, -1);
  if (/w\(\S+\) m\(\S+\) l\(\S+\)/.test(str)) {
    const tokens = str.split(' ');
    const wndws = tokens[0].slice(2, -1);
    const macos = tokens[1].slice(2, -1)
      .replace('Cmd'   , '⌘')
      .replace('Ctrl'  , '⌃')
      .replace('Option', '⌥')
      .replace('Shift' , '⇧');
    const linux = tokens[2].slice(2, -1);
    return (
      <kbd>
        <span className="os-other">{wndws}</span>
        <span className="os-macos">{macos}</span>
        <span className="os-linux">{linux}</span>
      </kbd>
    );
  }
  return <kbd>{str}</kbd>;
}

function renderEmoj(str) {
  const KEYS = {
    yey   : '1f600',
    lol   : '1f602',
    hehe  : '1f605',
    haha  : '1f606',
    wink  : '1f609',
    love  : '1f60d',
    cool  : '1f60e',
    smirk : '1f60f',
    tongue: '1f61b',
    sad   : '1f626',
    cry   : '1f62d',
    wow   : '1f62e',
    smile : '1f642',
    think : '1f914',
    party : '1f973',
    golden: '1f947',
    silver: '1f948',
    bronze: '1f949',
    '1/5': '1/5',
    '2/5': '2/5',
    '3/5': '3/5',
    '4/5': '4/5',
    '5/5': '5/5'
  };

  str = str.slice(1, -1);
  const key = KEYS[str];
  if (key == null) return `:${str}:`;
  if (key.length !== 3) return <img className={styles.twemoji} alt="" draggable="false" src={`https://twemoji.maxcdn.com/v/13.0.1/svg/${key}.svg`} />;

  let jsx = [];
  for (let i = 0; i < parseInt(key[0]); i++) jsx.push(<img key={uuidv4()} className={styles.twemoji} alt="" draggable="false" src="https://twemoji.maxcdn.com/v/13.0.1/svg/2b50.svg" />);
  for (let i = parseInt(key[0]); i < 5; i++) jsx.push(<img key={uuidv4()} className={styles.twemoji} alt="" draggable="false" src="https://twemoji.maxcdn.com/v/13.0.1/svg/2b50.svg" style={{ filter: 'grayscale(100%)' }} />);
  return <>{jsx}</>;
}

export function parsePara(str) {
  str = ' ' + str + ' ';
  const mark = new Array(str.length).fill(' ');
  const rght = new Array(str.length).fill(0);

  const markLeaf = (symbol, allowSpaces = false) => {
    const begRegex = new RegExp(`[\\s([{${allowSpaces ? symbol : ''}]`);
    const endRegex = new RegExp(`[\\s)\\]}${allowSpaces ? symbol : ''}.?!,;:*_~^-]`);
    let begin = -1;
    for (let i = 1; i < str.length - 1; i++) {
      if (mark[i] !== ' ') {
        begin = -1;
      }
      else if (str[i] === symbol) {
        if (begRegex.test(str[i - 1]) && (allowSpaces || /\S/.test(str[i + 1])) && begin === -1) {
          begin = i;
        }
        else if ((allowSpaces || /\S/.test(str[i - 1])) && endRegex.test(str[i + 1]) && begin !== -1) {
          if (begin < i - 1) {
            mark.fill(symbol, begin, i + 1);
            rght[begin] = i;
          }
          begin = -1;
        }
        else {
          begin = -1;
        }
      }
    }
  };

  markLeaf('`', true);
  markLeaf('$');
  markLeaf(';');
  markLeaf(':');

  const valid = url => {
    if (url === '') return true;
    if (url === '.') return true;
    try {
      new URL(url);
      return true;
    }
    catch (err) {
      try {
        new URL(`https://infogenius.ro/${url}`);
        return true;
      }
      catch (err) {
        return false;
      }
    }
  };

  const stack = [];
  for (let i = 1; i < str.length - 1; i++) {
    if (mark[i] === ' ') {
      if (str[i] === '[') {
        stack.push(i);
      }
      else if (str[i] === ']' && stack.length > 0) {
        if (str[i + 1] === '(') {
          const pos = str.indexOf(')', i + 2);
          if (pos !== -1) {
            const url = str.slice(i + 2, pos);
            if (valid(url)) {
              const brckBeg = stack[stack.length - 1];
              const brckEnd = i;
              const paraBeg = i + 1;
              const paraEnd = pos;
              mark[brckBeg] = '[';
              mark[brckEnd] = ']';
              mark[paraBeg] = '(';
              mark[paraEnd] = ')';
              rght[brckBeg] = brckEnd;
              rght[paraBeg] = paraEnd;
              mark.fill('.', paraBeg + 1, paraEnd);
              if (str.slice(paraEnd + 1, paraEnd + 5) === 'TODO') {
                mark.fill('?', paraEnd + 1, paraEnd + 5);
              }
              for (let j = brckBeg + 1; j < brckEnd; j++) {
                if (/[[\]().]/.test(mark[j])) {
                  mark[j] = ' ';
                  rght[j] = 0;
                }
              }
            }
          }
        }
        stack.pop();
      }
    }
  }

  const spanStack = [];
  const begin = {
    '*': -1,
    '_': -1,
    '~': -1,
    '^': -1
  };
  for (let i = 1; i < str.length - 1; i++) {
    if (mark[i] === ' ' && mark[i + 1] === ' ') {
      for (const span of ['*', '_', '~', '^']) {
        if (str[i] === span && str[i + 1] === span && /\S/.test(str[i - 1]) && str[i - 1] !== span && begin[span] !== -1) {
          mark[begin[span] + 0] = span;
          mark[begin[span] + 1] = span;
          mark[i + 0] = span;
          mark[i + 1] = span;
          rght[begin[span]] = ++i;
          while (spanStack.length > 0) {
            const top = spanStack.pop();
            begin[top] = -1;
            if (top === span) break;
          }
          break;
        }
        if (str[i] === span && str[i + 1] === span && /\S/.test(str[i + 2]) && str[i + 2] !== span && begin[span] === -1) {
          spanStack.push(span);
          begin[span] = i++;
          break;
        }
      }
    }
  }

  const parse = (l, r) => {
    const sons = [];
    for (let i = l; i < r; i++) {
      if (mark[i - 1] !== '`' && mark[i] === '`') sons.push({ tag: 'pCode', content: '' });
      if (mark[i - 1] !== '$' && mark[i] === '$') sons.push({ tag: 'pMath', content: '' });
      if (mark[i - 1] !== ';' && mark[i] === ';') sons.push({ tag: 'pKbrd', content: '' });
      if (mark[i - 1] !== ':' && mark[i] === ':') sons.push({ tag: 'pEmoj', content: '' });
      if (mark[i - 1] !== ' ' && mark[i] === ' ') sons.push({ tag: 'pText', content: '' });
      if (mark[i] === '[') {
        let url = str.slice(rght[i] + 2, rght[rght[i] + 1]);
        if (url !== '') {
          if (url === '.') url = '/';
          else if (url.slice(0, 'https://'.length) !== 'https://') url = `/${url}/`;
        }
        sons.push({
          tag: 'pLink',
          url,
          sons: [parse(i + 1, rght[i])]
        });
        const todo = str.slice(rght[rght[i] + 1] + 1, rght[rght[i] + 1] + 5) === 'TODO';
        i = rght[rght[i] + 1] + (todo ? 4 : 0);
      }
      else if (mark[i] === '*') { sons.push({ tag: 'pBold', sons: [parse(i + 2, rght[i] - 1)] }); i = rght[i]; }
      else if (mark[i] === '_') { sons.push({ tag: 'pItal', sons: [parse(i + 2, rght[i] - 1)] }); i = rght[i]; }
      else if (mark[i] === '~') { sons.push({ tag: 'pStrk', sons: [parse(i + 2, rght[i] - 1)] }); i = rght[i]; }
      else if (mark[i] === '^') { sons.push({ tag: 'pHigh', sons: [parse(i + 2, rght[i] - 1)] }); i = rght[i]; }
      else sons[sons.length - 1].content += str[i];
    }
    return { tag: 'para', sons };
  };

  mark[0] = '.';
  mark[str.length - 1] = '.';
  return parse(1, str.length - 1);
};

export function renderPara(ast) {
  const jsx = [];
  for (const son of ast.sons) {
    if (son.tag === 'pText') jsx.push(<React.Fragment key={uuidv4()}>{renderText(son.content)}</React.Fragment>);
    if (son.tag === 'pCode') jsx.push(<React.Fragment key={uuidv4()}>{renderCode(son.content)}</React.Fragment>);
    if (son.tag === 'pMath') jsx.push(<React.Fragment key={uuidv4()}>{renderMath(son.content, son.lft, son.rgh)}</React.Fragment>);
    if (son.tag === 'pKbrd') jsx.push(<React.Fragment key={uuidv4()}>{renderKbrd(son.content)}</React.Fragment>);
    if (son.tag === 'pEmoj') jsx.push(<React.Fragment key={uuidv4()}>{renderEmoj(son.content)}</React.Fragment>);
    if (son.tag === 'pLink') jsx.push(
      son.url === '' ? <React.Fragment key={uuidv4()}>{renderPara(son.sons[0])}</React.Fragment> :
      son.url[0] === '/' ? <Link key={uuidv4()} to={son.url}>{renderPara(son.sons[0])}</Link> :
      <a key={uuidv4()} href={son.url} target="_blank" rel="noreferrer">{renderPara(son.sons[0])}</a>
    );
    if (son.tag === 'pBold') jsx.push(<strong key={uuidv4()}>{renderPara(son.sons[0])}</strong>);
    if (son.tag === 'pItal') jsx.push(<em key={uuidv4()}>{renderPara(son.sons[0])}</em>);
    if (son.tag === 'pStrk') jsx.push(<span className={styles.strk} key={uuidv4()}>{renderPara(son.sons[0])}</span>);
    if (son.tag === 'pHigh') jsx.push(<span className={styles.high} key={uuidv4()}>{renderPara(son.sons[0])}</span>);
  }
  return jsx;
};
