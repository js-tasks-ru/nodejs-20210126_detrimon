const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.limit = options.limit;
    this._counter = 0;
  }

  _transform(chunk, encoding, callback) {

    if (this._counter + chunk.length > this.limit) {
      let limitError = new LimitExceededError();
      return callback(limitError);
    }
    
    this._counter += chunk.length;
    callback(null, chunk)
  }
}

module.exports = LimitSizeStream;
