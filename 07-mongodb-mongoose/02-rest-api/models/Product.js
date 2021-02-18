const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],

});

productSchema.method('transform', transformObj);

function transformObj() {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj._id;
  if (obj.hasOwnProperty("__v")) delete obj["__v"];

  return obj;
}

module.exports = connection.model('Product', productSchema);
