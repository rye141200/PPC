const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();
router.use(authController.isLoggedIn);
router.get('/', viewController.renderHome);
router.get('/pay', viewController.renderPayment);
router.get('/products/:id', viewController.renderProductDetails);
router.get('/profile', viewController.renderProfile);
router.get('/checkout', viewController.renderCheckout);
router.get('/me/orders', authController.protect, viewController.renderMyOrders);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
// router.get('/product/:slug');
module.exports = router;
