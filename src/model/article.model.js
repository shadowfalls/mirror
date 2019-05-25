import ArticleSection from './articleSection.model';

export default class Article {

    title = '';
    description = '';
    categoryId = '';
    content = [];
    date = new Date();
    readTimeMin = 0;

    constructor(data) {
        if (!data)
            return;
        try {
            data = JSON.parse(data);
        }catch(err) {
            console.error(err);
            return;
        }
        this.title       = data.title ? data.title : '';
        this.description = data.description ? data.description : '';
        this.categoryId  = data.categoryId ? data.categoryId : '';
        this.content     = data.content && data.content.length ? data.content.map(row => new ArticleSection(row)) : [];
        this.date        = data.date ? new Date(data.date) : new Date();
        this.readTimeMin = data.readTimeMin ? data.readTimeMin : 0;
    }
}