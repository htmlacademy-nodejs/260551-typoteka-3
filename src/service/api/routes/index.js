'use strict';

const {Router} = require(`express`);
const {getArticlesRouter} = require(`./articles`);
const {getCategoriesRouter} = require(`./categories`);
const {getSearchRouter} = require(`./search`);
const ArticleService = require(`../services/article`);
const CommentService = require(`../services/comment`);
const CategoryService = require(`../services/category`);

const router = new Router();

const getRouter = (data) => {
  const commentService = new CommentService();
  const articleService = new ArticleService(data);
  const categoryService = new CategoryService(data);

  router.use(`/articles`, getArticlesRouter(articleService, commentService));
  router.use(`/categories`, getCategoriesRouter(categoryService));
  router.use(`/search`, getSearchRouter(articleService));

  return router;
};

module.exports = {getRouter};
