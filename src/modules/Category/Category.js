const { ObjectID } = require('mongodb');

const { getConnection } = require('../../core/utils');
const Response = require('../../models/Response');
const Category = require('../../models/Category');

exports.createCategory = async (name) => {
  try {
    const db = await getConnection();
    await db.collection('category').insertOne({ name: name });
    return new Response(false, 'Succesfully added category', {});
  } catch (error) {
    return new Response(true, 'Cannot create category', {}, error);
  }
};

exports.getCategories = async () => {
  try {
    const db = await getConnection();
    const data = await db.collection('category').find({}).toArray();
    let payload = [];
    if (Array.isArray(data)) {
      payload = data.map((category) => new Category(category.name, category._id));
    }
    return new Response(false, 'Category list fetched', payload);
  } catch (error) {
    return new Response(true, 'Cannot fetch category list', {}, error);
  }
};

exports.updateCategory = async (data) => {
  try {
    if (!data.newName || !data.id) {
      return new Response(true, 'Category name or Id not present', null, {});
    }
    const db = await getConnection();
    const collection = db.collection('category');
    const cursor = await collection.find({ _id: new ObjectID(data.id) });

    /**
     * Check if the category exists
     */
    if (await cursor.hasNext()) {
      collection.updateOne({
        _id: new ObjectID(data.id),
      }, {
        $set: { name: data.newName },
      });
      return new Response(false, 'Successfully updated the category', {});
    }
    return new Response(true, 'Category not present', null, {});
  } catch (error) {
    return new Response(true, 'Cannot update category', {}, error);
  }
};

exports.deleteCategory = async (id) => {
  try {
    if (!id) {
      return new Response(true, 'Category Id not present', null, {});
    }
    const db = await getConnection();
    const collection = db.collection('category');
    const cursor = await collection.find({ _id: new ObjectID(id) });

    /**
     * Check if the category exists
     */
    if (await cursor.hasNext()) {
      await collection.deleteOne({
        _id: new ObjectID(id),
      });
      return new Response(false, 'Successfully deleted the category', {});
    }
    return new Response(true, 'Category not present', null, {});
  } catch (error) {
    return new Response(true, 'Cannot delete the category', {}, error);
  }
};
