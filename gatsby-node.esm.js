import { resolve } from 'path';
import getArticles from './src/utils/getArticles';
import getPages from './src/utils/getPages';
import { slugify, getArticleInfo, getPageInfo } from './src/utils/helpers';

export function createSchemaCustomization({ actions }) {
  actions.createTypes(`
    type ExplicitArticle implements Node {
      slug: String!
      title: String!
      author: String!
      date: Date!
      categories: [String!]!
      tags: [String!]!
      content: String!
      excerpt: String!
    }
    type ExplicitPage implements Node {
      slug: String!
      title: String!
      content: String!
    }
  `);
};

export function onCreatePage({ page, actions }) {
  if (process.env.NODE_ENV !== 'production' && page.path === '/404/') {
    page.matchPath = '/*';
    actions.createPage(page);
  }
};

export async function onCreateNode({ node, actions, loadNodeContent, createNodeId, createContentDigest }) {
  if (/articles\/.+\/index\.exp/.test(node.relativePath)) {
    const text = await loadNodeContent(node);
    const slug = node.relativePath.slice('articles/'.length, -'/index.exp'.length);
    const info = getArticleInfo(text);
    actions.createNode({
      slug,
      ...info,
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
    const info = getPageInfo(text);
    actions.createNode({
      slug,
      ...info,
      id: createNodeId(text),
      internal: {
        type: 'ExplicitPage',
        contentDigest: createContentDigest(text)
      }
    });
  }
};

export async function createPages({ graphql, actions }) {
  const articles = await getArticles(graphql);
  articles.forEach(article => {
    actions.createPage({
      path: `/${article.info.slug}/`,
      component: resolve('./src/templates/Article.js'),
      context: article
    });
  });

  const pages = await getPages(graphql);
  pages.forEach(page => {
    actions.createPage({
      path: `/${page.info.slug}/`,
      component: resolve('./src/templates/Page.js'),
      context: page
    });
  });

  actions.createPage({
    path: '/',
    component: resolve('./src/templates/ArticleList.js'),
    context: {
      pageTitle: '',
      articles
    }
  });

  const categoryMap = { };
  for (const article of articles) {
    for (const category of article.info.categories) {
      if (categoryMap[category] == null) {
        categoryMap[category] = [];
      }
      categoryMap[category].push(article);
    }
  }
  for (const category in categoryMap) {
    actions.createPage({
      path: `/category/${slugify(category)}/`,
      component: resolve('./src/templates/ArticleList.js'),
      context: {
        pageTitle: category,
        articles: categoryMap[category]
      }
    });
  }

  const tagMap = { };
  for (const article of articles) {
    for (const tag of article.info.tags) {
      if (tagMap[tag] == null) {
        tagMap[tag] = [];
      }
      tagMap[tag].push(article);
    }
  }
  for (const tag in tagMap) {
    actions.createPage({
      path: `/tag/${slugify(tag)}/`,
      component: resolve('./src/templates/ArticleList.js'),
      context: {
        pageTitle: tag,
        articles: tagMap[tag]
      }
    });
  }
};
