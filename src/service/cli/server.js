'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

module.exports = {
  name: `--server`,
  run(value) {
    const port = Number.parseInt(value, 10) || DEFAULT_PORT;
    const app = express();

    app.use(express.json());

    app.get(`/posts`, async (req, res) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        res.json(mocks);
      } catch (_err) {
        res.send([]);
      }
    });

    app.listen(DEFAULT_PORT, () => console.log(chalk.green(`Сервер запущен на порту ${port}`)));
  }
};
