import parseInline from './inline-parser';
import renderInline from './inline-renderer';
import parseBlocks from './blocks-parser';
import renderBlocks from './blocks-renderer';
import { trimPost } from '@utils/helpers';

function placeAds(ast) {
  const dfs = ast => {
    let length = 0;
    for (const son of ast.sons) {
      if (['bold', 'ital', 'strk', 'high', 'link'].includes(son.tag)) length += dfs(son);
      else if (['text', 'code', 'math', 'kbrd'].includes(son.tag)) length += son.content.length;
    }
    return length;
  };
  const newSons = [];
  for (let i = 0; i < ast.sons.length; i++) {
    if (i > 0
      && ast.sons[i - 1].tag === 'p' && dfs(ast.sons[i - 1]) >= 250
      && ast.sons[i - 0].tag === 'p' && dfs(ast.sons[i - 0]) >= 250
      && Math.random() < .3) {
        newSons.push({ tag: 'adsense' });
      }
    newSons.push(ast.sons[i]);
  }
  ast.sons = newSons;
  return ast;
}

function makeAnchors(ast, cnt) {
  if (ast.sons == null) return ast;
  for (const son of ast.sons) {
    if (/h[2-6]/.test(son.tag)) {
      son.id = ++cnt.val;
    }
    makeAnchors(son, cnt);
  }
  return ast;
}

function fixLists(ast) {
  if (ast.sons == null) return ast;
  ast.sons.forEach(son => fixLists(son));
  if (ast.tag !== 'list') return ast;
  if (ast.sons.every(son => son.tag === 'item-small')) ast.spaced = false;
  else {
    ast.spaced = true;
    if (ast.sons.every(son => (
      (son.sons.length === 1 && son.sons[0].tag === 'p') ||
      (son.sons.length === 2 && son.sons[0].tag === 'p' && son.sons[1].tag === 'list' && !son.sons[1].spaced)
    ))) ast.spaced = false;
    if (ast.sons.every(son => (
      (son.sons.length === 1 && son.sons[0].tag === 'p')
    ))) ast.spaced = true;
  }
  return ast;
}

function fixKatexBug(ast) {
  if (ast.sons == null) return ast;
  for (const son of ast.sons) {
    if (son.tag === 'math') {
      son.lft = '';
      son.rgh = '';
    }
  }
  for (let i = 1; i < ast.sons.length; i++) {
    if (ast.sons[i].tag === 'math') {
      if (ast.sons[i - 1].tag === 'text') {
        const str = ast.sons[i - 1].content;
        if (str.length > 0) {
          let pos = str.length;
          while (pos > 0 && /[^~\w\n ]/.test(str[pos - 1])) {
            pos--;
          }
          if (pos !== str.length) {
            ast.sons[i].lft = str.slice(pos);
            ast.sons[i - 1].content = str.slice(0, pos);
          }
        }
      }
    }
  }
  for (let i = 0; i < ast.sons.length - 1; i++) {
    if (ast.sons[i].tag === 'math') {
      if (ast.sons[i + 1].tag === 'text') {
        const str = ast.sons[i + 1].content;
        if (str.length > 0) {
          let pos = -1;
          while (pos < str.length - 1 && /[^~\w\n ]/.test(str[pos + 1])) {
            pos++;
          }
          if (pos !== -1) {
            ast.sons[i].rgh = str.slice(0, pos + 1);
            ast.sons[i + 1].content = str.slice(pos + 1);
          }
        }
      }
    }
  }
  ast.sons.forEach(son => fixKatexBug(son));
  return ast;
}

function getExcerpt(ast) {
  const excAST = { tag: 'p', sons: [] };
  for (const son of ast.sons) {
    if (son.tag === 'p') {
      excAST.sons.push(...son.sons);
      excAST.sons.push({ tag: 'text', content: ' ' });
    }
  }

  const MAX_LENGTH = 260;
  let length = 0;
  const dfs = ast => {
    for (const son of ast.sons) {
      if (['bold', 'ital', 'strk', 'high'].includes(son.tag)) {
        dfs(son);
      }
      else if (son.tag === 'link') {
        son.url = '';
        dfs(son);
      }
      else if (son.tag === 'text') {
        son.content = son.content.replace(/\n/g, ' ');
        const tokens = son.content.split(' ');
        let newContent = '';
        let index = 0;
        for (const token of tokens) {
          const now = token + (++index === tokens.length ? '' : ' ');
          newContent += now;
          length += now.length;
          if (length > MAX_LENGTH) break;
        }
        son.content = newContent;
      }
      else if (son.tag === 'code') {
        length += son.content.length;
      }
      else if (son.tag === 'math') {
        length += son.content.length / 3;
        length += son.lft.length;
        length += son.rgh.length;
      }
      else if (son.tag === 'kbrd') {
        length += son.content.length / 2;
      }
      else if (son.tag === 'emoj') {
        length += 2;
      }
      if (length > MAX_LENGTH) {
        while (son !== ast.sons[ast.sons.length - 1]) {
          ast.sons.pop();
        }
        break;
      }
    }
  };
  dfs(excAST);

  const lastSon = excAST.sons[excAST.sons.length - 1];
  if (lastSon.tag === 'text') {
    while (/\W/.test(lastSon.content.slice(-1))) {
      lastSon.content = lastSon.content.slice(0, -1);
    }
    lastSon.content += '...';
  }
  else {
    excAST.sons.push({ tag: 'text', content: '...' });
  }
  return excAST;
}

export function render(str, media) {
  const ADSENSE = false;
  if (media == null) return renderInline(fixKatexBug({ tag: 'root', sons: parseInline(str) }).sons);
  if (Object.keys(media).length === 0) return renderBlocks(fixLists(fixKatexBug(parseBlocks(trimPost(str), media))), false);
  return ADSENSE
    ? renderBlocks(placeAds(makeAnchors(fixLists(fixKatexBug(parseBlocks(trimPost(str), media))), { val: 0 })), true)
    : renderBlocks(makeAnchors(fixLists(fixKatexBug(parseBlocks(trimPost(str), media))), { val: 0 }), true);
};

export function renderExcerpt(str, media) {
  return renderBlocks(getExcerpt(fixKatexBug(parseBlocks(trimPost(str), media))), false);
};
