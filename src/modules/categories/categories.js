import fs from 'fs';

import constants from '../../core/constants';
import Utils from '../../core/utils';

const utils = new Utils();

export default class Categories {

    updateCategoryTypes(catId, blogDetails, callback) {
        fs.stat(`${constants.categoriesPath}/${constants.categoriesTypeJson}.json`, (err, stat) => {
            if (err == null) {
                fs.readFile(`${constants.categoriesPath}/${constants.categoriesTypeJson}.json`, 'utf8', (err, data) => {
                    if (err) {
                        callback({ error: true, message: 'could not get categorie types', msg: err });
                        return err;
                    }
                    if (data) {
                        const existCatList = JSON.parse(data);
                        let indes;
                        const isExist = existCatList.find((cat, index) => {
                            if (cat.catId === catId) {
                                indes = index;
                                return true;
                            }
                        });
                        const write = () => {
                            fs.writeFile(`${constants.categoriesPath}/${constants.categoriesTypeJson}.json`,
                                JSON.stringify(existCatList),
                                (err) => {
                                    if (err) {
                                        callback(utils.error({ err: err, message: 'Category not updated' }));
                                        return;
                                    }
                                    callback({ error: false, message: 'Categories list successfully created' });
                                });
                        };
                        if (isExist && existCatList[indes]) {
                            existCatList[indes].count++;
                            this.updateCategoryBlogList(catId, blogDetails, (result) => {
                                if (result.error) {
                                    callback(result);
                                    return;
                                } else {
                                    callback(result);
                                    write();
                                }
                            });
                            write();
                        } else {
                            existCatList.push({
                                catId: catName.replace(/ /g, '_'),
                                catName: catName,
                                count: 1
                            });
                            this.createCategoryBlogList(catName, blogDetails, (result) => {
                                if (result.error) {
                                    callback(result);
                                    return;
                                } else {
                                    callback(result);
                                    write();
                                }
                            });
                        }

                    }
                });
                // if the file is not present
            } else if (err.code == 'ENOENT') {
                fs.writeFile(`${constants.categoriesPath}/${constants.categoriesTypeJson}.json`,
                    JSON.stringify({
                        catId: catName.replace(/ /g, '_'),                        
                        catName: catName,
                        count: 1
                    }), (err) => {
                        if (err) {
                            callback(utils.error({ message: 'Categories list creation failed', err: err }));
                            return;
                        }
                        callback({ error: false, message: 'Categories list successfully created' });
                    });
            } else if (err) {
                callback(utils.error({ message: 'Cannot check categorie types', serverError: err }));
                return;
            }
        });
    }

    createCategoryBlogList(catId, blogDetails, callback) {
        fs.writeFile(`${constants.categoriesPath}/${catId}.json`, 'utf8',
            JSON.stringify([{
                blogId: blogDetails.id,
                blogName: blogDetails.name
            }])
            , (err) => {
                if (err) {
                    callback(utils.error({ message: 'Blog list creation failed', err: err }));
                    return;
                } else {
                    callback({ error: false, message: 'Blog list created' });
                }
            });
    }

    updateCategoryBlogList(catId, blogDetails, callback) {
        fs.stat(`${constants.categoriesPath}/${catId}.json`, (err, stat) => {
            if (err == null) {
                fs.readFile(`${constants.categoriesPath}/${catId}.json`, 'utf8', (err, data) => {
                    if (err) {
                        callback(utils.error({ message: 'Blog list reading failed', err: err }));
                        return;
                    }
                    let temp;
                    try {
                        temp = JSON.parse(data);
                    } catch (err) {
                        callback(utils.error({ message: 'Could not parse blog list', err: err }));
                        return;
                    }
                    if (temp) {
                        temp.push({
                            blogId: blogDetails.id,
                            blogName: blogDetails.name
                        });
                        fs.writeFile(`${constants.categoriesPath}/${catId}.json`, 'utf8',
                            JSON.stringify(temp),
                            (result) => {
                                if (err) {
                                    callback(utils.error({ message: 'Blog list creation failed', err: err }));
                                    return;
                                }
                                callback({ error: false, message: 'BLog updated' });
                            });
                    }
                });
            } else if (err.code == 'ENOENT') {
                callback(utils.error({ message: 'Blog list not found', err: err }));
                return;
            }
        });
    }

    getCategoryList(callback) {
        fs.readFile(`${constants.categoriesPath}/${constants.categoriesTypeJson}.json`, 'utf8', (err, data) => {
            if (err) {
                callback(utils.error({ message: 'Category list cannot be fetched', err: err }));
                return;
            }
            try {
                callback({ error: false, message: 'Category list fetched', data: JSON.parse(data) });
            } catch (err) {
                callback(utils.error({ message: 'Category list parse error', err: err }));
            }
        });
    }

    getBlogListByCat(req, callback) {
        fs.stat(`${constants.categoriesPath}/${req.catId}.json`, (err, stat) => {
            if (err == null) {
                fs.readFile(`${constants.categoriesPath}/${req.catId}.json`, 'utf8', (err, data) => {
                    if (err) {
                        callback(utils.error({ message: 'Blog list cannot be fetched', err: err }));
                        return;
                    }
                    try {
                        callback({ error: false, message: 'Blog list fetched', data: JSON.parse(data) });
                    } catch (err) {
                        callback(utils.error({ message: 'Blog list parse error', err: err }));
                    }
                });
            } else if (err.code == 'ENOENT') {
                callback(utils.error({ message: 'Blog list not found', err: err }));
                return;
            }
        });
    }
}
