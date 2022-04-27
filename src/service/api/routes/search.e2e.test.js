"use strict";

const express = require(`express`);
const request = require(`supertest`);
const ArticleService = require(`../services/article`);
const mockData = require(`./mocks/articles.mock.json`);
const {HttpCode} = require(`../../../constants`);
const {getSearchRouter} = require(`./search`);

const articleService = new ArticleService(mockData);

const app = express();
app.use(express.json());
app.use(`/api/search`, getSearchRouter(articleService));

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/api/search`)
      .query({
        query: `Обзор`
      });
  });

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`should find 1 article`, () => expect(response.body.length).toBe(1));
  test(`should article has correct id`, () => expect(response.body[0].id).toBe(`KC_Hm2`));
});

test(`API returns 404 if no articles found`, () => {
  return request(app)
    .get(`/api/search`)
    .query({
      query: `абвгде`
    }).expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when query string is absent`, () => {
  return request(app)
    .get(`/api/search`)
    .query({
      query: ``
    }).expect(HttpCode.BAD_REQUEST);
});
