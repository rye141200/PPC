const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadImage,
    productController.resizeProductImage,
    productController.addImageName,
    productController.createProduct,
  );

router
  .route('/cart')
  .get(authController.protect, productController.getCartProducts);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProductImage,
    productController.uploadImage,
    productController.resizeProductImage,
    productController.addImageName,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    productController.deleteProductImage,
    productController.deleteProduct,
  );

module.exports = router;
