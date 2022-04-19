'use strict';

class CategoryService {
  constructor(data) {
    this._articles = data;
  }

  findAll() {
    const categories = this._articles.reduce((res, article) => {
      return res.concat(article.category);
    }, []);

    return [...new Set(categories)];
  }
}

module.exports = CategoryService;
