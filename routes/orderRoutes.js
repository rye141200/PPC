const express = require('express');
const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');

const router = express.Router();

//router.use(authController.protect);

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    orderController.getAllOrders,
  )
  .post(
    // authController.restrictTo('user', 'admin'),
    // orderController.setUserId,
    orderController.createOrder,
  );
router.use(authController.restrictTo('admin'));
router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
