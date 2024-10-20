const express = require("express");
const router = express.Router();
const verifyAdmin = require('../middleware/adminAuth')
const { registerAdmin, AdminLogin, getCoutomers, updateCoustomerStatus } = require('../controller/adminController');
const { addCategory, updateCategory, getCategories, fetchCategoryById, updateCategoryStatus } = require('../controller/CategoryController')
const { addProduct, getProduct, updateProductStatus, updateProduct, fetchProductById } = require('../controller/ProductController')


//Admin login and Signup route..
router.post('/signup', registerAdmin);
router.post('/login', AdminLogin);


//Category related routes..
router.post('/add_category', verifyAdmin, addCategory);
router.put('/edit-category/:id', verifyAdmin, updateCategory);
router.get('/categories', verifyAdmin, getCategories);
router.get('/categories/edit/:categoryId', verifyAdmin, fetchCategoryById);
router.patch('/categories/:id', verifyAdmin, updateCategoryStatus);


//Product related routes..                                                  
router.post('/add_product', verifyAdmin, addProduct);
router.get('/get_product', verifyAdmin, getProduct);
router.patch('/get_product/:id', verifyAdmin, updateProductStatus);
router.put('/update_product/:id', verifyAdmin, updateProduct);


//User related details..
router.get('/coustmers', getCoutomers);
router.patch('/coustmers/:id', verifyAdmin, updateCoustomerStatus);
router.get('/product/edit/:id', verifyAdmin, fetchProductById);

module.exports = router;