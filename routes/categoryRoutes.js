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

module.exports = router;
