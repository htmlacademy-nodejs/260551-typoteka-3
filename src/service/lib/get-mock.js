'use strict';

const fs = require(`fs`).promises;
const {MOCKS_FILE_NAME} = require(`../../constants`);
const {logger} = require(`./logger`);

let data = [];

const getMocks = async () => {
  if (data.length) {
    return data;
  }

  try {
    const content = await fs.readFile(`${MOCKS_FILE_NAME}`, `utf8`);
    data = JSON.parse(content);
  } catch (err) {
    logger.error(`Ошибка чтения файла ${MOCKS_FILE_NAME}`);
  }

  return data;
};

module.exports = getMocks;
