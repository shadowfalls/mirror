const fs = require('fs');
const {
  articlesPath,
  categoriesPath,
  categoriesTypeJson,
  recentArticlesJson,
  recentArticlesSize,
} = require('./constants');
const {
  getConnection,
} = require('./utils');
const Article = require('../models/Article');

async function prepareCategoryTypes() {
  try {
    const db = await getConnection();
    const categories = await db.collection('category').find({}).toArray();
    const data = categories.map((cat) => ({
      catId: cat._id,
      catName: cat.name,
    }));
    fs.writeFile(`${categoriesPath}/${categoriesTypeJson}.json`,
      JSON.stringify(data),
      () => { });
  } catch (e) {
    console.log(e);
  }
}

async function prepareBlogListInCategories() {
  try {
    const db = await getConnection();
    const categories = await db.collection('category').find({}).toArray();

    categories.forEach(async (cat) => {
      let catId = cat.name.replace(/ /g, '_');
      catId = catId.toLocaleLowerCase();
      const articles = await db.collection('article').find({ active: true, categoryId: cat._id.toString() });
      const data = [];
      while (await articles.hasNext()) {
        const art = await articles.next();

        let artId = art.title.replace(/ /g, '_');
        artId = artId.toLocaleLowerCase();

        data.push({
          id: art._id,
          blogId: artId,
          blogName: art.title,
          date: art.date,
          readTimeMin: art.readTimeMin,
        });
      }

      fs.writeFile(`${categoriesPath}/${catId}.json`,
        JSON.stringify(data),
        () => { });
    });
  } catch (e) {
    console.log(e);
  }
}

async function prepareRecentArticles() {
  try {
    const db = await getConnection();
    const article = await db.collection('article').find({ active: true }).toArray();
    const data = article.map((art) => new Article(art));
    const res = data.sort((a, b) => {
      const firstDate = new Date(a.date);
      const secondDate = new Date(b.date);
      return secondDate - firstDate;
    });
    let doc = res.slice(0, recentArticlesSize);
    if (Array.isArray(doc)) {
      doc = doc.map((d) => {
        let id = d.title.replace(/ /g, '_');
        id = id.toLocaleLowerCase();
        return {
          title: d.title,
          date: d.date,
          readTimeMin: d.readTimeMin,
          blogId: id,
          id: d.id.toString(),
        };
      });
      fs.writeFile(`${articlesPath}/${recentArticlesJson}.json`,
        JSON.stringify(doc),
        () => {});
    }
  } catch (e) {
    console.log(e);
  }
}

async function prepareArticles() {
  try {
    const db = await getConnection();
    const articles = await db.collection('article').find({ active: true });
    while (await articles.hasNext()) {
      const art = await articles.next();
      let artId = art.title.replace(/ /g, '_');
      artId = artId.toLocaleLowerCase();
      const data = new Article(art);
      fs.writeFile(`${articlesPath}/${artId}.json`,
        JSON.stringify(data),
        () => {});
    }
  } catch (e) {
    console.log(e);
  }
}

function prepareJson() {
  prepareCategoryTypes();
  prepareBlogListInCategories();
  prepareRecentArticles();
  prepareArticles();
  console.log('All done');
}

prepareJson();
