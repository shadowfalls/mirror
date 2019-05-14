export default class MirrorError {
    error;
    message;
    serverMsg;

    constructor(data) {
        this.message = data.message ? data.message : '';
        this.error = typeof data.error === 'boolean' ? data.error : true;
        this.serverMsg = data.err ? data.err : {};
    }
}