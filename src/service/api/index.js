'use strict';

const express = require(`express`);
const {getRouter} = require(`./routes`);
const {API_PREFIX, HttpCode} = require(`../../constants`);
const getMocks = require(`../lib/get-mock`);

const runServer = async (port, logger) => {
  const mockData = await getMocks();
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);

    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });

    next();
  });

  app.use(API_PREFIX, getRouter(mockData));

  app.use((req, res) => {
    res.status(HttpCode.NOT_FOUND)
      .send(`Not found`);

    logger.error(`Route not found: ${req.url}`);
  });

  app.use((err, _req, _res, _next) => {
    logger.error(`An error occurred on processing request: ${err.message}`);
  });

  try {
    app.listen(port, (err) => {
      if (err) {
        return logger.error(`An error occurred on server creation: ${err.message}`);
      }

      return logger.info(`Server is running on ${port}`);
    });
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);
    process.exit(1);
  }
};

module.exports = {runServer};
