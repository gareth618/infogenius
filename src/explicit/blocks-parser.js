import parseInline from './inline-parser';
import { sanitize, hasOnly, escapeToHTML, toCamelCase, katexify } from '@utils/helpers';

const BEG_TAGS = {
  root  : ['math', 'block', 'list', 'p'],
  quote : ['h', 'math', 'block', 'list', 'p'],
  item  : ['p'],
  center: ['p'],
  right : ['p']
};

const MID_TAGS = {
  root  : ['h', 'hr', 'math', 'media', 'block', 'list', 'p'],
  quote : ['h', 'hr', 'math', 'media', 'block', 'list', 'p'],
  item  : ['h', 'hr', 'math', 'media', 'block', 'list', 'p'],
  center: ['p'],
  right : ['p']
};

const END_TAGS = {
  root  : ['math', 'png', 'mp4', 'js', 'quote', 'center', 'right', 'list', 'p'],
  quote : ['math', 'png', 'mp4', 'js', 'quote', 'center', 'right', 'list', 'p'],
  item  : ['math', 'png', 'mp4', 'js', 'quote', 'center', 'right', 'list', 'p'],
  center: ['p'],
  right : ['p']
};

function parseSons(str, media, tag, tabSize) {
  str += '\n\n';
  const sons = [];
  let i = 0;
  while (true) {
    while (i < str.length && str[i] === '\n') i++;
    if (i === str.length) break;
    for (const son of sons.length > 0 ? MID_TAGS[tag] : BEG_TAGS[tag]) {
      if (!['math', 'list', 'p'].includes(sons[sons.length - 1]?.tag) && son === 'hr') continue;
      if (sons[sons.length - 1]?.tag === 'hr' && !['math', 'list', 'p'].includes(son)) continue;
      if (sons[sons.length - 1]?.tag === 'list' && son === 'list') continue;
      const res = parseBlocks(str.slice(i), media, son, tabSize);
      if (res != null) {
        i += res.len;
        if (hasOnly(str.slice(i), '\n') && !END_TAGS[tag].includes(son)) {
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

export default function parseBlocks(str, media, tag = 'root', tabSize = 0) {
  if (tag === 'root') {
    return parseSons(str, media, tag, tabSize);
  }

  if (tag === 'p') {
    const endPos = str.indexOf('\n\n');
    str = str.slice(0, endPos);
    str = str.split('\n').map(line => line.slice(tabSize)).join('\n');
    str = escapeToHTML(str);
    return {
      ast: {
        tag: 'p',
        sons: parseInline(str)
      },
      len: endPos + '\n\n'.length
    };
  }

  if (tag === 'h') {
    const endPos = str.indexOf('\n\n');
    str = str.slice(tabSize, endPos);
    if (str.match(/#{2,6} \S/)?.index !== 0) return undefined;
    if (str.indexOf('\n') !== -1) return undefined;
    const h = str.indexOf(' ');
    str = escapeToHTML(str.slice(h + 1));
    return {
      ast: {
        tag: `h${h}`,
        sons: parseInline(str)
      },
      len: endPos + '\n\n'.length
    };
  }

  if (tag === 'hr') {
    const endPos = str.indexOf('\n\n');
    str = str.slice(tabSize, endPos);
    if (str !== '===') return undefined;
    return {
      ast: { tag: 'hr' },
      len: endPos + '\n\n'.length
    };
  }

  if (tag === 'math') {
    const endPos = str.indexOf('\n\n');
    str = str.slice(0, endPos);
    str = str.split('\n').map(line => line.slice(tabSize)).join('\n');
    if (!/\$\$.*\S.*\$\$[.,!?]?/s.test(str)) return undefined;
    try {
      const last = str.slice(-1);
      return {
        ast: {
          tag: 'math-block',
          math: last === '$'
            ? katexify(str.slice(2, -2), 'display', '', '')
            : katexify(str.slice(2, -3), 'display', '', last)
        },
        len: endPos + '\n\n'.length
      };
    }
    catch (err) {
      return undefined;
    }
  }

  if (tag === 'media') {
    const endPos = str.indexOf('\n\n');
    str = str.slice(tabSize, endPos);
    if (!/!\[.*\]\(((?!\()(?!\)).)*\)/.test(str)) return undefined;

    const match = str.match(/!\[(?<alt>.*)\]\((?<url>((?!\()(?!\)).)*)\)/);
    const alt = sanitize(escapeToHTML(match.groups.alt));
    const url = match.groups.url;
    if (!/([a-z0-9]+-)*[a-z0-9]\.(png|mp4|js)/.test(url)) return undefined;

    if (url.slice(-3) === 'png') {
      if (!/[1-9]\d*; .*/.test(alt)) return undefined;
      const name = url.slice(0, -4);
      const image = media.images.find(image => image.name === name);
      if (image == null) return undefined;
      const pos = alt.indexOf('; ');
      return {
        ast: {
          tag: 'png',
          image: image.data,
          width: parseInt(alt.slice(0, pos)),
          alt: alt.slice(pos + 2)
        },
        len: endPos + '\n\n'.length
      };
    }

    if (url.slice(-3) === 'mp4') {
      if (!/[1-9]\d*/.test(alt)) return undefined;
      const name = url.slice(0, -4);
      const video = media.videos.find(video => video.name === name);
      if (video == null) return undefined;
      return {
        ast: {
          tag: 'mp4',
          url: video.url,
          width: parseInt(alt)
        },
        len: endPos + '\n\n'.length
      };
    }

    if (url.slice(-2) === 'js') {
      if (alt !== '') return undefined;
      const name = toCamelCase(url.slice(0, -3));
      if (media.sketches.indexOf(name) === -1) return undefined;
      return {
        ast: {
          tag: 'js',
          sketch: name
        },
        len: endPos + '\n\n'.length
      };
    }
  }

  if (tag === 'block') {
    const tab = new Array(tabSize).fill(' ').join('');
    const endPos = str.indexOf(`\n${tab}<<<\n\n`);
    str = str.slice(tabSize, endPos);
    const nlnPos = str.indexOf('\n');
    if (str.slice(0, 3) !== '>>>') return undefined;
    const type
      = str.slice(3, nlnPos) === '' ? 'quote'
      : str.slice(3, nlnPos) === ' center' ? 'center'
      : str.slice(3, nlnPos) === ' right' ? 'right'
      : undefined;
    if (type == null) return undefined;
    str = str.slice(nlnPos + 1);
    if (hasOnly(str, '\n')) return undefined;

    const lines = str.split('\n');
    for (const line of lines) {
      if (line !== '' && line.slice(0, tabSize + 2) !== `${tab}  `) {
        return undefined;
      }
    }
    return {
      ast: parseSons(str, media, type, tabSize + 2),
      len: endPos + `\n${tab}<<<\n\n`.length
    };
  }

  if (tag === 'list') {
    const tab = new Array(tabSize).fill(' ').join('');
    const endPos = str.indexOf(`\n${tab}---\n\n`);
    str = str.slice(tabSize, endPos);
    const nlnPos = str.indexOf('\n');
    if (str.slice(0, 3) !== '+++') return undefined;
    const type
      = str.slice(3, nlnPos) === '' ? 'bullet'
      : str[3] === ' ' && /(none|[1aAiI]\.|\*\*[1aAiI]\.\*\*)/.test(str.slice(4, nlnPos)) ? str.slice(4, nlnPos)
      : undefined;
    if (type == null) return undefined;
    str = str.slice(nlnPos + 1);
    if (hasOnly(str, '\n')) return undefined;

    const lines = str.split('\n');
    const delim = [];
    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === `${tab}~~~`) {
        delim.push(i);
      }
      else if (lines[i] !== '' && lines[i].slice(0, tabSize + 2) !== `${tab}  `) {
        return undefined;
      }
    }

    if (delim.length > 0) {
      delim.unshift(-1);
      delim.push(str.length);
      for (let i = 1; i < delim.length; i++) {
        if (delim[i - 1] === delim[i] - 1) return undefined;
        let allEmptyLines = true;
        for (let j = delim[i - 1] + 1; j < delim[i]; j++) {
          if (lines[j] !== '') {
            allEmptyLines = false;
            break;
          }
        }
        if (allEmptyLines) return undefined;
      }
      const items = [];
      for (let i = 1; i < delim.length; i++) {
        items.push(lines.slice(delim[i - 1] + 1, delim[i]).join('\n'));
      }
      return {
        ast: {
          tag: 'list',
          type,
          sons: items.map(item => parseSons(item, media, 'item', tabSize + 2))
        },
        len: endPos + `\n${tab}---\n\n`.length
      };
    }
    else {
      for (const line of lines) {
        if (!/ {2}> \S/.test(line.slice(tabSize))) {
          return undefined;
        }
      }
      const items = lines.map(line => line.slice(tabSize + 4));
      if (items.length === 1) return undefined;
      return {
        ast: {
          tag: 'list',
          type,
          sons: items.map(item => ({
            tag: 'item-small',
            sons: parseInline(item)
          }))
        },
        len: endPos + `\n${tab}---\n\n`.length
      };
    }
  }
};
