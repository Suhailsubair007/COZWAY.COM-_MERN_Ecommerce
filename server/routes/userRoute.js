const express = require("express");
const router = express.Router();
const { login, registerUser, sendOTP ,googleSignIn } = require('../controller/userController');
const verifyOTP = require('../middleware/verifyOtp');


router.post('/signup', verifyOTP, registerUser);
router.post('/send-otp', sendOTP);
router.post('/login',login)
router.post('/auth/google-signup',googleSignIn);

module.exports = router;
