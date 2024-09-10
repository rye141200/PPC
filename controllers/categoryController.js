const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const Category = require('../models/categoryModel');

exports.createCategory = handlerFactory.createOne(Category);

exports.categoryViewMiddleWare = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.locals.categories = categories;
  next();
});
