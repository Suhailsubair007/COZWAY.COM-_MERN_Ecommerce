const express = require("express");
const router = express.Router();
const { login, registerUser, sendOTP, googleSignIn, googleLoginUser, fetchLatestProduct } = require('../controller/userController');
const verifyOTP = require('../middleware/verifyOtp');
// const {verifyUser}  = require('../middleware/userAuth')


router.post('/signup', verifyOTP, registerUser);
router.post('/send-otp', sendOTP);
router.post('/login', login)
router.post('/auth/google-signup', googleSignIn);
router.post('/auth/google-login', googleLoginUser)
router.get('/fetch_product_display', fetchLatestProduct)

module.exports = router;
