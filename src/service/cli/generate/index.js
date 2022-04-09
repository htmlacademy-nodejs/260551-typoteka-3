'use strict';

const fs = require(`fs`).promises;
const {getRandomInt, getRandomItemsFromArray, shuffle, getRandomDate, getPreviousMonthStart} = require(`../../../utils`);
const {EXIT_CODE} = require(`../../../constants`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_ANNOUNCE_LENGTH = 5;
const MAX_TEXT_LENGTH = 50;
const INCLUDED_MONTHS_NUMBER = 2;
const FILE_NAME = `mocks.json`;
const DATA_FOLDER_PATH = `${__dirname}/data`;
const SENTENCES_FILE = `sentences.txt`;
const TITLES_FILE = `titles.txt`;
const CATEGORIES_FILE = `categories.txt`;

const readContent = async (file, path = DATA_FOLDER_PATH) => {
  try {
    const content = await fs.readFile(`${path}/${file}`, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(err);
    return [];
  }
};

const generatePosts = (count, titles, categories, sentences) => (
  [...Array(count)].map(() => {
    const fullTextLength = getRandomInt(MAX_ANNOUNCE_LENGTH, MAX_TEXT_LENGTH);
    const fullTextSentences = getRandomItemsFromArray(sentences, fullTextLength);
    const announceCount = getRandomInt(1, MAX_ANNOUNCE_LENGTH);
    const categoriesCount = getRandomInt(1, categories.length);
    const startDate = getPreviousMonthStart(INCLUDED_MONTHS_NUMBER);

    return {
      title: titles[getRandomInt(0, titles.length - 1)],
      createdDate: getRandomDate(startDate, new Date()),
      announce: fullTextSentences.slice(0, announceCount).join(` `),
      fullText: fullTextSentences.join(` `),
      category: shuffle(categories).slice(0, categoriesCount),
    };
  })
);

module.exports = {
  name: `--generate`,
  async run(count) {
    const sentences = await readContent(SENTENCES_FILE);
    const titles = await readContent(TITLES_FILE);
    const categories = await readContent(CATEGORIES_FILE);

    const postsNumber = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (postsNumber > MAX_COUNT) {
      console.error(`Не больше ${MAX_COUNT} публикаций`);
      process.exit(EXIT_CODE.ERROR);
    }

    if (postsNumber <= 0) {
      console.error(`Укажите положительное число публикаций`);
      process.exit(EXIT_CODE.ERROR);
    }

    const content = JSON.stringify(generatePosts(postsNumber, titles, categories, sentences));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(`Операция успешна. Файл создан.`);
    } catch (err) {
      console.error(`Невозможно записать данные в файл...`);
    }
  }
};
