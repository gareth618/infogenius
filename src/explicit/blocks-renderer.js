import React from 'react';
import uuidv4 from 'uuid';

import { GatsbyImage } from 'gatsby-plugin-image';
import renderInline from './inline-renderer';

import * as sketches from './../../content';
import { Sketch } from '@components/explicit';

export default function renderBlocks(ast) {
  if (ast.tag === 'p') return <p>{renderInline(ast.sons)}</p>;
  if (ast.tag === 'h2') return <h2 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderInline(ast.sons)}</a></h2>;
  if (ast.tag === 'h3') return <h3 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderInline(ast.sons)}</a></h3>;
  if (ast.tag === 'h4') return <h4 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderInline(ast.sons)}</a></h4>;
  if (ast.tag === 'h5') return <h5 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderInline(ast.sons)}</a></h5>;
  if (ast.tag === 'h6') return <h6 id={`header-${ast.id}`}><a href={`#header-${ast.id}`}>{renderInline(ast.sons)}</a></h6>;
  if (ast.tag === 'hr') return <hr />;
  if (ast.tag === 'item-small') return renderInline(ast.sons);

  if (ast.tag === 'math-block') {
    return (
      <div
        className="math-wrapper"
        dangerouslySetInnerHTML={{ __html: ast.math }}
      />
    );
  }
  if (ast.tag === 'png') {
    return (
      <div className="img-wrapper" style={{ width: ast.width }}>
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
    return <Sketch script={sketches[ast.sketch]} />;
  }

  if (ast.tag === 'list') {
    const items = ast.sons.map(son => <li key={uuidv4()}>{renderBlocks(son)}</li>);
    if (ast.type === 'bullet') return <ul className={ast.spaced ? '' : 'not-spaced-list'} style={{ listStyleType: 'disc' }}>{items}</ul>;
    if (ast.type === 'none') return <ul className={ast.spaced ? '' : 'not-spaced-list'} style={{ listStyleType: 'none' }}>{items}</ul>;
    const typeName = ast.type[0] === '*' ? ast.type.slice(2, -2) : ast.type;
    const typeBold = ast.type[0] === '*';
    return (
      <ol
        className={`${typeBold ? 'bold-list' : ''} ${ast.spaced ? '' : 'not-spaced-list'}`.trim()}
        style={{ listStyleType:
          typeName === '1.' ? 'decimal' :
          typeName === 'a.' ? 'lower-latin' :
          typeName === 'A.' ? 'upper-latin' :
          typeName === 'i.' ? 'lower-roman' :
          typeName === 'I.' ? 'upper-roman' : ''
        }}
      >
        {items}
      </ol>
    );
  }

  const sons = ast.sons && ast.sons.map(son => <React.Fragment key={uuidv4()}>{renderBlocks(son)}</React.Fragment>);
  if (ast.tag === 'root') return sons;
  if (ast.tag === 'item') return sons;
  if (ast.tag === 'quote') return <blockquote>{sons}</blockquote>;
  if (ast.tag === 'center') return <div className="center">{sons}</div>;
  if (ast.tag === 'right') return <div className="right">{sons}</div>;
};
