const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
// router.route('/').get(cartController.getCart).patch(cartController.handleCart);
router.route('/').post(cartController.constructCart);

module.exports = router;
