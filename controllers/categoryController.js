const slugify = require('slugify');
const catchAsync = require('../utils/catchAsync');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/AppError');
const Category = require('../models/categoryModel');

exports.createCategory = handlerFactory.createOne(Category);

exports.categoryViewMiddleWare = catchAsync(async (req, res, next) => {
  const categories = await Category.find();
  res.locals.categories = categories;
  next();
});

exports.restoreCategory = catchAsync(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  }).setOptions({ bypassFilter: true });
  if (!category) return next(new AppError('Product not found!', 404));
  res.status(200).json({
    status: 'success',
    data: {
      document: category,
    },
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  req.body.slug = slugify(req.body.name, { lower: true });

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  }).setOptions({ bypassFilter: true });
  console.log(category);
  if (!category) return next(new AppError('Category is not found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});
