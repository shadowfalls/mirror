export default class ArticleSection {

    html = '';
    isQuoted = false;
    isGist = false;
    isMainHeading = false;
    isSubHeading = false;
    gist = '';

    constructor(data) {
        if (!data)
            return;
        this.html          = data && data.html ? data.html : '';
        this.isQuoted      = data && typeof data.isQuoted === 'boolean' ? data.isQuoted : false;
        this.gist          = data && data.gist ? data.gist : '';
        this.isGist        = data && typeof data.isGist === 'boolean' ? data.isGist : false;
        this.isMainHeading = data && typeof data.isMainHeading === 'boolean' ? data.isGist : false;
        this.isSubHeading  = data && typeof data.isSubHeading === 'boolean' ? data.isGist : false;
    }
}
