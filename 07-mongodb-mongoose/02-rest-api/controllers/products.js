const mongoose = require('mongoose');
const Product = require('../models/Product');
const ObjectId = mongoose.Types.ObjectId;

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  let subCategoryId = ctx.query.subcategory;

  let oFilter = {};

  if (subCategoryId) oFilter.subcategory = subCategoryId;

  if (subCategoryId && !ObjectId.isValid(subCategoryId)) {
    return ctx.throw(400);
  }

  let products = await Product.find(oFilter).then(products => {
    let returnedProducts = [];

    products.forEach(elem => {
      returnedProducts.push(elem.transform());
    })
    return returnedProducts;
  });
  ctx._products = products;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = { products: ctx._products };
};

module.exports.productById = async function productById(ctx, next) {
  let sProductId = ctx.params.id;

  if (!ctx.params.id || !ObjectId.isValid(sProductId)) {
    ctx.throw(400);
  }

  ctx.body = await Product.findById(sProductId).then(product => {
    if (!product) {
      ctx.throw(404);
    }

    return { product: product.transform() };
  })

};

