import parseInline from './inline-parser';
import { sanitize, toCamelCase, followsRegex, katexify } from '@utils/helpers';

const BEG_TAGS = {
  root  : ['math', 'block', 'code', 'list', 'p'],
  quote : ['h', 'math', 'block', 'code', 'list', 'p'],
  item  : ['p'],
  center: ['p'],
  right : ['p']
};

const MID_TAGS = {
  root  : ['h', 'hr', 'math', 'media', 'block', 'code', 'list', 'p'],
  quote : ['h', 'hr', 'math', 'media', 'block', 'code', 'list', 'p'],
  item  : ['h', 'hr', 'math', 'media', 'block', 'code', 'list', 'p'],
  center: ['p'],
  right : ['p']
};

const END_TAGS = {
  root  : ['math-block', 'png', 'mp4', 'js', 'quote', 'center', 'right', 'code-block', 'list', 'p'],
  quote : ['math-block', 'png', 'mp4', 'js', 'quote', 'center', 'right', 'code-block', 'list', 'p'],
  item  : ['math-block', 'png', 'mp4', 'js', 'quote', 'center', 'right', 'code-block', 'list', 'p'],
  center: ['p'],
  right : ['p']
};

// const LANGS = [
//   'html', 'css', 'js', 'json',
//   'shell', 'batch', 'powershell',
//   'c', 'cpp', 'java', 'python',
//   'latex', 'md',
//   'asm6502', 'none'
// ];

function parseSons(content, media, tag) {
  content.push('');
  content.push('');
  const sons = [];
  let i = 0;
  while (true) {
    while (i < content.length && content[i] === '') i++;
    if (i === content.length) break;
    for (const son of sons.length > 0 ? MID_TAGS[tag] : BEG_TAGS[tag]) {
      if (!['p', 'math-block', 'list'].includes(sons[sons.length - 1]?.tag) && son === 'hr') continue;
      if (sons[sons.length - 1]?.tag === 'hr' && !['p', 'math', 'list'].includes(son)) continue;
      if (sons[sons.length - 1]?.tag === 'list' && son === 'list') continue;
      const res = parseBlocks(content.slice(i), media, son);
      if (res != null) {
        i += res.len;
        if (content.slice(i).every(line => line === '') && !END_TAGS[tag].includes(son)) {
          i -= res.len;
        }
        else {
          sons.push(res.ast);
          break;
        }
      }
    }
  }
  return { tag, sons };
}

export default function parseBlocks(content, media, tag = 'root') {
  if (tag === 'root') {
    return parseSons(content, media, tag);
  }

  if (tag === 'p') {
    const endPos = content.indexOf('');
    content = content.slice(0, endPos);
    const str = content.join('\n');
    return {
      ast: {
        tag: 'p',
        sons: parseInline(str)
      },
      len: endPos + 1
    };
  }

  if (tag === 'h') {
    const endPos = content.indexOf('');
    content = content.slice(0, endPos);
    if (content.length > 1) return;
    if (content[0].match(/#{2,6} \S/)?.index !== 0) return;
    const h = content[0].indexOf(' ');
    const str = content[0].slice(h + 1);
    return {
      ast: {
        tag: `h${h}`,
        sons: parseInline(str)
      },
      len: endPos + 1
    };
  }

  if (tag === 'hr') {
    const endPos = content.indexOf('');
    content = content.slice(0, endPos);
    if (content.length > 1) return;
    if (content[0] !== '===') return;
    return {
      ast: { tag: 'hr' },
      len: endPos + 1
    };
  }

  if (tag === 'math') {
    const endPos = content.indexOf('');
    content = content.slice(0, endPos);
    if (/\s/.test(content[content.length - 1][0])) return;
    if (content.slice(1, -1).some(line => !/ {2}\S/.test(line.slice(0, 3)))) return;
    const str = content.join(' ');
    if (followsRegex(str, /\$\$\S(.*\S)?\$\$[.,!?]?/) == null) return;
    try {
      const last = str.slice(-1);
      return {
        ast: {
          tag: 'math-block',
          math: last === '$'
            ? katexify(str.slice(2, -2), 'display', '', '')
            : katexify(str.slice(2, -3), 'display', '', last)
        },
        len: endPos + 1
      };
    }
    catch (err) {
      return;
    }
  }

  if (tag === 'media') {
    const endPos = content.indexOf('');
    content = content.slice(0, endPos);
    if (content.length > 1) return;

    const matchStr = content[0].match(/!\[(?<txt>.*)\]\((?<url>.*)\)/);
    if (matchStr?.index !== 0) return;
    const txt = sanitize(matchStr.groups.txt);
    const url = matchStr.groups.url;

    const matchUrl = url.match(/(?<file>[a-z\d]+(-[a-z\d]+)*)\.(png|mp4|js)/);
    if (matchUrl?.index !== 0) return;
    const file = matchUrl.groups.file;

    if (url.slice(-3) === 'png') {
      const match = txt.match(/(?<wid>[1-9]\d*); (?<alt>\S(.*\S)?)/);
      if (match?.index !== 0) return;
      const wid = match.groups.wid;
      const alt = match.groups.alt;
      const image = media.images.find(image => image.name === file);
      if (image == null) return;
      return {
        ast: {
          tag: 'png',
          image: image.data,
          width: parseInt(wid),
          alt
        },
        len: endPos + 1
      };
    }

    if (url.slice(-3) === 'mp4') {
      if (followsRegex(txt, /[1-9]\d*/) == null) return;
      const video = media.videos.find(video => video.name === file);
      if (video == null) return;
      return {
        ast: {
          tag: 'mp4',
          url: video.url,
          width: parseInt(txt)
        },
        len: endPos + 1
      };
    }

    if (url.slice(-2) === 'js') {
      if (txt !== '') return;
      const sketch = toCamelCase(file);
      if (media.sketches.indexOf(sketch) === -1) return;
      return {
        ast: {
          tag: 'js',
          sketch
        },
        len: endPos + 1
      };
    }
  }

  if (tag === 'block') {
    const endPos = content.findIndex((line, index) => line === '<<<' && content[index + 1] === '');
    if (endPos === -1) return;
    content = content.slice(0, endPos);
    if (content[0].slice(0, 3) !== '>>>') return;
    const type
      = content[0].slice(3) === '' ? 'quote'
      : content[0].slice(3) === ' center' ? 'center'
      : content[0].slice(3) === ' right' ? 'right'
      : undefined;
    if (type == null) return;
    content = content.slice(1);
    if (content.every(line => line === '')) return;
    if (content.some(line => line !== '' && line.slice(0, 2) !== '  ')) return;
    return {
      ast: parseSons(content.map(line => line.slice(2)), media, type),
      len: endPos + 2
    };
  }

  if (tag === 'list') {
    const endPos = content.findIndex((line, index) => line === '---' && content[index + 1] === '');
    if (endPos === -1) return;
    content = content.slice(0, endPos);
    if (content[0].slice(0, 3) !== '+++') return;
    const type
      = content[0].slice(3) === '' ? 'bullet'
      : followsRegex(content[0].slice(3), / (none|[1aAiI]\.|\*\*[1aAiI]\.\*\*)/) != null ? content[0].slice(4)
      : undefined;
    if (type == null) return;
    content = content.slice(1);
    if (content.every(line => line === '')) return;
    if (content.some(line => !(line === '' || line === '~~~' || line.slice(0, 2) === '  '))) return;

    const delims = content
      .map((line, index) => ({ line, index }))
      .filter(entry => entry.line === '~~~')
      .map(entry => entry.index);
    if (delims.length > 0) {
      delims.unshift(-1);
      delims.push(content.length);
      const items = delims.slice(0, -1).map((delim, index) => content.slice(delim + 1, delims[index + 1]));
      if (items.some(item => item.every(line => line === ''))) return;
      return {
        ast: {
          tag: 'list',
          type,
          sons: items.map(item => parseSons(item.map(line => line.slice(2)), media, 'item'))
        },
        len: endPos + 2
      };
    }
    else {
      if (content.some(line => !/ {2}> \S/.test(line.slice(0, 5)))) return;
      const items = content.map(line => line.slice(4));
      if (items.length === 1) return;
      return {
        ast: {
          tag: 'list',
          type,
          sons: items.map(item => ({
            tag: 'item-small',
            sons: parseInline(item)
          }))
        },
        len: endPos + 2
      };
    }
  }

  // if (tag === 'code') {
  //   const tab = new Array(tabSize).fill(' ').join('');
  //   let endPos1 = str.indexOf('\n' + tab + '```\n\n'); if (endPos1 === -1) endPos1 = 1e9;
  //   let endPos2 = str.indexOf('\n' + tab + '^^^\n\n'); if (endPos2 === -1) endPos2 = 1e9;
  //   const endPos = Math.min(endPos1, endPos2);
  //   if (endPos === 1e9) return undefined;
  //   str = str.slice(0, endPos);

  //   const lines = str.split('\n');
  //   const match = lines.map(line => line.match(new RegExp(
  //     tab + '(?<crop>```|^^^)'
  //     + '(?<lang>' + LANGS.join('|') + ')'
  //     + '( -> (?<title>\\S(.*\\S)?)( -> (?<label>\\S(.*\\S)?))?)?'
  //   )));
  //   const delim = [];
  //   for (let i = 0; i < lines.length; i++) {
  //     if (match[i]?.index === 0) {
  //       delim.push(i);
  //     }
  //     else if (lines[i] !== '' && lines[i] !== `${tab}  ` && lines[i] !== `${tab}> `) {
  //       return undefined;
  //     }
  //   }

  //   if (delim[0] !== 0) return undefined;
  //   if (match[0].groups.crop === '^^^') return undefined;
  //   delim.push(lines.length);
  //   for (let i = 1; i < delim.length; i++) {
  //     let allEmptyLines = true;
  //     for (let j = delim[i - 1] + 1; j < delim[i]; j++) {
  //       if (lines[j] !== '') {
  //         allEmptyLines = false;
  //         break;
  //       }
  //     }
  //     if (allEmptyLines) return undefined;
  //   }

  //   const getCodeBlock = index => {
  //     const codeLines = lines.slice(delim[index] + 1, delim[index + 1]);
  //     return {
  //       tag: 'code-block',
  //       code: codeLines,
  //       high: codeLines.map(line => line === `${tab}> `),
  //       crop: lines[delim[index + 1]].slice(0, tabSize + 3) === `${tab}^^^`,
  //       title: match[delim[index]].groups.title,
  //       label: match[delim[index]].groups.label
  //     };
  //   };

  //   if (delim.length === 2) {
  //     if (match[delim[0]].groups.label != null) return undefined;
  //     return {
  //       ast: getCodeBlock(0),
  //       len: endPos + `\n${tab}^^^\n\n`.length
  //     };
  //   }
  //   else {
  //     let cropCount = 0;
  //     let titleCount = 0;
  //     let labelCount = 0;
  //     for (let i = 0; i < delim.length - 1; i++) {
  //       cropCount += lines[delim[i + 1]].slice(0, tabSize + 3) === `${tab}^^^`;
  //       titleCount += match[delim[i]].groups.title != null;
  //       labelCount += match[delim[i]].groups.label != null;
  //     }
  //     if (!(cropCount === 0 || cropCount === delim.length - 1)) return undefined;
  //     if (!(titleCount === 0 || titleCount === delim.length - 1)) return undefined;
  //     if (labelCount !== delim.length - 1) return undefined;
  //     const sons = [];
  //     for (let i = 0; i < delim.length - 1; i++) {
  //       sons.push(getCodeBlock(i));
  //     }
  //     return {
  //       ast: { tag: 'code-variants', sons },
  //       len: endPos + `\n${tab}^^^\n\n`.length
  //     };
  //   }
  // }
};
