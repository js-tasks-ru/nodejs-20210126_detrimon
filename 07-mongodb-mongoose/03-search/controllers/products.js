const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  let sQuery = ctx.query.query;

  let products = await Product.find({ $text: { $search: sQuery }});

  ctx.body = {products: products};
};
