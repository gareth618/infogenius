import katex from 'katex';

export function stringToDate(str) {
  const ddd = str.slice(0, 2);
  const mmm = str.slice(3, 5);
  const yyy = str.slice(6, 10);
  return new Date(`${mmm}/${ddd}/${yyy}`);
};

export function dateToString(date) {
  const ddd = date.getDate().toString().padStart(2, '0');
  const mmm = (date.getMonth() + 1).toString().padStart(2, '0');
  const yyy = date.getFullYear();
  return `${ddd}/${mmm}/${yyy}`;
};

export function timestampToString(date) {
  const hhh = date.getHours().toString().padStart(2, '0');
  const mmm = date.getMinutes().toString().padStart(2, '0');
  return `${hhh}:${mmm}`;
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\+/g, 'p')
    .replace(/\./g, '')
    .replace(/'/g, '')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ /g, '-');
};

export function trimPost(str) {
  return str
    .replace(/\t/g, '  ')
    .split('\n')
    .map(line => line.trimEnd());
};

export function sanitize(str) {
  return str
    .replace(/--/g, '–')
    .replace(/\.\.\./g, '…');
};

export function toCamelCase(str) {
  const arr = str.split('');
  arr[0] = arr[0].toUpperCase();
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1] === '-') {
      arr[i] = arr[i].toUpperCase();
    }
  }
  return arr.join('').replace(/-/g, '');
};

export function followsRegex(str, regex) {
  if (regex.flags !== '') return;
  const match = str.match(regex);
  if (match == null) return;
  if (match[0].length < str.length) return;
  return match.groups || { };
};

export function katexify(math, mode, lft, rgh) {
  if (lft !== '') math = `\\htmlClass{katexified}{${lft}} ` + math;
  let html = katex.renderToString(math, { displayMode: (mode === 'display' ? true : false), trust: true });
  if (rgh !== '') {
    let pos = html.length;
    for (let i = 0; i < (mode === 'inline' ? 3 : 4); i++) {
      pos = html.slice(0, pos).lastIndexOf('</span>');
    }
    html = html.slice(0, pos)
      + `<span class="enclosing katexified"><span class="mclose">${rgh}</span></span>`
      + html.slice(pos);
  }
  return html;
};
