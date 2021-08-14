import React from 'react';
import uuidv4 from 'uuid';
import { GatsbyImage } from 'gatsby-plugin-image';

import parse from './parser';
import { renderPara } from './paragraph';
import * as styles from '@styles/explicit.module.css';

import { SketchWrapper } from '@components/others';
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

  if (ast.tag === 'p') {
    return <p>{renderPara(ast.sons[0])}</p>;
  }

  if (ast.tag === 'h2') return <h2>{renderPara(ast.sons[0])}</h2>;
  if (ast.tag === 'h3') return <h3>{renderPara(ast.sons[0])}</h3>;
  if (ast.tag === 'h4') return <h4>{renderPara(ast.sons[0])}</h4>;
  if (ast.tag === 'h5') return <h5>{renderPara(ast.sons[0])}</h5>;
  if (ast.tag === 'h6') return <h6>{renderPara(ast.sons[0])}</h6>;

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
    return <SketchWrapper sketch={scripts[ast.script]} />;
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
          const pos = Math.max(
            strLft.lastIndexOf(' '),
            strLft.lastIndexOf('\n')
          );
          if (pos !== -1) {
            ast.sons[i].lft = strLft.slice(pos + 1);
            ast.sons[i - 1].content = strLft.slice(0, pos + 1);
          }
        }
      }
      ast.sons[i].rgh = '';
      if (ast.sons[i + 1].tag === 'pText') {
        const strRgh = ast.sons[i + 1].content;
        if (strRgh.length > 0) {
          let pos1 = strRgh.indexOf(' ' ); if (pos1 === -1) pos1 = 1e9;
          let pos2 = strRgh.indexOf('\n'); if (pos2 === -1) pos2 = 1e9;
          const pos = Math.min(pos1, pos2);
          if (pos !== 1e9) {
            ast.sons[i].rgh = strRgh.slice(0, pos);
            ast.sons[i + 1].content = strRgh.slice(pos);
          }
        }
      }
    }
  }
  for (const son of ast.sons) {
    fixKatexBug(son);
  }
}

export default function render(str, media) {
  const ast = parse(str, media);
  fixKatexBug(ast);
  return renderAST(ast);
};
