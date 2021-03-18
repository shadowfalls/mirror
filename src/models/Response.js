class Response {
  constructor(flag, message, data, errorObject = {}) {
    this.data = data;
    this.error = flag;
    this.message = message;
    this.errorObject = flag ? errorObject : undefined;
  }
}

module.exports = Response;
