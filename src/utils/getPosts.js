import { toCamelCase } from './helpers';

export async function getImportedScripts(graphql) {
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

  const importedScripts = [];
  const lines = imports.split('\n');
  for (const line of lines) {
    let script = line.trim();
    if (script.slice(-1) === ',') {
      script = script.slice(0, -1);
    }
    importedScripts.push(script);
  }
  return importedScripts;
};

async function getPost(type, graphql, importedScripts, slug) {
  const Type = type === 'article'
    ? 'Article'
    : 'Page';

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
  const scripts = resultJS.data.allFile.edges
    .map(edge => toCamelCase(edge.node.name))
    .filter(name => importedScripts.includes(name));

  return {
    ...resultEXP.data[`explicit${Type}`],
    images,
    videos,
    scripts
  };
}

export async function getArticles(graphql, importedScripts) {
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
    getPost('article', graphql, importedScripts, edge.node.slug)
  ));
};

export async function getPages(graphql, importedScripts) {
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
    getPost('page', graphql, importedScripts, edge.node.slug)
  ));
};
