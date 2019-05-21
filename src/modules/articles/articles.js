import fs from 'fs';

import constants from '../../core/constants';
import Article from '../../model/article.model';
import Utils from '../../core/utils';
import Categories from '../categories/categories';

const utils = new Utils();

export default class Articles {

    categoryManager = new Categories();

    createArticle(data, callback) {

        const articleName = data.title.replace(/ /g, '_');

        // check if file with the given name already exists
        fs.stat(`${constants.articlesPath}/${articleName}.json`, (err, stat) => {
            if (err == null) {
                callback({
                    error: true,
                    message: 'Blog with same name already exists!'
                });
            } else if (err.code == 'ENOENT') {
                const str = JSON.stringify(data);
                const temp = new Article(str);
                this.updateRecentArticles(temp, articleName, (result) => {
                    if (result.error)
                        callback(result);
                });
                fs.writeFile(`${constants.articlesPath}/${articleName}.json`, JSON.stringify(data), (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    temp.blogId = articleName;
                    this.categoryManager.updateCategoryTypes(temp.categoryId, temp, (res) => {
                        if (!res.error)
                            callback({ error: false, message: 'Article successfully created' });
                        else
                            callback(res);
                    });
                });
            }
        });
    }

    updateArticle(data, id, callback) {

        let blog;
        try {
            blog = JSON.stringify(data);
            if (data.isNewCat)
                blog.categoryId = data.categoryId.replace(/ /g, '_');
        }catch(err) {            
            callback(utils.error({message: 'Fails to parse JSON', err: err}));
            return;
        }

        // check if file with the given name exists
        fs.stat(`${constants.articlesPath}/${id}.json`, (err, stat) => {
            if (err == null) {
                const temp = new Article(blog);
                this.updateRecentArticles(temp, id, (result) => {
                    if (result.error)
                        callback(result);
                });
                fs.readFile(`src/api/articles/${id}.json`, 'utf8', (err, data) => {
                    if (err){
                        callback({error: true, message: 'could not get article', msg: err});
                        return err;
                    }
                    const old = new Article(data);
                    fs.writeFile(`${constants.articlesPath}/${id}.json`, JSON.stringify(temp), (err) => {
                        if (err) {
                            callback(utils.error({err: err, message: "could not write file"}));
                            return;
                        }
                        if (old.categoryId === temp.categoryId)
                            this.updateBlogDetailsInCategoryBlogList(temp, id, temp.categoryId, (res) => {
                                if (!res.error)
                                    callback({ error: false, message: 'Article successfully updated' });
                                else
                                    callback(res);
                            });
                        else {
                            this.categoryManager.removeArticleFromBlogList(old.categoryId, id, (resp) => {
                                if (resp.error) {
                                    callback(resp);
                                    return;
                                }
                                this.categoryManager.updateCategoryBlogList(temp.categoryId, 
                                    {id: id, name: temp.title}, (respo) => {
                                    if (respo.error) {
                                        callback(respo);
                                        return;
                                    }
                                    callback(respo);
                                });
                            });
                        }
                            
                    });
                });
            } else if (err.code == 'ENOENT') {
                callback(utils.error({message: 'Blog not found!', err: err}));
            }
        });
    }

    getArticle(articleName, callback) {
        fs.readFile(`src/api/articles/${articleName}.json`, 'utf8', (err, data) => {
            if (err){
                callback({error: true, message: 'could not get article', msg: err});
                return err;
            }
            callback(new Article(data));
        });
    }
    /**
     * if we update the details of a blog we also need to update the blog details in the blog list 
     * for the specific category
     * @param {Article} newDetails 
     * @param {string} blogId 
     * @param {string} catId 
     * @param {function} callback 
     */
    updateBlogDetailsInCategoryBlogList(newDetails, blogId, catId, callback) {
        fs.readFile(`${constants.categoriesPath}/${catId}.json`, 'utf8', (err, data) => {
            if (err){
                callback({error: true, message: 'could not get article', msg: err});
                return err;
            }
            let inds, blogList;
            blogList = utils.safeParse(data);
            if (blogList)
                blogList.find((blog, index) => {
                    if (blog.blogId === blogId) {
                        inds = index;
                        return true;
                    }
                });
            if (blogList && blogList[inds]) {
                blogList[inds].blogName = newDetails.title;
                blogList[inds].date = newDetails.date;
                blogList[inds].readTimeMin = newDetails.readTimeMin;
                fs.writeFile(`${constants.categoriesPath}/${catId}.json`, JSON.stringify(blogList), (err) => {
                    if (err) {
                        callback(utils.error({message: 'Could not update blog name in cat list', err: err}));
                        return;
                    }
                    callback({ error: false, message: 'Article successfully created' });
                });
            }
        });
    }
    /**
     * method is used to create or update the recent 
     * @param {Article} articleDetails
     * @param {string} blogId
     * @param {function} callback
     */
    updateRecentArticles(articleDetails, blogId, callback) {
        if (!articleDetails)
            return;
        fs.readFile(`${constants.articlesPath}/${constants.recentArticlesJson}.json`, 'utf8', (err, data) => {
            if (err){
                callback(utils.error({message: 'could not get recent articles list', err: err}));
                return err;
            }
            let inds, recentBlogList;
            recentBlogList = utils.safeParse(data);
            if (recentBlogList)
                recentBlogList.find((blog, index) => {
                    if (blog.blogId === blogId) {
                        inds = index;
                        return true;
                    }
                });
            else {
                callback({error: true, message: 'could not get recent articles list'});
                return;
            }

            if (recentBlogList[inds]) {
                recentBlogList[inds].title = articleDetails.title;
                recentBlogList[inds].date = articleDetails.date;
                recentBlogList[inds].readTimeMin = articleDetails.readTimeMin;
            } else {
                recentBlogList.unshift({
                    title: articleDetails.title,
                    date: articleDetails.date,
                    readTimeMin: articleDetails.readTimeMin,
                    blogId: blogId
                });
            }
            let payload = [];
            // reduce the recent articles list to the required size
            if (recentBlogList.length > constants.recentArticlesSize)
                payload = recentBlogList.slice(0, constants.recentArticlesSize);
            else
                payload = recentBlogList;
            fs.writeFile(`${constants.articlesPath}/${constants.recentArticlesJson}.json`, JSON.stringify(payload), (err) => {
                if (err) {
                    callback(utils.error({message: 'Could not add recent articles list', err: err}));
                    return;
                }
            });
        });
    }
}
