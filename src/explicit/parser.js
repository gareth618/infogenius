import { toCamelCase, katexify } from '@utils/helpers';
import { parsePara } from './paragraph';

function escapeToHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const TAG_SONS = {
  'root'      : ['##', '$$', '---', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', 'p'],
  '[+quote]'  : ['##', '$$', '---', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', 'p'],
  '[+item]'   : ['##', '$$', '---', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', 'p'],
  '[+center]' : ['p'],
  '[+right]'  : ['p']
};

const TAG_ATTS = {
  '[+list]': [
    {
      name: 'type',
      vals: ['bullet', '(a|A|1|i|I)(\\.|\\))', '\\*\\*(a|A|1|i|I)(\\.|\\))\\*\\*', 'none'],
      dflt: 'bullet'
    },
    {
      name: 'space',
      vals: ['no', 'yes'],
      dflt: 'no'
    }
  ],
  '[+code]': [
    {
      name: 'lang',
      vals: [
        'html', 'css', 'js', 'json',
        'shell', 'batch', 'powershell',
        'c', 'cpp', 'java', 'python',
        'latex', 'md',
        'asm6502', 'none'
      ],
      dflt: 'none'
    },
    {
      name: 'numb',
      vals: ['no', 'yes'],
      dflt: 'yes'
    },
    {
      name: 'high',
      vals: ['([1-9]\\d*(\\-[1-9]\\d*)?, )*[1-9]\\d*(\\-[1-9]\\d*)?'],
      dflt: ''
    },
    {
      name: 'crop',
      vals: ['no', 'yes'],
      dflt: 'no'
    },
    {
      name: 'title',
      vals: ['((?!; ).)+'],
      dflt: ''
    },
    {
      name: 'label',
      vals: ['((?!; ).)+'],
      dflt: ''
    }
  ]
};

function getTagRegex(tag) {
  let regex = '';
  if (TAG_ATTS[tag] != null) {
    regex = '(';
    for (const att of TAG_ATTS[tag]) {
      regex += att.name + ': (';
      for (const val of att.vals) {
        regex += val + '|';
      }
      regex = regex.slice(0, -1) + ')|';
    }
    regex = regex.slice(0, -1) + ')';
    regex = `(\\((?<att>(${regex}; )*${regex})?\\))?`;
  }
  return new RegExp(tag
    .replace('[', '\\[')
    .replace(']', '\\]')
    .replace('+', '\\+') + regex + '\\n');
}

function getAttsFromString(str, tag) {
  const atts = { };
  if (TAG_ATTS[tag] != null) {
    for (const att of TAG_ATTS[tag]) {
      atts[att.name] = att.dflt;
    }
  }
  if (str != null) {
    const attArray = str.split('; ');
    for (const entry of attArray) {
      const [name, val] = entry.split(': ');
      atts[name] = val;
    }
  }
  return atts;
}

function parseSons(str, media, tag) {
  const ast = {
    tag,
    atts: [],
    sons: []
  };
  str += '\n\n';
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
    for (const son of TAG_SONS[tag]) {
      const res = parse(str.slice(i), media, son, i - lastNewline - 1);
      if (res != null) {
        ast.sons.push(res.ast);
        i += res.len;
        break;
      }
    }
  }
  return ast;
}

export default function parse(str, media, tag = 'root', tagTabSize = 0) {
  if (tag === 'root') {
    return parseSons(str, media, tag);
  }

  if (tag === 'p') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    str = escapeToHTML(str);
    return {
      ast: {
        tag: 'p',
        sons: [parsePara(str)]
      },
      len: nextEmptyLine
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
      ast: {
        tag: `h${h}`,
        sons: [parsePara(str)]
      },
      len: nextEmptyLine
    };
  }

  if (tag === '$$') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    if (!/\$\$.*\S.*\$\$(\.|,|!|\?)?/s.test(str)) return null;
    try {
      const last = str.slice(-1);
      return {
        ast: {
          tag: 'math',
          math: last === '$'
            ? katexify(str.slice(2, -2), 'display', '', '')
            : katexify(str.slice(2, -3), 'display', '', last)
        },
        len: nextEmptyLine
      };
    }
    catch (err) {
      return null;
    }
  }

  if (tag === '---') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    if (str !== '---') return null;
    return {
      ast: { tag: 'hr' },
      len: nextEmptyLine
    };
  }

  if (tag === '![]()') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    if (!/!\[.*\]\(((?!\()(?!\)).)*\)/.test(str)) return null;

    const match = str.match(/!\[(?<alt>.*)\]\((?<url>((?!\()(?!\)).)*)\)/);
    const alt = escapeToHTML(match.groups.alt);
    const url = match.groups.url;
    if (!/([a-z0-9]+-)*[a-z0-9]\.(png|mp4|js)/.test(url)) return null;

    if (url.slice(-3) === 'png') {
      if (!/[1-9]\d*; .*/.test(alt)) return null;
      const name = url.slice(0, -4);
      const image = media.images.find(image => image.name === name);
      if (image == null) return null;
      const pos = alt.indexOf(';');
      return {
        ast: {
          tag: 'png',
          image: image.data,
          width: parseInt(alt.slice(0, pos)),
          alt: alt.slice(pos + 2)
        },
        len: nextEmptyLine
      };
    }

    if (url.slice(-3) === 'mp4') {
      if (!/[1-9]\d*/.test(alt)) return null;
      const name = url.slice(0, -4);
      const video = media.videos.find(video => video.name === name);
      if (video == null) return null;
      return {
        ast: {
          tag: 'mp4',
          url: video.url,
          width: parseInt(alt)
        },
        len: nextEmptyLine
      };
    }

    if (url.slice(-2) === 'js') {
      if (alt !== '') return null;
      const name = toCamelCase(url.slice(0, -3));
      if (media.sketches.indexOf(name) === -1) return null;
      return {
        ast: {
          tag: 'js',
          script: name
        },
        len: nextEmptyLine
      };
    }
  }

  if (tag !== '[+center]' && tag !== '[+right]' && tag !== '[+quote]' && tag !== '[+code]') return;

  const regex = getTagRegex(tag);
  const match = str.match(regex);
  if (match?.index !== 0) return null;
  const atts = getAttsFromString(match.groups?.att, tag);

  const endStr = '\n' + new Array(tagTabSize).fill(' ').join('') + tag.replace('+', '-');
  const endPos = str.indexOf(endStr + '\n\n');
  if (endPos === -1) return null;

  const content = str.slice(str.indexOf('\n') + 1, endPos + 1);
  if (content.match(/\S/) == null) return null;
  const tagEnd = endPos + endStr.length;

  if (tag === '[+code]') {
    const lines = content.slice(0, -1).split('\n');
    let minTab = 1e9;
    for (const line of lines) {
      if (line !== '') {
        let crtTab = 0;
        while (crtTab < line.length && line[crtTab] === ' ') {
          crtTab++;
        }
        minTab = Math.min(minTab, crtTab);
      }
    }
    let code = '';
    for (const line of lines) {
      code += line.slice(minTab) + '\n';
    }
    code = code.slice(0, -1);

    // // PrismJS is so shitty that I need to wait until I
    // // learn Gatsby to finish the code highlighting part
    // let classes = `lang-${atts.lang}`;
    // if (atts.numb === 'yes') classes += ' numb';
    // if (atts.crop === 'yes') classes += ' crop';
    // // TODO: use `high` and `name`
    // return {
    //   html: `<pre class="${classes}"><code>${code}</code></pre>`,
    //   length: tagEnd
    // };

    return {
      ast: { tag, code },
      len: tagEnd
    };
  }

  return {
    ast: parseSons(content, media, tag),
    len: tagEnd
  };
};
