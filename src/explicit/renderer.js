import React from 'react';
import prism from 'prismjs';
import uuidv4 from 'uuid';
import { GatsbyImage } from 'gatsby-plugin-image';

import parse from './parser';
import { renderPara } from './paragraph';
import * as styles from '@styles/explicit.module.css';

import { Sketch } from '@components/explicit';
import * as scripts from './../../content';

function renderAST(ast) {
  const sons = ast.sons == null ? null : ast.sons.map(son =>
    <React.Fragment key={uuidv4()}>
      {renderAST(son)}
    </React.Fragment>
  );

  if (ast.tag === 'root') {
    return sons;
  }

  if (ast.tag === '[+center]') {
    return <div className={styles.center}>{sons}</div>;
  }

  if (ast.tag === '[+right]') {
    return <div className={styles.right}>{sons}</div>;
  }

  if (ast.tag === '[+quote]') {
    return <blockquote>{sons}</blockquote>
  }

  if (ast.tag === 'p') {
    return <p>{renderPara(ast.sons[0])}</p>;
  }

  if (ast.tag === 'hr') {
    return <hr />;
  }

  if (ast.tag === 'h2') return <h2 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderPara(ast.sons[0])}</a></h2>;
  if (ast.tag === 'h3') return <h3 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderPara(ast.sons[0])}</a></h3>;
  if (ast.tag === 'h4') return <h4 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderPara(ast.sons[0])}</a></h4>;
  if (ast.tag === 'h5') return <h5 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderPara(ast.sons[0])}</a></h5>;
  if (ast.tag === 'h6') return <h6 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderPara(ast.sons[0])}</a></h6>;

  if (ast.tag === 'math') {
    return (
      <div
        className={styles.mathWrapper}
        dangerouslySetInnerHTML={{ __html: ast.math }}
      />
    );
  }

  if (ast.tag === 'png') {
    return (
      <div className={styles.imgWrapper} style={{ width: ast.width }}>
        <GatsbyImage image={ast.image} alt={ast.alt} />
      </div>
    );
  }

  if (ast.tag === 'mp4') {
    return (
      <video style={{ width: ast.width }} autoPlay muted loop draggable>
        <source src={ast.url} type="video/mp4" />
      </video>
    );
  }

  if (ast.tag === 'js') {
    return <Sketch script={scripts[ast.script]} />;
  }

  if (ast.tag === '[+code]') {
    return (
      <div style={{ borderRadius: '.5rem', background: '#181818' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '15px', height: '15px', borderRadius: '50%', margin: '.7rem .2rem .7rem 1rem', background: '#ff605c' }} />
          <div style={{ width: '15px', height: '15px', borderRadius: '50%', margin: '.7rem .2rem', background: '#ffbd44' }} />
          <div style={{ width: '15px', height: '15px', borderRadius: '50%', margin: '.7rem .2rem', background: '#00ca4e' }} />
        </div>
        <pre className={styles.code} style={{ marginTop: 0, borderRadius: '0 0 .5rem .5rem' }}>
          <code className={'language-javascript'} dangerouslySetInnerHTML={{
            __html: prism.highlight(ast.code, prism.languages.javascript, 'javascript')
          }} />
        </pre>
      </div>
    );
  }

  return <></>;
}

function fixKatexBug(ast) {
  if (ast.sons == null) return;
  for (let i = 1; i < ast.sons.length - 1; i++) {
    if (ast.sons[i].tag === 'pMath') {
      ast.sons[i].lft = '';
      if (ast.sons[i - 1].tag === 'pText') {
        const strLft = ast.sons[i - 1].content;
        if (strLft.length > 0) {
          let pos = strLft.length;
          while (pos > 0 && /[^a-zA-Z0-9\n ]/.test(strLft[pos - 1])) {
            pos--;
          }
          if (pos !== strLft.length) {
            ast.sons[i].lft = strLft.slice(pos);
            ast.sons[i - 1].content = strLft.slice(0, pos);
          }
        }
      }
      ast.sons[i].rgh = '';
      if (ast.sons[i + 1].tag === 'pText') {
        const strRgh = ast.sons[i + 1].content;
        if (strRgh.length > 0) {
          let pos = -1;
          while (pos < strRgh.length - 1 && /[^a-zA-Z0-9\n ]/.test(strRgh[pos + 1])) {
            pos++;
          }
          if (pos !== -1) {
            ast.sons[i].rgh = strRgh.slice(0, pos + 1);
            ast.sons[i + 1].content = strRgh.slice(pos + 1);
          }
        }
      }
    }
  }
  for (const son of ast.sons) {
    fixKatexBug(son);
  }
}

function makeAnchors(ast, cnt) {
  if (ast.sons == null) return;
  for (const son of ast.sons) {
    if (son.tag[0] === 'h') {
      son.id = ++cnt.val;
    }
    makeAnchors(son, cnt);
  }
}

export default function render(str, media) {
  const ast = parse(str, media);
  fixKatexBug(ast);
  makeAnchors(ast, { val: 0 });
  return renderAST(ast);
};

export function getExcerpt(article) {
  const ast = parse(article.content, article.media);
  fixKatexBug(ast);

  const excAST = { tag: 'p', sons: [{ tag: 'para', sons: [] }] };
  for (const son of ast.sons) {
    if (son.tag === 'p') {
      excAST.sons[0].sons.push(...son.sons[0].sons);
      excAST.sons[0].sons.push({ tag: 'pText', content: ' ' });
    }
  }

  const MAX = 260;
  let cnt = 0;
  const dfs = ast => {
    for (const son of ast.sons) {
      if (/(para|pBold|pItal|pStrk|pHigh)/.test(son.tag)) {
        dfs(son);
      }
      else if (son.tag === 'pLink') {
        son.url = '';
        dfs(son);
      }
      else if (son.tag === 'pText') {
        son.content = son.content.replace(/\n/g, ' ');
        const tokens = son.content.split(' ');
        let newContent = '';
        let index = 0;
        for (const token of tokens) {
          const now = token + (++index === tokens.length ? '' : ' ');
          newContent += now;
          cnt += now.length;
          if (cnt > MAX) break;
        }
        son.content = newContent;
      }
      else if (son.tag === 'pCode') {
        cnt += son.content.length;
      }
      else if (son.tag === 'pMath') {
        cnt += son.content.length / 3;
        cnt += son.lft.length;
        cnt += son.rgh.length;
      }
      else if (son.tag === 'pKbrd') {
        cnt += son.content.length / 2;
      }
      else if (son.tag === 'pEmoj') {
        cnt += 2;
      }
      if (cnt > MAX) {
        while (son !== ast.sons[ast.sons.length - 1]) {
          ast.sons.pop();
        }
        break;
      }
    }
  };
  dfs(excAST);

  const lastSon = excAST.sons[0].sons[excAST.sons[0].sons.length - 1];
  if (lastSon.tag === 'pText') {
    while (/[^a-zA-Z0-9]/.test(lastSon.content[lastSon.content.length - 1])) {
      lastSon.content = lastSon.content.slice(0, -1);
    }
    lastSon.content += '...';
  }
  else {
    excAST.sons[0].sons.push({ tag: 'pText', content: '...' });
  }
  return renderAST(excAST);
};
