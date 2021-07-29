import { resolve } from 'path';
import getArticleInfo from './src/utils/getArticleInfo';

export function onCreatePage({ page, actions }) {
  if (process.env.NODE_ENV !== 'production' && page.path === '/404/') {
    page.matchPath = '/*';
    actions.createPage(page);
  }
}

export function createSchemaCustomization({ actions }) {
  actions.createTypes(`
    type ExplicitArticle implements Node {
      slug: String!
      title: String!
      author: String!
      date: Date!
      categories: [String!]!
      tags: [String!]!
      excerpt: String!
      content: String!
    }
    type ExplicitPage implements Node {
      slug: String!
      title: String!
      content: String!
    }
  `);
}

export async function onCreateNode({ node, actions, loadNodeContent, createNodeId, createContentDigest }) {
  if (/articles\/.+\/index\.exp/.test(node.relativePath)) {
    const text = await loadNodeContent(node);
    const info = getArticleInfo(text);
    const slug = node.relativePath.slice('articles/'.length, -'/index.exp'.length);

    actions.createNode({
      ...info,
      slug,
      id: createNodeId(text),
      internal: {
        type: 'ExplicitArticle',
        contentDigest: createContentDigest(text)
      }
    });
  }
  else if (/pages\/.+\/index\.exp/.test(node.relativePath)) {
    const text = await loadNodeContent(node);
    const slug = node.relativePath.slice('pages/'.length, -'/index.exp'.length);
    const title = text.slice('NAME: '.length, text.indexOf('\n'));
    const content = text.slice(text.indexOf('\n') + 2);

    actions.createNode({
      slug,
      title,
      content,
      id: createNodeId(text),
      internal: {
        type: 'ExplicitPage',
        contentDigest: createContentDigest(text)
      }
    });
  }
}

export async function createPages({ graphql, actions }) {
  const articlesResult = await graphql(`
    query GetArticleSlugs {
      allExplicitArticle(sort: {fields: date, order: DESC}) {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);
  const articleSlugs = articlesResult.data.allExplicitArticle.edges.map(edge => edge.node.slug);

  articleSlugs.forEach(slug => {
    actions.createPage({
      path: `/${slug}/`,
      component: resolve('./src/templates/ArticlePage.js'),
      context: {
        slug,
        dirSlug: `articles/${slug}`
      }
    });
  });

  const articlePreviews = await Promise.all(articleSlugs.map(async slug => {
    const result = await graphql(`
      query GetArticlePreviews {
        explicitArticle(slug: {eq: "${slug}"}) {
          slug
          title
          author
          date
          categories
          tags
          excerpt
        }
        file(relativePath: {eq: "articles/${slug}/index.png"}) {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: NONE
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    `);
    return ({
      info: result.data.explicitArticle,
      images: [{
        name: 'index',
        data: result.data.file.childImageSharp.gatsbyImageData
      }]
    });
  }));

  actions.createPage({
    path: '/',
    component: resolve('./src/templates/ArticleList.js'),
    context: {
      homePage: true,
      articlePreviews
    }
  });

  const categoryMap = { };
  for (const article of articlePreviews) {
    for (const category of article.info.categories) {
      if (categoryMap[category] == null)
        categoryMap[category] = [];
      categoryMap[category].push(article);
    }
  }
  for (const category in categoryMap) {
    actions.createPage({
      path: `/category/${slugify(category)}/`,
      component: resolve('./src/templates/ArticleList.js'),
      context: {
        homePage: false,
        title: category,
        articlePreviews: categoryMap[category]
      }
    });
  }

  const tagMap = { };
  for (const article of articlePreviews) {
    for (const tag of article.info.tags) {
      if (tagMap[tag] == null)
        tagMap[tag] = [];
      tagMap[tag].push(article);
    }
  }
  for (const tag in tagMap) {
    actions.createPage({
      path: `/tag/${slugify(tag)}/`,
      component: resolve('./src/templates/ArticleList.js'),
      context: {
        homePage: false,
        title: tag,
        articlePreviews: tagMap[tag]
      }
    });
  }

  const pagesResult = await graphql(`
    query GetPageSlugs {
      allExplicitPage {
        edges {
          node {
            slug
          }
        }
      }
    }  
  `);
  const pageSlugs = pagesResult.data.allExplicitPage.edges.map(edge => edge.node.slug);

  pageSlugs.forEach(slug => {
    actions.createPage({
      path: `/${slug}/`,
      component: resolve('./src/templates/PagePage.js'),
      context: {
        slug
      }
    });
  });
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\+/g, 'p')
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/ /g, '-');
}
