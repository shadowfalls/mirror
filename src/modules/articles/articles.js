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
                fs.writeFile(`${constants.articlesPath}/${articleName}.json`, JSON.stringify(data), (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    this.categoryManager.updateCategoryTypes(temp.categoryId, {id: articleName, name: temp.title}, (res) => {
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
                            this.updateBlogTitleInCategoryBlogList(temp.title, id, temp.categoryId, (res) => {
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

    // if we update the name of a blog we also need to update the blog name in the blog list 
    // for the specific category
    updateBlogTitleInCategoryBlogList(newName, blogId, catId, callback) {
        console.log('', );
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
                blogList[inds].blogName = newName;
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
}
