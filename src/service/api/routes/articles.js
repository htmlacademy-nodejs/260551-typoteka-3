'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);
const articleValidator = require(`../middlewares/article-validator`);

const getArticlesRouter = (articleService, commentService) => {
  const articlesRouter = new Router();

  articlesRouter.get(`/`, (req, res) => {
    const articles = articleService.findAll();

    res.status(HttpCode.OK)
      .send(articles);
  });

  articlesRouter.post(`/`, articleValidator, (req, res) => {
    const data = req.body;
    const article = articleService.create(data);

    res.status(HttpCode.CREATED)
      .json(article);
  });

  articlesRouter.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;

    const article = articleService.findOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.put(`/:articleId`, articleValidator, (req, res) => {
    const {articleId} = req.params;
    const data = req.body;
    const article = articleService.update(articleId, data);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.delete(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.delete(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    res.status(HttpCode.OK)
      .json(article);
  });

  articlesRouter.get(`/:articleId/comments`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Article not found`);
    }

    const comments = commentService.findAll(article);

    res.status(HttpCode.OK)
      .json(comments);
  });

  articlesRouter.post(`/:articleId/comments`, (req, res) => {
    const {articleId} = req.params;
    const data = req.body;
    const article = articleService.findOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Article not found`);
    }

    const comment = commentService.create(article, data);

    res.status(HttpCode.CREATED)
      .json(comment);
  });

  articlesRouter.delete(`/:articleId/comments/:commentId`, (req, res) => {
    const {articleId, commentId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Article not found`);
    }

    const comment = commentService.delete(article, commentId);

    if (!comment) {
      res.status(HttpCode.NOT_FOUND)
        .send(`Comment not found`);
    }

    res.status(HttpCode.OK)
      .json(comment);
  });

  return articlesRouter;
};

module.exports = {getArticlesRouter};
