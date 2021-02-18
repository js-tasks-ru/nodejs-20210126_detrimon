const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this._data = '';
  }

  _transform(chunk, encoding, callback) {
    // Разбиваем чанк на элементы массива по os.EOL
    let eolArr = chunk.toString().split(os.EOL);

    // Если в предыдущем вызове остались данные в this._data, то они должны попасть в следующий PUSH, добавляем их.
    eolArr[0] = this._data + eolArr[0];

    /* Пробегаемся по массиву. Последний элемент массива добавим в this._data и если это была последняя строка,
    то сделаем PUSH для нее во _flush()
    */
    for (let i = 0, ln = eolArr.length; i < ln; i++) {
      if (i === ln - 1) {
        this._data = eolArr[i];
        break;
      }
      this.push(eolArr[i]);
    }

    callback();
  }

  _flush(callback) {
    // Пушим оставшиеся данные.
    this.push(this._data);
    callback();
  }
}

module.exports = LineSplitStream;
