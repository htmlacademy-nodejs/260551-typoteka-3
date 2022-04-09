'use strict';

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomItemsFromArray = (array, count) => {
  return [...Array(count)].map(() => {
    return array[getRandomInt(0, array.length - 1)];
  });
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getRandomDate = (start, end) => {
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
};

const getPreviousMonthStart = (monthsNumber) => {
  const currentDate = new Date();
  return new Date(currentDate.getFullYear(), currentDate.getMonth() - monthsNumber, 1);
};

module.exports = {
  getRandomInt,
  getRandomItemsFromArray,
  shuffle,
  getRandomDate,
  getPreviousMonthStart
};

