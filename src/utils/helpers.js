import katex from 'katex';

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

export function getArticleInfo(str) {
  const pos1 = str.indexOf('\n');
  const pos2 = pos1 + 1 + str.slice(pos1 + 1).indexOf('\n');
  const pos3 = pos2 + 1 + str.slice(pos2 + 1).indexOf('\n');
  const pos4 = pos3 + 1 + str.slice(pos3 + 1).indexOf('\n');
  const pos5 = pos4 + 1 + str.slice(pos4 + 1).indexOf('\n');
  const pos6 = pos5 + 1 + str.slice(pos5 + 1).indexOf('\n');
  return {
    title: str.slice('TITLE: '.length, pos1),
    author: str.slice(pos1 + 'AUTHOR: '.length + 1, pos2),
    date: stringToDate(str.slice(pos2 + 'DATE: '.length + 1, pos3)),
    categories: str.slice(pos3 + 'CATEGORIES: '.length + 1, pos4).split(', '),
    tags: str.slice(pos4 + 'TAGS: '.length + 1, pos5).split(', '),
    description: str.slice(pos5 + 'DESCRIPTION: '.length + 1, pos6),
    content: str.slice(pos6 + 2)
  };
};

export function getPageInfo(str) {
  const pos = str.indexOf('\n');
  return {
    title: str.slice('NAME: '.length, pos),
    content: str.slice(pos + 2)
  };
};

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

export function katexify(math, mode, lft, rgh) {
  if (lft !== '') math = `\\htmlStyle{font-family: 'Merriweather'; font-size: 1rem;}{${lft}} ` + math;
  let html = katex.renderToString(math, { displayMode: (mode === 'display' ? true : false), trust: true });
  if (rgh !== '') {
    let pos = html.length;
    for (let i = 0; i < (mode === 'inline' ? 3 : 4); i++) {
      pos = html.slice(0, pos).lastIndexOf('</span>');
    }
    html = html.slice(0, pos)
      + `<span class="enclosing" style="font-family: 'Merriweather'; font-size: 1rem;"><span class="mclose">${rgh}</span></span>`
      + html.slice(pos);
  }
  return html;
};
