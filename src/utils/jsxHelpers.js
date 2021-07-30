import React from 'react';
import { Link } from 'gatsby';
import uuidv4 from 'uuid';
import { slugify } from '@utils/helpers';

export function categoriesToJSX(categories) {
  return categories.map((category, index) =>
    <React.Fragment key={uuidv4()}>
      {index > 0 ? ', ' : ''}
      <Link to={`/category/${slugify(category)}/`}>
        {category}
      </Link>
    </React.Fragment>
  );
};
