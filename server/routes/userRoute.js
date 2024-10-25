const express = require("express");
const router = express.Router();
const verifyOTP = require('../middleware/verifyOtp');
const userController = require('../controller/User/userController')
const address = require('../controller/User/addressController')
const categoryController = require('../controller/User/categoryController')
const productController = require('../controller/User/productController')
const profileController = require('../controller/User/profileController')
// const userAuth = require('../middleware/userAuth');



//Login and signup , otp
router.post('/login', userController.login)
router.post('/signup', verifyOTP, userController.registerUser);
router.post('/logout', userController.UserLogout)
router.post('/send-otp', userController.sendOTP);
router.patch('/profile/:id',profileController.updateProfile);
router.get('/user/:id',profileController.getUserData);



//Google auth login
router.post('/auth/google-signup', userController.googleSignIn);
router.post('/auth/google-login', userController.googleLoginUser);


//products , etc...
router.get('/fetch_product_by_date', productController.fetchLatestProduct)
router.get('/fetch_all_product', productController.fetchActiveProduct)
router.get('/product/:id', productController.fetchProductById);
router.get('/products/related/:id', productController.fetchRelatedProducts);

//category related..
router.get('/get_active_categories', categoryController.getActiveCategories);

//mage the address routes end points...
router.post('/addresses', address.userAddAddress);
router.get('/addresses/:userId', address.getUserAddresses);
router.delete('/address/:addressId', address.deleteUserAddress);
router.get('/address/:id', address.getAddressById);
router.patch('/addresses/:id', address.updateUserAddress);



module.exports = router;
