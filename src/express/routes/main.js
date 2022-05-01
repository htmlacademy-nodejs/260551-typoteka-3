'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, {articles});
});

mainRouter.get(`/register`, (req, res) => res.render(`auth/sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`auth/login`));

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;

  if (!query.trim()) {
    res.render(`search`);
    return;
  }

  try {
    const articles = await api.search(query);
    res.render(`search`, {query, articles});
  } catch (err) {
    res.render(`search`, {query, articles: []});
  }
});

mainRouter.get(`/404`, (req, res) => res.render(`errors/404`));
mainRouter.get(`/500`, (req, res) => res.render(`errors/500`));

module.exports = mainRouter;
