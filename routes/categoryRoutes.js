const express = require('express');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// router.use(authController.protect);

router
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.createCategory,
  );

router
  .route('/restore/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.restoreCategory,
  );
router
  .route('/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    categoryController.updateCategory,
  );

module.exports = router;
