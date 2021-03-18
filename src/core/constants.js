const constants = {
  /* mongodb://<host>:<port>/<database name> */
  connectionUrl: 'mongodb://localhost:27017',
  dbName: 'CODING_BLOG',
  articlesPath: 'api/articles',
  categoriesPath: 'api/categories',
  categoriesTypeJson: '_categorieTypes',
  recentArticlesJson: '_recentArticlesJson',
  recentArticlesSize: 8,
};

module.exports = constants;
