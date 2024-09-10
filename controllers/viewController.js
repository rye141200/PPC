const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const handlerFactory = require('./handlerFactory');
const productController = require('../controllers/productController');

exports.renderForgotPassword = (req, res, next) => {
  res.status(200).render('forgotPassword', {
    title: 'PPC Tech | Forgot password',
  });
};
exports.renderResetPassword = (req, res, next) => {
  res.status(200).render('resetPassword', {
    title: 'PPC Tech | Reset Password',
  });
};
exports.renderHome = catchAsync(async (req, res, next) => {
  const products = await Product.find();
  const totalNumber = products.length;

  const pageItems = await handlerFactory.getAll(
    Product,
    undefined,
    undefined,
    true,
  )(req, res, next);
  //! redirect user in case of wrong page or default
  if (pageItems.length === 0 || !req.query.page)
    if (+req.query.page !== 1) return res.redirect('/?page=1');

  //console.log(pageItems);
  res.status(200).render('home', {
    totalNumber,
    pageItems,
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

exports.renderPayment = catchAsync(async (req, res, next) => {
  res.status(200).render('payment', {
    title: 'PPC | Checkout',
  });
});

exports.renderProfile = (req, res) => {
  res.status(200).render('profile', {
    title: 'PPC Tech | Profile',
  });
};

exports.renderCheckout = catchAsync(async (req, res, next) => {
  res.status(200).render('cart', {
    title: 'PPC Tech | Cart',
  });
});
exports.renderMyOrders = catchAsync(async (req, res, next) => {
  const orders = await User.findById(req.user.id)
    .populate('orders')
    .select('orders');

  res.status(200).render('myOrders', {
    title: 'PPC Tech| My Orders',
    orders,
  });
});

exports.renderOrderDetails = catchAsync(async (req, res, next) => {
  const orders = await Order.findById(req.params.id);
  // console.log(orders);
  res.status(200).render('orderDetails', {
    title: 'PPC Tech| Order Details',
    orders,
  });
});

exports.renderMap = catchAsync(async (req, res, next) => {
  res.status(200).render('map.ejs', {
    title: 'PPC | Checkout',
  });
});
// exports.renderDashboardProducts = catchAsync(async (req, res, next) => {});
exports.renderDashboard = (model, ejsFile) =>
  catchAsync(async (req, res, next) => {
    const { slug } = req.params;
    const { status } = req.params;

    let document; //!This is for products only
    if (!status) document = await model.find();

    let selectedDocument;
    if (slug) selectedDocument = await model.findOne({ slug });
    else if (status) selectedDocument = await model.find({ status });

    res.status(200).render(ejsFile, {
      title: 'PPC Tech | Dashboard',
      user: req.user,
      document,
      selectedDocument,
      status,
    });
  });

exports.renderSearchResult = catchAsync(async (req, res, next) => {
  const { products, count } = await productController.searchProducts(
    req.query.name,
    undefined,
    req.query.page,
  );
  //! redirect user in case of wrong page or default
  if (products.length === 0 || !req.query.page)
    if (+req.query.page !== 1)
      return res.redirect(`/?page=1&name=${req.query.name}`);

  //console.log(pageItems);
  res.status(200).render('searchResult', {
    substring: req.query.name,
    totalNumber: count,
    pageItems: products,
    title: 'PPC Tech | Search Result',
  });
});
