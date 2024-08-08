const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const cartController = require('../controllers/cartController');

const router = express.Router();

router
  .route('/signup')
  .post(authController.signup, cartController.createCart)
  .get(authController.renderSignup);

router
  .route('/login')
  .post(authController.login)
  .get(authController.renderLoginUI);

router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//! Protect all routes after this middleware
router.use(authController.protect);

router.get(
  '/me',
  authController.restrictTo('user', 'admin'),
  userController.getMe,
  userController.getUser,
);

router.get(
  '/me/orders',
  authController.restrictTo('user'),
  userController.getMyOrders,
);

router
  .route('/me/address')
  .post(userController.addNewAddress)
  .get(userController.getMyAddresses);

router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.get('/', authController.restrictTo('admin'), userController.getAllUsers);

router.get('/:id', authController.restrictTo('admin'), userController.getUser);

module.exports = router;
