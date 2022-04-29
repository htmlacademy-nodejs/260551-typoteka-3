'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../../constants`);

const getSearchRouter = (service) => {
  const searchRouter = new Router();

  searchRouter.get(`/`, (req, res) => {
    let {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const searchResults = service.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;

    res.status(searchStatus)
      .json(searchResults);
  });

  return searchRouter;
};

module.exports = {getSearchRouter};
