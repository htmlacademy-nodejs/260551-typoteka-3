'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

const searchRouter = new Router();

const getSearchRouter = (service) => {
  searchRouter.get(`/`, (req, res) => {
    const {query = ``} = req.query;
    const searchResults = service.findAll(query);

    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });

  return searchRouter;
};

module.exports = {getSearchRouter};
