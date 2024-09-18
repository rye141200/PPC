const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

router
  .route('/')
  .get(productController.aliasCategory, productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadImage,
    productController.resizeProductImage,
    productController.addImageName,
    productController.createProduct,
  );

router.route('/cart').get(productController.getCartProducts);

router
  .route('/restore/:id')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.restoreProduct,
  );
router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    productController.uploadImage,
    productController.deleteProductImage,
    productController.resizeProductImage,
    productController.addImageName,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    //productController.deleteProductImage,
    productController.deleteProduct,
  );
module.exports = router;
