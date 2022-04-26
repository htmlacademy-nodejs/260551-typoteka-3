"use strict";

const express = require(`express`);
const request = require(`supertest`);
const CategoryService = require(`../services/category`);
const mockData = require(`./mocks/articles.mock.json`);
const {HttpCode} = require(`../../../constants`);
const {getCategoriesRouter} = require(`./categories`);

const categoryService = new CategoryService(mockData);

const app = express();
app.use(express.json());
app.use(`/api/categories`, getCategoriesRouter(categoryService));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app).get(`/api/categories`);
  });

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`should list contain 3 categories`, () => expect(response.body.length).toBe(3));
  test(`should category names be "Программирование", "Деревья", "Политика"`, () => {
    expect(response.body).toEqual(
        expect.arrayContaining([`Программирование`, `Деревья`, `Политика`])
    );
  });
});
