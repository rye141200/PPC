const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const categoryController = require('../controllers/categoryController');
const Category = require('../models/categoryModel');

const router = express.Router();
router.use(authController.isLoggedIn);
router.use(categoryController.categoryViewMiddleWare);
router.get('/', viewController.renderHome);
router.get('/pay', authController.protect, viewController.renderPayment);
router.get('/products/:id', viewController.renderProductDetails);
router.get('/profile', viewController.renderProfile);
router.get('/checkout', viewController.renderCheckout);
router.get('/me/orders', authController.protect, viewController.renderMyOrders);
router.route('/forgotpassword').get(viewController.renderForgotPassword);
router.route('/resetPassword/:token').get(viewController.renderResetPassword);
router.route('/search').get(viewController.renderProductsBysubString);
router
  .route('/thanks-for-purchase')
  .get(authController.protect, viewController.renderThanks);
/**
 * /admin/dashboard/products
 * /admin/dashboard/products/id
 * /admin/dashboard/orders
 * /admin/dashboard/orderds/id
 */
router.get(
  '/admin/dashboard/products',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDashboard(Product, 'dashboardProducts'),
);
router.get(
  '/admin/dashboard/products/deleted',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDeleted(Product, 'deletedProductsDashboard'),
);
router.get(
  '/admin/dashboard/products/:slug',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDashboard(Product, 'dashboardProducts'),
);
//! Categories
router.get(
  '/admin/dashboard/categories',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDashboard(Category, 'dashboardCategories'),
);
router.get(
  '/admin/dashboard/categories/deleted',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDeleted(Category, 'deletedCategoriesDashboard'),
);
router.get(
  '/admin/dashboard/categories/:slug',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDashboard(Category, 'dashboardCategories'),
);

//! Orders
router.get(
  '/admin/dashboard/orders/',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDashboard(Order, 'dashboardOrders'),
);

router.get(
  '/admin/dashboard/orders/:status',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderDashboard(Order, 'dashboardOrders'),
);

router.get(
  '/checkout-location',
  authController.protect,
  viewController.renderMap,
);

router.get(
  '/me/order-details/:id',
  authController.protect,
  viewController.renderOrderDetails,
);
router.get(
  '/order/details/:id',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.renderOrderDetails,
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

// router.get('/product/:slug');
module.exports = router;
//one min
