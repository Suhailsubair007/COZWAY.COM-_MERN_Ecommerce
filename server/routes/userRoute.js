const express = require("express");
const router = express.Router();
const verifyOTP = require('../middleware/verifyOtp');
const userController = require('../controller/User/userController')
const address = require('../controller/User/addressController')
const categoryController = require('../controller/User/categoryController')
const productController = require('../controller/User/productController')
const profileController = require('../controller/User/profileController')
const cartController = require('../controller/User/cartController')
const orderController = require('../controller/User/orderController')
const verifyUser = require('../middleware/userAuth')



//Login and signup , otp
router.post('/login', userController.login)
router.post('/signup', verifyOTP, userController.registerUser);
router.post('/logout', userController.UserLogout)
router.post('/send-otp', userController.sendOTP);

//profie based contoller..
router.patch('/profile/:id', profileController.updateProfile);
router.get('/user/:id', profileController.getUserData);

//forgot password controller..
router.post('/reset', userController.sendOTPForPasswordReset)
router.post('/reset-password', userController.resetPassword);
router.post('/verify', verifyOTP, userController.verifyResetOTP);

//Google auth login
router.post('/auth/google-signup', userController.googleSignIn);
router.post('/auth/google-login', userController.googleLoginUser);

//products reataed routes..
router.get('/advanced-search', verifyUser, productController.advancedSearch);
router.get('/latest', verifyUser, productController.fetchLatestProduct);
router.get('/active', verifyUser, productController.fetchActiveProduct);
router.get('/product/:id', verifyUser, productController.fetchProductById);
router.get('/related/:id', verifyUser, productController.fetchRelatedProducts);

//category related..
router.get('/get_active_categories', verifyUser, categoryController.getActiveCategories);

//manage the address routes end points...
router.post('/addresses', verifyUser, address.userAddAddress);
router.get('/addresses/:userId', verifyUser, address.getUserAddresses);
router.delete('/address/:addressId', verifyUser, address.deleteUserAddress);
router.get('/address/:id', verifyUser, address.getAddressById);
router.patch('/addresses/:id', verifyUser, address.updateUserAddress);

//cart mangement routess...
router.post('/add-to-cart', verifyUser, cartController.addToCart);
router.get('/get-cart-details', verifyUser, cartController.getCartDetails);
router.get('/cart/:userId', verifyUser, cartController.getAllCartItems);
router.get('/cartLength/:id', verifyUser, cartController.getUserCartProductCount);
router.delete('/delete/:id/:pr_id', verifyUser, cartController.deleteItem);

// router.patch('/quantity/:userId/:itemId', cartController.updateCartItemQuantity);
router.patch('/quantity/add/:userId/:itemId', verifyUser, cartController.incrementCartItemQuantity);
router.patch('/quantity/min/:userId/:itemId', verifyUser, cartController.decrementCartItemQuantity);

//Route that mange order related API....
router.get('/items/:userId', verifyUser, orderController.getCheckoutCartItems);
router.post('/order', verifyUser, orderController.createOrder);
router.get('/orders/:userId', verifyUser, orderController.getUserOrders);
router.get('/order/:orderId', verifyUser, orderController.getOrderById);
router.patch('/order/:orderId', verifyUser, orderController.cancelOrder);


module.exports = router;
