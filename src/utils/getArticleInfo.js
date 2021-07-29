function getArticleInfo(str) {
  const pos1 = str.indexOf('\n');
  const pos2 = pos1 + 1 + str.slice(pos1 + 1).indexOf('\n');
  const pos3 = pos2 + 1 + str.slice(pos2 + 1).indexOf('\n');
  const pos4 = pos3 + 1 + str.slice(pos3 + 1).indexOf('\n');
  const pos5 = pos4 + 1 + str.slice(pos4 + 1).indexOf('\n');

  const title = str.slice('TITLE: '.length, pos1);
  const author = str.slice(pos1 + 'AUTHOR: '.length + 1, pos2);
  const date = str.slice(pos2 + 'DATE: '.length + 1, pos3);
  const categories = str.slice(pos3 + 'CATEGORIES: '.length + 1, pos4);
  const tags = str.slice(pos4 + 'TAGS: '.length + 1, pos5);

  const dateDD = date.slice(0, 2);
  const dateMM = date.slice(3, 5);
  const dateYY = date.slice(6, 10);

  const content = str.slice(pos5 + 2);
  const sanitizedContent = content.replace(/[\*_\$\[\]\+\-`]/g, '');
  const excerpt = sanitizedContent.slice(0, 300 + sanitizedContent.slice(300).indexOf(' ')) + '…';

  return {
    title,
    author,
    date: new Date(`${dateMM}/${dateDD}/${dateYY}`),
    categories: categories.split(', '),
    tags: tags.split(', '),
    excerpt,
    content
  };
}

export default getArticleInfo;
