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

export function getExcerpt(content) {
  const sanitizedContent = content.replace(/[*_$[\]+\-`]/g, '');
  return sanitizedContent.slice(0, 260 + sanitizedContent.slice(260).indexOf(' ')) + '…';
};

export function getArticleInfo(str) {
  const pos1 = str.indexOf('\n');
  const pos2 = pos1 + 1 + str.slice(pos1 + 1).indexOf('\n');
  const pos3 = pos2 + 1 + str.slice(pos2 + 1).indexOf('\n');
  const pos4 = pos3 + 1 + str.slice(pos3 + 1).indexOf('\n');
  const pos5 = pos4 + 1 + str.slice(pos4 + 1).indexOf('\n');
  return {
    title: str.slice('TITLE: '.length, pos1),
    author: str.slice(pos1 + 'AUTHOR: '.length + 1, pos2),
    date: stringToDate(str.slice(pos2 + 'DATE: '.length + 1, pos3)),
    categories: str.slice(pos3 + 'CATEGORIES: '.length + 1, pos4).split(', '),
    tags: str.slice(pos4 + 'TAGS: '.length + 1, pos5).split(', '),
    content: str.slice(pos5 + 2),
    excerpt: getExcerpt(str.slice(pos5 + 2))
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
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ /g, '-');
};
