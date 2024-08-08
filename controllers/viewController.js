const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const User = require('../models/userModel');

exports.renderHome = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).render('home', {
    products,
    title: 'PPC Tech | Home',
  });
});
exports.renderProductDetails = catchAsync(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.id });
  res.status(200).render('productDetails', {
    product,
    title: `PPC Tech | ${product.name}`,
  });
});
exports.renderPayment = (req, res) => {
  res.status(200).render('payment');
};
exports.renderProduct = (req, res) => {
  res.status(200).render('product');
};
exports.renderProfile = (req, res) => {
  res.status(200).render('profile', {
    title: 'PPC Tech | Profile',
  });
};

exports.renderCheckout = (req, res) => {
  res.status(200).render('cart', {
    title: 'PPC Tech | Cart',
  });
};
exports.renderMyOrders = async (req, res) => {
  const orders = await User.findById(req.user.id)
    .populate('orders')
    .select('orders');
  console.log(orders);
  res.status(200).render('myOrders', {
    title: 'PPC Tech| My Orders',
    orders,
  });
};
