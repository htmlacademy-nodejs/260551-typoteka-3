'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

const categoriesRouter = new Router();

const getCategoriesRouter = (service) => {
  categoriesRouter.get(`/`, (req, res) => {
    const categories = service.findAll();

    res.status(HttpCode.OK)
      .json(categories);
  });

  return categoriesRouter;
};

module.exports = {getCategoriesRouter};
