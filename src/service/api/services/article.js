'use strict';

const {nanoid} = require(`nanoid`);

class ArticleService {
  constructor(data) {
    this._articles = data;
  }

  findAll(query) {
    if (!query) {
      return this._articles;
    }

    return this._articles.filter((article) => article.title.includes(query));
  }

  findOne(id) {
    return this._articles.find((article) => article.id === id);
  }

  create(article) {
    const newArticle = Object.assign({id: nanoid(), comments: []}, article);

    this._articles.push(newArticle);

    return newArticle;
  }


  update(id, article) {
    const oldArticle = this.findOne(id);

    if (!oldArticle) {
      return null;
    }

    return Object.assign(oldArticle, article);
  }

  delete(id) {
    const article = this.findOne(id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);

    return article;
  }
}

module.exports = ArticleService;
