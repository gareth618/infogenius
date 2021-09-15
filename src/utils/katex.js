import katex from 'katex';

export const MACROS = {
  '\\cmmdc': '\\operatorname{cmmdc}',
  '\\cmmmc': '\\operatorname{cmmmc}'
};

export function testKatex(math) {
  try {
    katex.renderToString(math, { macros: MACROS, trust: true, strict: false });
    return true;
  }
  catch (err) {
    return false;
  }
};

export function katexify(math, mode, lft, rgh) {
  if (lft !== '') math = `\\htmlClass{katexified}{${lft}} ` + math;
  let html = katex.renderToString(math, { macros: MACROS, trust: true, strict: false, displayMode: mode === 'display' });
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
