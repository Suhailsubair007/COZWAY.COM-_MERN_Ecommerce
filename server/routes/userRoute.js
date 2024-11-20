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
const wishlistController = require('../controller/User/wishlistController')
const walletController = require('../controller/User/walletController')
const couponController = require('../controller/User/couponController')
const bannerController = require('../controller/User/bannerController')
const offerController = require('../controller/User/offerController')

//Middleware for the Authorisation...
const verifyUser = require('../middleware/userAuth')


//LOGIN AND SIGNUP ROUTES
router.post('/login', userController.login)
router.post('/signup', verifyOTP, userController.registerUser);
router.post('/logout', userController.UserLogout);
router.post('/send-otp', userController.sendOTP);


//REFERAL OFFER ROUTES...
router.get('/refferalCode', verifyUser, offerController.getReferralCode);
router.post('/refferal', verifyUser, offerController.applyReferralCode);
router.get('/seen/:userId', offerController.getHasSeen);
router.post('/skip', verifyUser, offerController.skipRefferalOffer);



//PROFILE BASRED ROUTES
router.patch('/profile/:id', profileController.updateProfile);
router.get('/user/:id', profileController.getUserData);
router.post('/update_password', profileController.changePassword)
router.post('/invoice', profileController.OrderInvoice);

//FORGOT PASSWORD RELATED ROUTES
router.post('/reset', userController.sendOTPForPasswordReset)
router.post('/reset-password', userController.resetPassword);
router.post('/verify', verifyOTP, userController.verifyResetOTP);

//GOOGLE LOGIN ROUTES
router.post('/auth/google-signup', userController.googleSignIn);
router.post('/auth/google-login', userController.googleLoginUser);

//PRODUCT RELAED ROUTES TO GET PRODUCTS BASED ON RELATED PRODUCT ,ACTIVE PRODUCTS...
router.get('/advanced-search', verifyUser, productController.advancedSearch);
router.get('/latest', productController.fetchLatestProduct);
router.get('/active', verifyUser, productController.fetchActiveProduct);
router.get('/product/:id', verifyUser, productController.fetchProductById);
router.get('/related/:id', verifyUser, productController.fetchRelatedProducts);

//CATEGORY ROUTES FOR FETC THE CATEGORY DYNAMICALLY... 
router.get('/get_active_categories', verifyUser, categoryController.getActiveCategories);

//ADDRESS ADD,DELETE,UPDATE,GET ROUTES...
router.post('/addresses', verifyUser, address.userAddAddress);
router.get('/addresses/:userId', verifyUser, address.getUserAddresses);
router.delete('/address/:addressId', verifyUser, address.deleteUserAddress);
router.get('/address/:id', verifyUser, address.getAddressById);
router.patch('/addresses/:id', verifyUser, address.updateUserAddress);

//CART RELATED ROUTES
router.post('/add-to-cart', verifyUser, cartController.addToCart);
router.get('/get-cart-details', verifyUser, cartController.getCartDetails);
router.get('/cart/:userId', verifyUser, cartController.getAllCartItems);
router.get('/cartLength/:id', verifyUser, cartController.getUserCartProductCount);
router.delete('/delete/:id/:pr_id', verifyUser, cartController.deleteItem);
router.patch('/quantity/add/:userId/:itemId', verifyUser, cartController.incrementCartItemQuantity);
router.patch('/quantity/min/:userId/:itemId', verifyUser, cartController.decrementCartItemQuantity);

//ORDER RELATED ROUTES
router.get('/items/:userId', orderController.getCheckoutCartItems);
router.post('/order', orderController.createOrder);
router.get('/orders/:userId', verifyUser, orderController.getUserOrders);
router.get('/order/:orderId', verifyUser, orderController.getOrderById);
router.patch('/order/:orderId/cancel/:productId', verifyUser, orderController.cancelOrder);
router.post('/order/:orderId/return/:productId', verifyUser, orderController.returnRequest)
router.post('/order/retry', orderController.failedPaymet)

//WISHLIST RELATED ROUTES
router.post('/wishlist/add', verifyUser, wishlistController.AddItemToWishlist);
router.post('/wishlist/remove', verifyUser, wishlistController.removeItemFromWishlist);
router.get('/wishlist/:userId', verifyUser, wishlistController.getAllWishlistItems);
router.get('/inwishlist', verifyUser, wishlistController.isInWishlist);
router.post('/movetocart', verifyUser, wishlistController.moveToCart);
router.get('/wishlist/length/:id', verifyUser, wishlistController.getWishlishProductCount)

//WALLET RELATED ROUTES
router.post('/wallet', verifyUser, walletController.addAmountToWallet)
router.get('/wallet', verifyUser, walletController.getUserWallet)

//COUPEN RELATED ROUTES
router.post('/coupon/apply', verifyUser, couponController.applyCoupon);
router.get('/coupons', verifyUser, couponController.getCoupens);

//ROUTES FOR GETTING ALL BANNERS
router.get('/banners', bannerController.getAllBanners)


module.exports = router;
