import parsePara from './paragraph';

function escapeToHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const TAG_SONS = {
  'root'      : ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+quote]'  : ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+spoiler]': ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+item]'   : ['##', '$$', '![]()', '[+list]', '[+code]', '[+variants]', '[+table]', '[+center]', '[+right]', '[+quote]', '[+spoiler]', 'p'],
  '[+center]' : ['p'],
  '[+right]'  : ['p']
};

function parseSons(tag, str, media) {
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
      const res = parse(son, i - lastNewline - 1, str.slice(i), media);
      if (res != null) {
        ast.sons.push(res.ast);
        i += res.len;
        break;
      }
    }
  }
  return ast;
}

export default function parse(tag, tagTabSize, str, media) {
  if (tag === 'root') {
    return parseSons(tag, str, media);
  }

  if (tag === 'p') {
    const nextEmptyLine = str.indexOf('\n\n');
    str = str.slice(0, nextEmptyLine);
    str = escapeToHTML(str);
    return {
      ast: {
        tag: 'p',
        content: parsePara(str)
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
        content: parsePara(str)
      },
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
      const image = media.images.find(image => image.name === url.slice(0, -4));
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
      const video = media.videos.find(video => video.name === url.slice(0, -4));
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

    // if (url.slice(-2) === 'js' && alt !== '') return null;
  }
};
