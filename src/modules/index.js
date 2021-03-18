const express = require('express');

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('./Category/Category');

const {
  getArticle,
  updateArticle,
  createArticle,
  deleteArticle,
  toggleArticle,
  getArticlesByCategory,
  getArticleMap,
} = require('./Article/Article');

const Response = require('../models/Response');

const router = express.Router();

/**
 * Article APIs
 */
router.post('/api/create_article', async (req, res) => {
  const data = await createArticle(req.body);
  res.status(data.error ? 500 : 200).send(data);
});

router.post('/api/get_blog_list', async (req, res) => {
  if (!req.body.catId) {
    res.status(404).send(new Response(true, 'CategoryId not sent', null, {}));
    return;
  }
  const data = await getArticlesByCategory(req.body.catId);
  res.status(data.error ? 500 : 200).send(data);
});

router.get('/api/get_article/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).send(new Response(true, 'ArticleId not sent', null, {}));
    return;
  }
  const data = await getArticle(req.params.id);
  res.status(data.error ? 500 : 200).send(data);
});

router.put('/api/update_article/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).send(new Response(true, 'ArticleId not sent', null, {}));
    return;
  }
  const data = await updateArticle(req.params.id, req.body);
  res.status(data.error ? 500 : 200).send(data);
});

router.delete('/api/delete_article/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).send(new Response(true, 'ArticleId not sent', null, {}));
    return;
  }
  const data = await deleteArticle(req.params.id);
  res.status(data.error ? 500 : 200).send(data);
});

router.put('/api/activate_article/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).send(new Response(true, 'ArticleId not sent', null, {}));
    return;
  }
  const data = await toggleArticle(req.params.id, true);
  res.status(data.error ? 500 : 200).send(data);
});

router.put('/api/deactivate_article/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).send(new Response(true, 'ArticleId not sent', null, {}));
    return;
  }
  const data = await toggleArticle(req.params.id, false);
  res.status(data.error ? 500 : 200).send(data);
});

/**
 * Categories APIs
 */
router.post('/api/create_category', async (req, res) => {
  if (!req.body.name) {
    res.status(400).send(new Response(true, 'Category name not present', null, {}));
    return;
  }
  const response = await createCategory(req.body.name);
  res.status(response.error ? 500 : 200).send(response);
});

router.get('/api/get_categories', async (req, res) => {
  const data = await getCategories();
  res.send(data);
});

router.put('/api/update_category', async (req, res) => {
  const response = await updateCategory(req.body);
  res.status(response.error ? 500 : 200).send(response);
});

router.delete('/api/delete_category/:id', async (req, res) => {
  const response = await deleteCategory(req.params.id);
  res.status(response.error ? 500 : 200).send(response);
});

router.get('/api/get_article_map', async (req, res) => {
  const response = await getArticleMap();
  res.status(response.error ? 500 : 200).send(response);
});

/**
 * Fallback route
 */

router.get('/*', (req, res) => {
  res.send({
    error: true,
    message: 'invalid route',
  });
});

module.exports = router;
