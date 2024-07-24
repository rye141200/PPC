const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.getAllOrders,
  )
  .post(
    authController.protect,
    authController.restrictTo('user'),
    orderController.createOrder,
  );

router
  .route('/:id')
  .get(
    authController.protect,
    authController.restrictTo('user'),
    orderController.getOrder,
  );

module.exports = router;
