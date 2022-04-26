'use strict';

const pino = require(`pino`);
const {Env} = require(`../../constants`);

const LOG_FILE = `./logs/api.log`;
const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `info` : `error`;
const pinoOutput = isDevMode ? process.stdout : pino.destination(LOG_FILE);

const pinoOptions = {
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  transport: isDevMode ? {target: `pino-pretty`} : undefined,
};

const logger = pino(pinoOptions, pinoOutput);

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
