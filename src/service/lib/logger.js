'use strict';

const pino = require(`pino`);

const LOG_FILE = `./logs/api.log`;
const isDebugMode = process.env.LOG_LEVEL === `debug`;
const pinoOutput = isDebugMode ? process.stdout : pino.destination(LOG_FILE);

const pinoOptions = {
  name: `base-logger`,
  level: process.env.LOG_LEVEL || `info`,
  transport: isDebugMode ? {target: `pino-pretty`} : undefined,
};

const logger = pino(pinoOptions, pinoOutput);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
