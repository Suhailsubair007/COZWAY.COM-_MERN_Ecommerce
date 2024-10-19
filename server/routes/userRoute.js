const express = require("express");
const router = express.Router();
const { login, registerUser, sendOTP, googleSignIn, googleLoginUser, fetchLatestProduct, UserLogout,fetchActiveProduct } = require('../controller/userController',);
const verifyOTP = require('../middleware/verifyOtp');
// const {verifyUser}  = require('../middleware/userAuth')
const userAuth = require('../middleware/userAuth')





router.post('/login', login)
router.post('/signup', verifyOTP, registerUser);
router.post('/logout', UserLogout)


router.post('/send-otp', sendOTP);


router.post('/auth/google-signup', googleSignIn);
router.post('/auth/google-login', googleLoginUser)


router.get('/fetch_product_by_date', fetchLatestProduct )

router.get('/fetch_all_product', fetchActiveProduct)

module.exports = router;
