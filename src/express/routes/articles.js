'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.post(`/add`, (req, res) => res.render(`post`));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`post`));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/:id`, (req, res) => res.render(`post-detail`));

module.exports = articlesRouter;