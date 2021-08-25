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
  root  : ['math', 'media', 'block', 'code', 'list', 'p'],
  quote : ['math', 'media', 'block', 'code', 'list', 'p'],
  item  : ['math', 'media', 'block', 'code', 'list', 'p'],
  center: ['p'],
  right : ['p']
};

const LANGS = [
  'html', 'css', 'javascript', 'json',
  'c', 'cpp', 'java', 'python',
  'bash', 'asm6502', 'text',
  'latex', 'markdown'
];

function parseSons(content, media, tag) {
  content.push('');
  const sons = [];
  let i = 0;
  while (true) {
    while (i < content.length && content[i] === '') i++;
    if (i === content.length) break;
    for (const son of sons.length > 0 ? MID_TAGS[tag] : BEG_TAGS[tag]) {
      if (sons[sons.length - 1]?.tag === 'list' && son === 'list') continue;
      if (['h2', 'h3', 'h4', 'h5', 'h6'].includes(sons[sons.length - 1]?.tag) && son === 'h') continue;
      if (['h2', 'h3', 'h4', 'h5', 'h6', 'hr'].includes(sons[sons.length - 1]?.tag) && son === 'hr') continue;
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

    const matchStr = followsRegex(content[0], /!\[(?<txt>.*)\]\((?<url>.*)\)/);
    if (matchStr == null) return;
    const txt = sanitize(matchStr.txt);
    const url = matchStr.url;

    const matchUrl = followsRegex(url, /(?<file>[a-z\d]+(-[a-z\d]+)*)\.(?<ext>png|mp4|js)/);
    if (matchUrl == null) return;
    const file = matchUrl.file;
    const ext = matchUrl.ext;

    if (ext === 'png') {
      const match = followsRegex(txt, /(?<wid>[1-9]\d*); (?<alt>\S(.*\S)?)/);
      if (match == null) return;
      const image = media.images.find(image => image.name === file);
      if (image == null) return;
      return {
        ast: {
          tag: 'png',
          image: image.data,
          width: parseInt(match.wid),
          alt: match.alt
        },
        len: endPos + 1
      };
    }
    else if (ext === 'mp4') {
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
    else if (ext === 'js') {
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

    if (content.every(line => /> \S/.test(line.slice(0, 3)))) {
      const items = content.map(line => line.slice(2));
      if (items.length === 0) return;
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
    else {
      const delims = content
        .map((line, index) => ({ line, index }))
        .filter(entry => entry.line === '~~~')
        .map(entry => entry.index);
      delims.unshift(-1);
      delims.push(content.length);
      const items = delims.slice(0, -1).map((delim, index) => content.slice(delim + 1, delims[index + 1]));
      if (items.some(item => item.every(line => line === ''))) return;
      if (items.some(item => item.some(line => line !== '' && line.slice(0, 2) !== '  '))) return;
      return {
        ast: {
          tag: 'list',
          type,
          sons: items.map(item => parseSons(item.map(line => line.slice(2)), media, 'item'))
        },
        len: endPos + 2
      };
    }
  }

  if (tag === 'code') {
    const endPos = content.findIndex((line, index) => ['```', '^^^'].includes(line) && content[index + 1] === '');
    if (endPos === -1) return;
    content = content.slice(0, endPos + 1);

    const delims = content
      .map((line, index) => ({ line, index }))
      .filter(entry => ['```', '^^^'].includes(entry.line.slice(0, 3)))
      .map(entry => entry.index);
    if (delims[0] !== 0) return;
    const matches = delims.slice(0, -1).map(delim => followsRegex(content[delim], new RegExp(
      '(?<crop>```|\\^\\^\\^) (?<lang>' + LANGS.join('|') + ')'
      + '( -> (?<title>\\S(.*\\S)?))?'
      + '( => (?<label>\\S(.*\\S)?))?$'
    )));
    matches.push({ crop: content[endPos] });
    if (matches.some(match => match == null)) return;
    if (matches[0].crop === '^^^') return;

    const items = delims.slice(0, -1).map((delim, index) => content.slice(delim + 1, delims[index + 1]));
    if (items.some(item => item.every(line => line === ''))) return;
    if (items.some(item => item.some(line => line !== '' && !['  ', '> '].includes(line.slice(0, 2))))) return;
    if (items.length === 1 && matches[0].label != null) return;
    if (items.length > 1 && matches.some(match => match.label == null)) return;
    if (items.length > 1 && matches.some(match => match.title == null) && matches.some(match => match.title != null)) return;

    const getCodeBlock = index => ({
      tag: 'code-block',
      code: items[index].map(line => line.slice(2)),
      high: items[index].map(line => line.slice(0, 2) === '> '),
      crop: matches[index + 1].crop === '^^^',
      lang: matches[index].lang,
      title: matches[index].title == null ? undefined : sanitize(matches[index].title),
      label: matches[index].label
    });

    if (items.length === 1) {
      return {
        ast: getCodeBlock(0),
        len: endPos + 2
      };
    }
    const sons = [];
    for (let i = 0; i < delims.length - 1; i++) {
      sons.push(getCodeBlock(i));
    }
    return {
      ast: {
        tag: 'code-variants',
        sons
      },
      len: endPos + 2
    };
  }
}
