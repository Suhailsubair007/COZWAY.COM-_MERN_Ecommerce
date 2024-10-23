const express = require("express");
const router = express.Router();
const { login, registerUser, sendOTP, googleSignIn, googleLoginUser, fetchLatestProduct, UserLogout, fetchActiveProduct, getActiveCategories, fetchRelatedProducts, userAddAddress } = require('../controller/userController');
const verifyOTP = require('../middleware/verifyOtp');
const userAuth = require('../middleware/userAuth');
const { fetchProductById } = require("../controller/ProductController");



//Login and signup , otp
router.post('/login', login)
router.post('/signup', verifyOTP, registerUser);
router.post('/logout', UserLogout)
router.post('/send-otp', sendOTP);


//Google auth login
router.post('/auth/google-signup', googleSignIn);
router.post('/auth/google-login', googleLoginUser)


//categorys , products , etc...
router.get('/fetch_product_by_date', fetchLatestProduct)
router.get('/fetch_all_product', fetchActiveProduct)
router.get('/get_active_categories', getActiveCategories);
router.get('/product/:id', fetchProductById);
router.get('/products/related/:id', fetchRelatedProducts);



//USER ADDRESS
router.post('/addresses', userAddAddress);

module.exports = router;
