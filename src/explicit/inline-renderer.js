import React from 'react';
import uuidv4 from 'uuid';
import { Link } from 'gatsby';

import { EMOJIS } from './inline-parser';
import { sanitize, escapeToHTML, katexify } from '@utils/helpers';

function renderText(str) {
  const arr = sanitize(str)
    .split('\n')
    .map(line => <React.Fragment key={uuidv4()}>{line}</React.Fragment>);
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
  return <span dangerouslySetInnerHTML={{
    __html: katexify(str, 'inline', lft, rgh)
  }} />;
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
  str = str.slice(1, -1);
  const key = EMOJIS[str];
  if (!/\d\/\d/.test(key)) return <img className="twemoji" alt="" draggable="false" src={`https://twemoji.maxcdn.com/v/13.0.1/svg/${key}.svg`} />;
  const jsx = [];
  for (let i = 0; i < parseInt(key[0]); i++) jsx.push(<img key={uuidv4()} className="twemoji" alt="" draggable="false" src="https://twemoji.maxcdn.com/v/13.0.1/svg/2b50.svg" />);
  for (let i = parseInt(key[0]); i < 5; i++) jsx.push(<img key={uuidv4()} className="twemoji" alt="" draggable="false" src="https://twemoji.maxcdn.com/v/13.0.1/svg/2b50.svg" style={{ filter: 'grayscale(100%)' }} />);
  return jsx;
}

export default function renderInline(sons) {
  const jsx = [];
  for (const son of sons) {
    if (son.tag === 'text') jsx.push(<React.Fragment key={uuidv4()}>{renderText(son.content)}</React.Fragment>);
    if (son.tag === 'code') jsx.push(<React.Fragment key={uuidv4()}>{renderCode(son.content)}</React.Fragment>);
    if (son.tag === 'math') jsx.push(<React.Fragment key={uuidv4()}>{renderMath(son.content, son.lft, son.rgh)}</React.Fragment>);
    if (son.tag === 'kbrd') jsx.push(<React.Fragment key={uuidv4()}>{renderKbrd(son.content)}</React.Fragment>);
    if (son.tag === 'emoj') jsx.push(<React.Fragment key={uuidv4()}>{renderEmoj(son.content)}</React.Fragment>);
    if (son.tag === 'abbr') jsx.push(<abbr title={sanitize(escapeToHTML(son.alt))}>{renderInline(son.sons)}</abbr>);
    if (son.tag === 'link') jsx.push(
      son.url === '' ? <React.Fragment key={uuidv4()}>{renderInline(son.sons)}</React.Fragment> :
      son.url[0] === '/' ? <Link key={uuidv4()} to={son.url}>{renderInline(son.sons)}</Link> :
      <a key={uuidv4()} href={son.url} target="_blank" rel="noreferrer">{renderInline(son.sons)}</a>
    );
    if (son.tag === 'bold') jsx.push(<strong key={uuidv4()}>{renderInline(son.sons)}</strong>);
    if (son.tag === 'ital') jsx.push(<em key={uuidv4()}>{renderInline(son.sons)}</em>);
    if (son.tag === 'strk') jsx.push(<span className="strk" key={uuidv4()}>{renderInline(son.sons)}</span>);
    if (son.tag === 'high') jsx.push(<span className="high" key={uuidv4()}>{renderInline(son.sons)}</span>);
  }
  return jsx;
};
