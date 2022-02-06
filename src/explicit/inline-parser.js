import { testKatex } from '@utils/katex';
import { followsRegex } from '@utils/helpers';

export const EMOJIS = {
  yey    : '1f600',
  lol    : '1f602',
  hehe   : '1f605',
  haha   : '1f606',
  wink   : '1f609',
  love   : '1f60d',
  cool   : '1f60e',
  smirk  : '1f60f',
  tongue : '1f61b',
  sad    : '1f626',
  cry    : '1f62d',
  wow    : '1f62e',
  smile  : '1f642',
  tractor: '1f69c',
  think  : '1f914',
  party  : '1f973',
  golden : '1f947',
  silver : '1f948',
  bronze : '1f949',
  farmer : '1f468-200d-1f33e',
  '1/5': '1/5',
  '2/5': '2/5',
  '3/5': '3/5',
  '4/5': '4/5',
  '5/5': '5/5'
};

export default function parseInline(str) {
  str = ' ' + str + ' ';
  const mark = new Array(str.length).fill(' ');
  const rght = new Array(str.length).fill(0);

  const markLeaf = (symbol, allowSpaces, valid = () => true) => {
    const begRegex = new RegExp(`[\\s([{${allowSpaces ? symbol : ''}/*_~^]`);
    const endRegex = new RegExp(`[\\s)\\]}${allowSpaces ? symbol : ''}.?!,;:/*_~^-]`);
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
          if (begin < i - 1 && valid(str.slice(begin + 1, i))) {
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
  markLeaf('$', false, str => testKatex(str));
  markLeaf(';', false);
  markLeaf(':', false, str => EMOJIS[str] != null);

  const valid = url => {
    if (url === '') return true;
    if (url === '.') return true;
    if (followsRegex(url, /(https:\/\/)?[/\w$.*!',()#+-]+/) == null) return false;
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

  const brckStack = [];
  for (let i = 1; i < str.length - 1; i++) {
    if (mark[i] === ' ') {
      if (str[i] === '[') {
        brckStack.push(i);
      }
      else if (str[i] === ']' && brckStack.length > 0) {
        if (str[i - 1] !== '[' && str[i + 1] === '(') {
          let rgh = -1;
          const paraStack = [];
          for (let j = i + 1; j < str.length - 1; j++) {
            if (str[j] === '(') {
              paraStack.push(j);
            }
            else if (str[j] === ')' && paraStack.length > 0) {
              paraStack.pop();
              if (paraStack.length === 0) {
                rgh = j;
                break;
              }
            }
          }
          if (rgh !== -1) {
            const brckBeg = brckStack[brckStack.length - 1];
            const brckEnd = i;
            const paraBeg = i + 1;
            const paraEnd = rgh;
            mark[brckBeg] = '[';
            mark[brckEnd] = ']';
            mark[paraBeg] = '(';
            mark[paraEnd] = ')';
            rght[brckBeg] = brckEnd;
            rght[paraBeg] = paraEnd;
            const url = str.slice(i + 2, rgh);
            const tag
              = str[brckBeg - 1] === '?' ? 'abbr'
              : valid(url) ? 'link' : undefined;
            if (tag != null) {
              mark.fill('.', paraBeg + 1, paraEnd);
              if (tag === 'abbr') {
                mark[brckBeg - 1] = '?';
              }
              else if (str.slice(paraEnd + 1, paraEnd + 5) === 'TODO') {
                mark.fill('o', paraEnd + 1, paraEnd + 5);
              }
              for (let j = brckBeg + 1; j < brckEnd; j++) {
                if (/[[\]()o.?]/.test(mark[j])) {
                  mark[j] = ' ';
                  rght[j] = 0;
                }
              }
            }
          }
        }
        brckStack.pop();
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
      if (mark[i - 1] !== ' ' && mark[i] === ' ') sons.push({ tag: 'text', content: '' });
      if (mark[i - 1] !== '`' && mark[i] === '`') sons.push({ tag: 'code', content: '' });
      if (mark[i - 1] !== '$' && mark[i] === '$') sons.push({ tag: 'math', content: '' });
      if (mark[i - 1] !== ';' && mark[i] === ';') sons.push({ tag: 'kbrd', content: '' });
      if (mark[i - 1] !== ':' && mark[i] === ':') sons.push({ tag: 'emoj', content: '' });
      if (mark[i] === '[') {
        let url = str.slice(rght[i] + 2, rght[rght[i] + 1]);
        if (mark[i - 1] === '?') {
          sons.push({
            tag: 'abbr',
            alt: url,
            sons: parse(i + 1, rght[i])
          });
          i = rght[rght[i] + 1];
        }
        else {
          if (url !== '') {
            if (url === '.') url = '/';
            else if (url.slice(0, 'https://'.length) !== 'https://') url = url.indexOf('#') === -1 ? `/${url}/` : `/${url}`;
          }
          sons.push({
            tag: 'link',
            url,
            sons: parse(i + 1, rght[i])
          });
          const todo = str.slice(rght[rght[i] + 1] + 1, rght[rght[i] + 1] + 5) === 'TODO';
          i = rght[rght[i] + 1] + (todo ? 4 : 0);
        }
      }
      else if (mark[i] === '*') { sons.push({ tag: 'bold', sons: parse(i + 2, rght[i] - 1) }); i = rght[i]; }
      else if (mark[i] === '_') { sons.push({ tag: 'ital', sons: parse(i + 2, rght[i] - 1) }); i = rght[i]; }
      else if (mark[i] === '~') { sons.push({ tag: 'strk', sons: parse(i + 2, rght[i] - 1) }); i = rght[i]; }
      else if (mark[i] === '^') { sons.push({ tag: 'high', sons: parse(i + 2, rght[i] - 1) }); i = rght[i]; }
      else if (mark[i] !== '?') sons[sons.length - 1].content += str[i];
    }
    return sons;
  };
  mark[0] = '.';
  mark[str.length - 1] = '.';
  return parse(1, str.length - 1);
};
