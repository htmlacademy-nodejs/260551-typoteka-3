'use strict';

const {nanoid} = require(`nanoid`);

class CommentService {
  findAll(article) {
    return article.comments;
  }

  create(article, comment) {
    const newComment = Object.assign({id: nanoid()}, comment);

    article.comments.push(newComment);

    return newComment;
  }

  delete(article, commentId) {
    const comments = article.comments;
    const comment = comments.find((item) => item.id === commentId);

    if (!comment) {
      return null;
    }

    article.comments = comments.filter((item) => item.id !== commentId);

    return comment;
  }
}

module.exports = CommentService;
