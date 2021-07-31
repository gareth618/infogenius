import parse from './parser';

export default function render(str, images) {
  return parse(str, images);
};
