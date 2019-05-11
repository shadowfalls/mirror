import express from 'express';
import fs from 'fs';

import Article from '../model/article.model';

import Articles from './articles/articles';

const router = express.Router();
const manageArticles = new Articles();

router.get('/api/get_article/:article_name', (req, res, next) => {
  
  fs.readFile(`src/api/articles/${req.params.article_name}.json`, 'utf8', (err, data) => {
    if (err){
      res.send(err);
      return err;
    }
    res.send(new Article(data));
  });
});

router.put('/api/update_article/:article_name', (req, res, next) => {

  fs.readFile(`src/api/articles/${req.params.article_name}.json`, 'utf8', (err, data) => {
    if (err){
      res.send(err);
      return err;
    }
    const art = new Article(data);
    const tr = JSON.stringify(art)
    fs.writeFile(`src/api/articles/${req.params.article_name}.json`, tr, (err) => {
      if (err){
        res.send(err);
        return err;
      }
      res.send({error: false, message: 'Article successfully updated'});
    });
  });
});

router.post('/api/create_article', (req, res, next) => {
  manageArticles.createArticle(req.body, (result) => {
    if (result.error)
      res.status(500).send(result);
    else
      res.send(result);
    next();
  });
});


router.get('/*',(req, res, next) => {
  res.send({
    error: true,
    message: 'invalid route'
  })
});

export default router;