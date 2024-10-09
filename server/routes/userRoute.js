const express = require("express");
const router = express.Router();
const { login, registerUser, sendOTP } = require('../controller/userController');
const verifyOTP = require('../middleware/verifyOtp');


router.post('/signup', verifyOTP, registerUser);
router.post('/send-otp', sendOTP);
router.post('/login',login)

module.exports = router;
