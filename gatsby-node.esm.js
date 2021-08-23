import { resolve } from 'path';
import { followsRegex, slugify } from './src/utils/helpers';
import { getImportedSketches, getArticles, getPages, getArticleInfo, getPageInfo } from './src/utils/posts';

export function createSchemaCustomization({ actions }) {
  actions.createTypes(`
    type ExplicitArticle implements Node {
      slug: String!
      title: String!
      author: String!
      date: Date!
      categories: [String!]!
      tags: [String!]!
      description: String!
      content: String!
    }
    type ExplicitPage implements Node {
      slug: String!
      title: String!
      content: String!
    }
  `);
};

export async function onCreateNode({ node, actions, loadNodeContent, createNodeId, createContentDigest }) {
  if (node.relativePath == null) return;
  const testArticle = followsRegex(node.relativePath, /articles\/(?<slug>[a-z\d]+(-[a-z\d]+)*)\/index\.exp/);
  const testPage = followsRegex(node.relativePath, /pages\/(?<slug>[a-z\d]+(-[a-z\d]+)*)\/index\.exp/);
  if (testArticle != null) {
    const text = await loadNodeContent(node);
    const info = getArticleInfo(text);
    if (info != null) {
      actions.createNode({
        slug: testArticle.slug,
        ...info,
        id: createNodeId(text),
        internal: {
          type: 'ExplicitArticle',
          contentDigest: createContentDigest(text)
        }
      });
    }
  }
  else if (testPage != null) {
    const text = await loadNodeContent(node);
    const info = getPageInfo(text);
    if (info != null) {
      actions.createNode({
        slug: testPage.slug,
        ...info,
        id: createNodeId(text),
        internal: {
          type: 'ExplicitPage',
          contentDigest: createContentDigest(text)
        }
      });
    }
  }
  else if (node.relativePath === 'index.js') {
    await loadNodeContent(node);
  }
};

export async function createPages({ graphql, actions }) {
  const importedSketches = await getImportedSketches(graphql);
  const articles = await getArticles(graphql, importedSketches);
  for (const article of articles) {
    actions.createPage({
      path: `/${article.slug}/`,
      component: resolve('./src/templates/Article.js'),
      context: article
    });
  }
  const pages = await getPages(graphql, importedSketches);
  for (const page of pages) {
    actions.createPage({
      path: `/${page.slug}/`,
      component: resolve('./src/templates/Page.js'),
      context: page
    });
  }

  const createPagination = (basePath, title, articles) => {
    const ARTICLES_ON_PAGE = 2;
    const pageToURL = page => page === 1 ? basePath : `${basePath}page/${page}/`;
    const pageCount = Math.floor(articles.length / ARTICLES_ON_PAGE) + (articles.length % ARTICLES_ON_PAGE > 0 ? 1 : 0);
    for (let i = 0; i < articles.length; i += ARTICLES_ON_PAGE) {
      const currentPage = i / ARTICLES_ON_PAGE + 1;
      actions.createPage({
        path: pageToURL(currentPage),
        component: resolve('./src/templates/ArticleList.js'),
        context: {
          pageTitle: title,
          articles: articles.slice(i, i + ARTICLES_ON_PAGE),
          olderPage: currentPage < pageCount ? pageToURL(currentPage + 1) : undefined,
          newerPage: currentPage > 1 ? pageToURL(currentPage - 1) : undefined
        }
      });
    }
  };
  createPagination('/', '', articles);

  const categoryMap = { };
  for (const article of articles) {
    for (const category of article.categories) {
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
    for (const tag of article.tags) {
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

export function onCreatePage({ page, actions }) {
  if (process.env.NODE_ENV !== 'production' && page.path === '/404/') {
    page.matchPath = '/*';
    actions.createPage(page);
  }
};
