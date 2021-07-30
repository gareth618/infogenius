async function getPage(graphql, slug) {
  const result = await graphql(`
    query GetPage {
      explicitPage(slug: {eq: "${slug}"}) {
        slug
        title
        content
      }
      allFile(filter: {relativeDirectory: {eq: "pages/${slug}"}, extension: {eq: "png"}}) {
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
    info: result.data.explicitPage,
    images: result.data.allFile.edges.map(edge => ({
      name: edge.node.name,
      data: edge.node.childImageSharp.gatsbyImageData
    }))
  };
}

export default async function getPages(graphql) {
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
  return await Promise.all(result.data.allExplicitPage.edges.map(edge => getPage(graphql, edge.node.slug)));
};
