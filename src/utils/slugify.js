function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\+/g, 'p')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ /g, '-');
}

export default slugify;
