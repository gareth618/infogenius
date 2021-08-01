async function getPost(type, graphql, slug) {
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
          content
          excerpt
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
            publicURL
          }
        }
      }
    }
  `);

  return {
    info: resultEXP.data[`explicit${Type}`],
    images: resultPNG.data.allFile.edges.map(edge => ({
      name: edge.node.name,
      data: edge.node.childImageSharp.gatsbyImageData
    })),
    videos: resultMP4.data.allFile.edges.map(edge => ({ name: edge.node.name, url: edge.node.publicURL })),
    scripts: resultJS.data.allFile.edges.map(edge => ({ name: edge.node.name, url: edge.node.publicURL }))
  };
}

export async function getArticles(graphql) {
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
  return await Promise.all(result.data.allExplicitArticle.edges.map(edge => getPost('article', graphql, edge.node.slug)));
};

export async function getPages(graphql) {
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
  return await Promise.all(result.data.allExplicitPage.edges.map(edge => getPost('page', graphql, edge.node.slug)));
};
