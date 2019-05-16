import express from 'express';
import fs from 'fs';

import Article from '../model/article.model';

import Articles from './articles/articles';
import Categories from './categories/categories';

const router = express.Router();
const manageArticles = new Articles();
const manageCategories = new Categories();

router.get('/api/get_article/:article_name', (req, res, next) => {
  if (!req.params.article_name) {
    res.status(404).send({ error: true, message: 'ArticleId not sent' });
    return;
  }
  manageArticles.getArticle(req.params.article_name, (art) => {
    if (art.error)
      res.status(500).send(art);
    else
      res.send(art);
  });
});

router.post('/api/create_article', (req, res, next) => {
  manageArticles.createArticle(req.body, (result) => {
    if (result.error)
      res.status(500).send(result);
    else
      res.send(result);
  });
});

router.put('/api/update_article', (req, res, next) => {
  manageArticles.updateArticle(req.body, (result) => {
    if (result.error)
      res.status(500).send(result);
    else
      res.send(result);
  });
});

router.get('/api/get_categories', (req, res, next) => {
  manageCategories.getCategoryList((result) => {
    if (result.error)
      res.status(500).send(result);
    else
      res.send(result);
  });
});

router.post('/api/get_blog_list', (req, res, next) => {
  manageCategories.getBlogListByCat(req.body, (result) => {
    if (result.error)
      res.status(500).send(result);
    else
      res.send(result);
  });
});

router.put('/api/update_article/:article_name', (req, res, next) => {

  manageArticles.updateArticle(req.body, req.params.article_name, (result) => {
    if (result.error)
      res.status(500).send(result);
    else
      res.send(result);
  });
});

router.get('/*', (req, res, next) => {
  res.send({
    error: true,
    message: 'invalid route'
  })
});

export default router;