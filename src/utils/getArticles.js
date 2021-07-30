async function getArticle(graphql, slug) {
  const result = await graphql(`
    query GetArticle {
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
      allFile(filter: {relativeDirectory: {eq: "articles/${slug}"}, extension: {eq: "png"}}) {
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
  return {
    info: result.data.explicitArticle,
    images: result.data.allFile.edges.map(edge => ({
      name: edge.node.name,
      data: edge.node.childImageSharp.gatsbyImageData
    }))
  };
}

export default async function getArticles(graphql) {
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
  return await Promise.all(result.data.allExplicitArticle.edges.map(edge => getArticle(graphql, edge.node.slug)));
};
