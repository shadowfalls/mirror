const Content = require('./Content');

class Article {
  constructor(data) {
    let d = {};
    if (data) d = data;
    this.id = d._id;
    this.date = d.date;
    this.active = typeof d.active === 'boolean' ? d.active : true;
    this.title = d.title;
    this.categoryId = d.categoryId;
    this.description = d.description;
    this.readTimeMin = d.readTimeMin;
    this.content = Array.isArray(d.content) ? d.content.map((content) => new Content(content))
      : [];
  }
}

module.exports = Article;
