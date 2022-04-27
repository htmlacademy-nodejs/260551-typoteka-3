"use strict";

const express = require(`express`);
const request = require(`supertest`);
const ArticleService = require(`../services/article`);
const CommentService = require(`../services/comment`);
const mockData = require(`./mocks/articles.mock.json`);
const {HttpCode} = require(`../../../constants`);
const {getArticlesRouter} = require(`./articles`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  const articleService = new ArticleService(cloneData);
  const commentService = new CommentService();

  app.use(express.json());
  app.use(`/api/articles`, getArticlesRouter(articleService, commentService));

  return app;
};

// articles
describe(`API returns a list of all articles`, () => {
  let response;
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).get(`/api/articles`);
  });

  test(`should article count is be changed`, () => request(app)
    .get(`/api/articles`)
    .expect((res) => expect(res.body.length).toBe(5))
  );

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`should a list contain 5 articles`, () => expect(response.body.length).toBe(5));
  test(`should each returned article have a title`, () => {
    response.body.map((article) => expect(article).toHaveProperty(`title`));
  });
});

describe(`API returns an article with a given id`, () => {
  let response;

  beforeAll(async () => {
    const app = createAPI();
    response = await request(app).get(`/api/articles/obFDCf`);
  });

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`should article's title be "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));
});

test(`API returns 404 with a non existing article id`, () => {
  const app = createAPI();
  return request(app).get(`/api/articles/abcde`).expect(HttpCode.NOT_FOUND);
});

describe(`API creates an article if data is valid`, () => {
  const validArticle = {
    title: `Title`,
    announce: `Announce`,
    createdDate: `2022-03-27T20:38:35.637Z`,
    fullText: `FullText`,
    category: [`Программирование`],
  };

  let response;
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app).post(`/api/articles`).send(validArticle);
  });

  test(`should status code be 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`should return created article`, () => {
    const createdArticle = response.body;

    return request(app)
      .get(`/api/articles/${createdArticle.id}`)
      .expect((res) => expect(res.body).toEqual(expect.objectContaining(createdArticle)));
  });
});

test(`API refuses to create an article without any required property`, async () => {
  const newArticle = {
    title: `Title`,
    announce: `Announce`,
    createdDate: `2022-03-27T20:38:35.637Z`,
    category: [`Программирование`],
  };

  const app = await createAPI();

  for (const key of Object.keys(newArticle)) {
    const badArticle = {...newArticle};
    delete badArticle[key];

    await request(app)
      .post(`/api/articles`)
      .send(badArticle)
      .expect(HttpCode.BAD_REQUEST);
  }
});

describe(`API changes existent article`, () => {
  const newArticle = {
    title: `New title`,
    announce: `Announce`,
    createdDate: `2022-03-27T20:38:35.637Z`,
    fullText: `FullText`,
    category: [`Программирование`],
  };

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/api/articles/obFDCf`)
      .send(newArticle);
  });

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`should return changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));

  test(`should article be really changed`, () => request(app)
    .get(`/api/articles/obFDCf`)
    .expect((res) => expect(res.body.title).toBe(`New title`))
  );
});

test(`API returns 404 when trying to change non-existent article`, () => {
  const app = createAPI();

  const validArticle = {
    title: `New title`,
    announce: `Announce`,
    createdDate: `2022-03-27T20:38:35.637Z`,
    fullText: `FullText`,
    category: [`Программирование`],
  };

  return request(app)
    .put(`/api/articles/NOEXST`)
    .send(validArticle)
    .expect(HttpCode.NOT_FOUND);
});

test(`API returns 400 when trying to change an article with invalid data`, () => {
  const app = createAPI();

  const invalidArticle = {
    title: `Это`,
    announce: `невалидный объект`,
    createdDate: `нет поля sum category`,
  };

  return request(app)
    .put(`/api/articles/NOEXST`)
    .send(invalidArticle)
    .expect(HttpCode.BAD_REQUEST);
});

describe(`API correctly deletes an article`, () => {
  let response;
  const app = createAPI();

  beforeAll(async () => {
    response = await request(app)
      .delete(`/api/articles/HK3fZS`);
  });

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`should return deleted article`, () => expect(response.body.id).toBe(`HK3fZS`));

  test(`should article count be 4 now`, () => request(app)
    .get(`/api/articles`)
    .expect((res) => {
      expect(res.body.length).toBe(4);
    })
  );
});

test(`API refuses to delete non-existent article`, () => {
  const app = createAPI();

  return request(app)
    .delete(`/api/articles/NOEXST`)
    .expect(HttpCode.NOT_FOUND);
});

// comments
describe(`API returns a list of comments to a given article`, () => {
  let response; let app;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/api/articles/HK3fZS/comments`);
  });

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`should return list of 3 comments`, () => expect(response.body.length).toBe(3));

  test(`should first comment's text be "Мне не нравится ваш стиль."`,
      () => expect(response.body[0].text).toBe(`Мне не нравится ваш стиль.`));
});

describe(`API creates a comment if data is valid`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .post(`/api/articles/u_sJyK/comments`)
      .send({
        text: `Валидный текст`
      });
  });

  test(`should status code be 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

  test(`should comments count be changed`, () => request(app)
    .get(`/api/articles/u_sJyK/comments`)
    .expect((res) => expect(res.body.length).toBe(7))
  );
});

test(`API refuses to create a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .post(`/api/articles/NONEXIST/comments`)
    .send({
      text: `Комментарий`
    })
    .expect(HttpCode.NOT_FOUND);
});

describe(`API correctly deletes a comment`, () => {
  let app; let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .delete(`/api/articles/KC_Hm2/comments/qJU8Wo`);
  });

  test(`should status code be 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`should comments count be changed`, () => request(app)
    .get(`/api/articles/KC_Hm2/comments`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existent comment`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/KC_Hm2/comments/NONEXIST`)
    .expect(HttpCode.NOT_FOUND);
});

test(`API refuses to delete a comment to non-existent article`, async () => {
  const app = await createAPI();

  return request(app)
    .delete(`/articles/NONEXIST/comments/1`)
    .expect(HttpCode.NOT_FOUND);
});
