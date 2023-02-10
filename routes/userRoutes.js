const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/authentication', userController.authentication);
router.post("/verifyOTP", userController.verifyOTP);
router.post("/resendOTPVerificationCode", userController.resendOTP);
router.post("/forgotPasswordOTP", userController.forgotPassword)
router.post("/resetPassword", userController.resetPassword)
module.exports = router;