const Product = require('../models/productModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    status: 'success',
    count: products.length,
    data: {
      products,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError('Product not found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) return next(new AppError('Product not found!', 404));

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) return next(new AppError('Product not found!', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
