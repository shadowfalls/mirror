const { ObjectID } = require('mongodb');

const { getConnection } = require('../../core/utils');
const Response = require('../../models/Response');
const Article = require('../../models/Article');

exports.createArticle = async (data) => {
  try {
    const db = await getConnection();
    const art = new Article(data);
    const result = await db.collection('article').insertOne(art);
    const [res] = result.ops;
    const tr = new Response(false, 'Successfully added article', { id: res._id });
    console.log(tr);
    return tr;
  } catch (error) {
    return new Response(true, 'Cannot create article', {}, error);
  }
};

exports.getArticlesByCategory = async (id) => {
  try {
    const db = await getConnection();
    const data = await db.collection('article').find({
      categoryId: id,
    }).toArray();
    let payload = [];
    if (Array.isArray(data)) {
      payload = data.map((article) => new Article(article));
    }
    return new Response(false, 'article list fetched', payload);
  } catch (error) {
    return new Response(true, 'Cannot create article', {}, error);
  }
};

exports.getArticle = async (id) => {
  try {
    const db = await getConnection();
    const collection = db.collection('article');
    const cursor = await collection.find({ _id: new ObjectID(id) });

    if (await cursor.hasNext()) {
      const data = await cursor.next();
      return new Response(false, 'Successfully fetched article', new Article(data));
    }

    return new Response(true, 'article not found', {}, {});
  } catch (error) {
    return new Response(true, 'Cannot get article', {}, error);
  }
};

exports.updateArticle = async (id, data) => {
  try {
    const db = await getConnection();
    const collection = db.collection('article');
    const cursor = await collection.find({ _id: new ObjectID(id) });

    /**
     * Check if it exists
     */
    if (await cursor.hasNext()) {
      if (data.id) delete data.id;
      collection.updateOne({ _id: new ObjectID(id) }, { $set: new Article(data) });
      return new Response(false, 'Successfully updated article', {});
    }

    return new Response(true, 'article not found', {}, {});
  } catch (error) {
    return new Response(true, 'Cannot update article', {}, error);
  }
};

exports.deleteArticle = async (id) => {
  try {
    const db = await getConnection();
    const collection = db.collection('article');
    const cursor = await collection.find({ _id: new ObjectID(id) });

    /**
     * Check if it exists
     */
    if (await cursor.hasNext()) {
      collection.findOneAndDelete({ _id: new ObjectID(id) });
      return new Response(false, 'Successfully deleted article', {});
    }

    return new Response(true, 'article not found', {}, {});
  } catch (error) {
    return new Response(true, 'Cannot deleted article', {}, error);
  }
};

exports.toggleArticle = async (id, active) => {
  try {
    const db = await getConnection();
    const collection = db.collection('article');
    const cursor = await collection.find({ _id: new ObjectID(id) });

    if (await cursor.hasNext()) {
      let data = await cursor.next();
      data = new Article(data);
      delete data.id;
      data.active = active;
      collection.updateOne({ _id: new ObjectID(id) }, { $set: data });
      return new Response(false, `Successfully ${(active ? 'activated' : 'deactivated')} article`, {});
    }

    return new Response(true, 'article not found', {}, {});
  } catch (error) {
    return new Response(true, 'Cannot update article', {}, error);
  }
};

exports.getArticleMap = async () => {
  try {
    const db = await getConnection();
    const data = await db.collection('article').find({}).toArray();
    const articleNameMap = {};
    const articleIdMap = {};
    if (Array.isArray(data)) {
      data.forEach((article) => {
        const key = article.title.toLocaleLowerCase().split(' ').join('_');
        articleNameMap[key] = article._id;
        articleIdMap[article._id] = key;
      });
    }
    return new Response(false, 'article map fetched', {
      articleNameMap: articleNameMap,
      articleIdMap: articleIdMap,
    });
  } catch (error) {
    return new Response(true, 'Cannot get article map', {}, error);
  }
};
