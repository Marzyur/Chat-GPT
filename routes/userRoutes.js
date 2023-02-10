const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post('/authentication', userController.authentication);
router.post("/verifyOTP", userController.verifyOTP);
router.post("/resendOTPVerificationCode", userController.resendOTP);

module.exports = router;