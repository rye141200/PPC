const express = require('express');
const cartController = require('../controllers/cartController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);
router.route('/').get(cartController.getCart).patch(cartController.handleCart);

module.exports = router;
