function sum(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError("Указан не верный тип");
  }

  return a + b;
}

module.exports = sum;
