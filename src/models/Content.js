class Content {
  constructor(data) {
    let d = {};
    if (data) d = data;
    this.html = d.html ? d.html : '';
    this.isQuoted = typeof d.isQuoted === 'boolean' ? d.isQuoted : false;
    this.gist = d.gist ? d.gist : '';
    this.isGist = typeof d.isGist === 'boolean' ? d.isGist : false;
    this.isImage = typeof d.isImage === 'boolean' ? d.isImage : false;
    this.imageUrl = d.imageUrl ? d.imageUrl : '';
    this.isMainHeading = typeof d.isMainHeading === 'boolean' ? d.isMainHeading : false;
    this.isCodeSection = typeof d.isCodeSection === 'boolean' ? d.isCodeSection : false;
    this.isSubHeading = typeof d.isSubHeading === 'boolean' ? d.isSubHeading : false;
  }
}

module.exports = Content;
