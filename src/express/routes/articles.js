'use strict';

const {Router} = require(`express`);
const upload = require(`../middlewares/upload`);
const api = require(`../api`).getAPI();

const articlesRouter = new Router();

articlesRouter.get(`/add`, async (req, res) => {
  res.render(`add-post`);
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;

  const article = {
    photo: file ? file.filename : ``,
    title: body.title,
    createdDate: body.date,
    announce: body.announcement,
    fullText: body[`full-text`],
    category: [`Автомобили`],
  };

  try {
    await api.createArticle(article);
    res.redirect(`/my`);
  } catch (err) {
    res.render(`add-post`, {article});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);

  res.render(`edit-post`, {article});
});

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/:id`, (req, res) => res.render(`post-detail`));

module.exports = articlesRouter;
