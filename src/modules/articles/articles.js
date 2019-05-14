import fs from 'fs';

import constants from '../../core/constants';
import Article from '../../model/article.model';

export default class Articles {

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
                fs.writeFile(`${constants.articlesPath}/${articleName}.json`, JSON.stringify(data), (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback({ error: false, message: 'Article successfully created' });
                });
            }
        });
    }

    updateArticle(data, callback) {

        const articleName = data.title.replace(/ /g, '_');

        // check if file with the given name already exists
        fs.stat(`${constants.articlesPath}/${articleName}.json`, (err, stat) => {
            if (err == null) {
                callback({
                    error: true,
                    message: 'Blog with same name already exists!'
                });
            } else if (err.code == 'ENOENT') {
                fs.writeFile(`${constants.articlesPath}/${articleName}.json`, JSON.stringify(data), (err) => {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback({ error: false, message: 'Article successfully created' });
                });
            }
        });
    }

    getArticle(articleName, callback) {
        fs.readFile(`src/api/articles/${articleName}.json`, 'utf8', (err, data) => {
            if (err){
                callback({error: true, message: 'could not get article', msg: err});
                return err;
            }
            callback(new Article(data))
        });
    }
}
