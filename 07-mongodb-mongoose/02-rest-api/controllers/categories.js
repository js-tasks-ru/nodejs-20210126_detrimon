const mongoose = require('mongoose');
const Category = require("../models/Category");

module.exports.categoryList = async function categoryList(ctx, next) {
  let aCategories = await Category.find().then(categories => {
    let returnedCategories = [];

    categories.forEach(elem => {
      elem.subcategories.forEach((subelem, i) => {
        elem.subcategories[i] = elem.subcategories[i].transform();
      })
      returnedCategories.push(elem.transform());
    })
    return returnedCategories;
  });
  
  ctx.body = {categories: aCategories};
};
