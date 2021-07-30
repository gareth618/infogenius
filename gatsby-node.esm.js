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

  const createPagination = (basePath, title, articles) => {
    const pageToUrl = page => {
      return page === 1 ? basePath : `${basePath}page/${page}/`
    };
    const ARTICLES_ON_PAGE = 2;
    const pageCount = Math.floor(articles.length / ARTICLES_ON_PAGE) + (articles.length % ARTICLES_ON_PAGE > 0 ? 1 : 0);
    for (let i = 0; i < articles.length; i += ARTICLES_ON_PAGE) {
      const currentPage = i / ARTICLES_ON_PAGE + 1;
      actions.createPage({
        path: pageToUrl(currentPage),
        component: resolve('./src/templates/ArticleList.js'),
        context: {
          pageTitle: title,
          articles: articles.slice(i, i + ARTICLES_ON_PAGE),
          olderPage: currentPage < pageCount ? pageToUrl(currentPage + 1) : null,
          newerPage: currentPage > 1 ? pageToUrl(currentPage - 1) : null
        }
      });
    }
  };
  createPagination('/', '', articles);

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
    createPagination(
      `/category/${slugify(category)}/`,
      category,
      categoryMap[category]
    );
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
    createPagination(
      `/tag/${slugify(tag)}/`,
      tag,
      tagMap[tag]
    );
  }
};
