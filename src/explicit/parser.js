import React from 'react';
import uuidv4 from 'uuid';
import { GatsbyImage } from 'gatsby-plugin-image';

import parsePara from './paragraph';
import * as styles from '@styles/explicit.module.css';

function escapeToHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const TAG_SON = {
  ''          : ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+quote]'  : ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+spoiler]': ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+item]'   : ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+center]' : ['p'],
  '[+right]'  : ['p']
};

function parseSons(str, images, tag) {
  str += '\n\n';
  let html = [];
  let i = 0;
  let lastNewline = -1;
  while (true) {
    while (i < str.length && /\s/.test(str[i])) {
      if (str[i] === '\n') {
        lastNewline = i;
      }
      i++;
    }
    if (i === str.length) break;
    for (const son of TAG_SON[tag]) {
      const res = parse(str.slice(i), images, son, i - lastNewline - 1);
      if (res != null) {
        html.push(
          <React.Fragment key={uuidv4()}>
            {res.html}
          </React.Fragment>
        );
        i += res.length;
        break;
      }
    }
  }
  return html;
}

export default function parse(str, images, tag = '', tagTabSize = 0) {
  if (tag === '') {
    return parseSons(str, images, '');
  }

  if (tag === 'p') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    str = escapeToHTML(str);
    return {
      html: <p>{parsePara(str)}</p>,
      length: nextEmptyLine
    };
  }

  if (tag === '##') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    if (str.match(/#{2,6} \S/)?.index !== 0) return null;
    if (str.indexOf('\n') !== -1) return null;
    const h = str.indexOf(' ');
    str = escapeToHTML(str.slice(h + 1));
    return {
      html:
        h === 2 ? <h2>{parsePara(str)}</h2> :
        h === 3 ? <h3>{parsePara(str)}</h3> :
        h === 4 ? <h4>{parsePara(str)}</h4> :
        h === 5 ? <h5>{parsePara(str)}</h5> :
        h === 6 ? <h6>{parsePara(str)}</h6> : <></>,
      length: nextEmptyLine
    };
  }

  if (tag === '![]()') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    if (!/!\[.*\]\(((?!\()(?!\)).)*\)/.test(str)) return null;

    const match = str.match(/!\[(?<alt>.*)\]\((?<url>((?!\()(?!\)).)*)\)/);
    const alt = escapeToHTML(match.groups.alt);
    const url = match.groups.url;

    // if (!/([a-z0-9]+\-)*[a-z0-9]\.(png|gif|mp4|js)/.test(url)) return null;
    if (!/([a-z0-9]+-)*[a-z0-9]\.png/.test(url)) return null;
    // if (/(png|gif)/.test(url.slice(-3)) && !/[1-9]\d*; .*/.test(alt)) return null;
    if (/png/.test(url.slice(-3)) && !/[1-9]\d*; .*/.test(alt)) return null;
    // if (/mp4/.test(url.slice(-3)) && !/[1-9]\d*/.test(alt)) return null;
    // if (/js/.test(url.slice(-2)) && alt !== '') return null;
    const image = images.find(image => image.name === url.slice(0, -4));
    if (image == null) return null;

    const pos = alt.indexOf(';');
    return {
      html:
        <div
          className={styles.imgContainer}
          style={{ width: parseInt(alt.slice(0, pos)) }}
        >
          <GatsbyImage
            image={image.data}
            alt={alt.slice(pos + 2)}
          />
        </div>,
      length: nextEmptyLine
    };
  }
};
