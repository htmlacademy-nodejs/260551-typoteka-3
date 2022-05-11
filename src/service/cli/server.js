'use strict';

const {runServer} = require(`../api`);
const sequelize = require(`../lib/sequelize`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3001;

module.exports = {
  name: `--server`,
  async run(value) {
    const logger = getLogger({name: `api`});

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }

    const port = Number.parseInt(value, 10) || DEFAULT_PORT;

    runServer(port, logger);
  }
};
