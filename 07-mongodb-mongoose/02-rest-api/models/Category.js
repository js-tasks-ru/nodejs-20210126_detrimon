const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

categorySchema.method('transform', transformObj);
subCategorySchema.method('transform', transformObj);

function transformObj() {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  if (obj.hasOwnProperty("__v")) delete obj["__v"];

  return obj;
}

module.exports = connection.model('Category', categorySchema);
