'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {getRouter} = require(`./routes`);
const {API_PREFIX, MOCKS_FILE_NAME} = require(`../../constants`);

const app = express();

app.use(express.json());

const readMocks = async () => {
  try {
    const content = await fs.readFile(`${MOCKS_FILE_NAME}`, `utf8`);
    return JSON.parse(content);
  } catch (err) {
    console.log(chalk.red(`Ошибка чтения файла ${MOCKS_FILE_NAME}`));
    return [];
  }
};

const runServer = async (port) => {
  const mockData = await readMocks();

  app.use(API_PREFIX, getRouter(mockData));

  try {
    app.listen(port, () => {
      console.log(chalk.green(`Сервер запущен на порту ${port}`));
    });
  } catch (err) {
    console.log(chalk.red(`Произошла ошибка: ${err.message}`));
    process.exit(1);
  }
};

module.exports = {runServer};
