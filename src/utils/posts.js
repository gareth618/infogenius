import { sanitize, toCamelCase, stringToDate, dateToString } from './helpers';

export async function getImportedSketches(graphql) {
  const result = await graphql(`
    query GetIndexJS {
      file(relativePath: {eq: "index.js"}) {
        name
        internal {
          content
        }
      }
    }
  `);
  const content = result.data.file.internal.content;

  const lft = content.indexOf('{');
  const rgh = content.indexOf('}');
  const imports = content.slice(lft + 2, rgh - 1);

  const importedSketches = [];
  const lines = imports.split('\n');
  for (const line of lines) {
    let sketch = line.trim();
    if (sketch.slice(-1) === ',') {
      sketch = sketch.slice(0, -1);
    }
    importedSketches.push(sketch);
  }
  return importedSketches;
};

async function getPost(type, graphql, importedSketches, slug) {
  const Type = type === 'article' ? 'Article' : 'Page';
  const resultEXP = type === 'article'
    ? await graphql(`
      query GetArticleEXP {
        explicitArticle(slug: {eq: "${slug}"}) {
          slug
          title
          author
          date
          categories
          tags
          description
          content
        }
      }
    `)
    : await graphql(`
      query GetPageEXP {
        explicitPage(slug: {eq: "${slug}"}) {
          slug
          title
          content
        }
      }
    `);
  const resultPNG = await graphql(`
    query Get${Type}PNG {
      allFile(filter: {relativeDirectory: {eq: "${type}s/${slug}"}, extension: {eq: "png"}}) {
        edges {
          node {
            name
            childImageSharp {
              gatsbyImageData(
                layout: FULL_WIDTH
                placeholder: NONE
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
        }
      }
    }
  `);
  const resultMP4 = await graphql(`
    query Get${Type}MP4 {
      allFile(filter: {relativeDirectory: {eq: "${type}s/${slug}"}, extension: {eq: "mp4"}}) {
        edges {
          node {
            name
            publicURL
          }
        }
      }
    }
  `);
  const resultJS = await graphql(`
    query Get${Type}JS {
      allFile(filter: {relativeDirectory: {eq: "${type}s/${slug}"}, extension: {eq: "js"}}) {
        edges {
          node {
            name
          }
        }
      }
    }
  `);

  const images = resultPNG.data.allFile.edges.map(edge => ({
    name: edge.node.name,
    data: edge.node.childImageSharp.gatsbyImageData
  }));
  const videos = resultMP4.data.allFile.edges.map(edge => ({
    name: edge.node.name,
    url: edge.node.publicURL
  }));
  const sketches = resultJS.data.allFile.edges
    .map(edge => toCamelCase(edge.node.name))
    .filter(name => importedSketches.includes(name));

  const post = {
    ...resultEXP.data[`explicit${Type}`],
    media: { images, videos, sketches }
  };
  if (type === 'article') {
    post.date = dateToString(new Date(post.date));
  }
  return post;
}

export async function getArticles(graphql, importedSketches) {
  const result = await graphql(`
    query GetArticles {
      allExplicitArticle(sort: {fields: date, order: DESC}) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return await Promise.all(result.data.allExplicitArticle.edges.map(edge =>
    getPost('article', graphql, importedSketches, edge.node.slug)
  ));
};

export async function getPages(graphql, importedSketches) {
  const result = await graphql(`
    query GetPages {
      allExplicitPage {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  return await Promise.all(result.data.allExplicitPage.edges.map(edge =>
    getPost('page', graphql, importedSketches, edge.node.slug)
  ));
};

export function getArticleInfo(str) {
  const match = str.match(
    'TITLE: (?<title>.*)\\n'
    + 'AUTHOR: (?<author>.*)\\n'
    + 'DATE: (?<date>\\d\\d\\/\\d\\d\\/\\d\\d\\d\\d)\\n'
    + 'CATEGORIES: (?<categories>.*)\\n'
    + 'TAGS: (?<tags>.*)\\n'
    + 'DESCRIPTION: (?<description>.*)\\n\\n'
  );
  if (match == null || match.index !== 0) return;
  return {
    title: match.groups.title,
    author: match.groups.author,
    date: stringToDate(match.groups.date),
    categories: match.groups.categories.split(', '),
    tags: match.groups.tags.split(', '),
    description: sanitize(match.groups.description),
    content: str.slice(match[0].length)
  }
};

export function getPageInfo(str) {
  const match = str.match(/TITLE: (?<title>.*)\n\n/);
  if (match == null || match.index !== 0) return;
  return {
    title: match.groups.title,
    content: str.slice(match[0].length)
  };
};
