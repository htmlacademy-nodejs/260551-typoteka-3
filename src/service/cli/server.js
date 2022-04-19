'use strict';

const {runServer} = require(`../api`);

const DEFAULT_PORT = 3001;

module.exports = {
  name: `--server`,
  run(value) {
    const port = Number.parseInt(value, 10) || DEFAULT_PORT;
    runServer(port);
  }
};
