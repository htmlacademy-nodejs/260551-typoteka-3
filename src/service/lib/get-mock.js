'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {MOCKS_FILE_NAME} = require(`../../constants`);

const getMocks = async () => {
  try {
    const content = await fs.readFile(`${MOCKS_FILE_NAME}`, `utf8`);
    return JSON.parse(content);
  } catch (err) {
    console.log(chalk.red(`Ошибка чтения файла ${MOCKS_FILE_NAME}`));
    return [];
  }
};

module.exports = getMocks;
