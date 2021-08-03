import React from 'react';
import uuidv4 from 'uuid';
import { GatsbyImage } from 'gatsby-plugin-image';

import parse from './parser';
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
    return <p>{ast.content}</p>;
  }

  if (ast.tag === 'h2') return <h2>{ast.content}</h2>;
  if (ast.tag === 'h3') return <h3>{ast.content}</h3>;
  if (ast.tag === 'h4') return <h4>{ast.content}</h4>;
  if (ast.tag === 'h5') return <h5>{ast.content}</h5>;
  if (ast.tag === 'h6') return <h6>{ast.content}</h6>;

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

export default function render(str, media) {
  const ast = parse(str, media);
  return renderAST(ast);
};
