const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router
  .route('/signup')
  .post(authController.signup)
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
router.patch('/updateMyPassword', authController.updatePassword);

router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

module.exports = router;
