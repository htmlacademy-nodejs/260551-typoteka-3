'use strict';

const {Cli} = require(`./cli`);
const {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  EXIT_CODE
} = require(`../constants`);

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [command, value] = userArguments;

if (userArguments.length === 0 || !Cli[command]) {
  Cli[DEFAULT_COMMAND].run();
  process.exit(EXIT_CODE.SUCCESS);
}

Cli[command].run(value);

