const express = require("express");
const router = express.Router();
const { registerAdmin, AdminLogin, getCoutomers, updateCoustomerStatus } = require('../controller/adminController');
const { addCategory, updateCategory, getCategories, fetchCategoryById, updateCategoryStatus } = require('../controller/CategoryController')
const { addProduct, getProduct, updateProductStatus, updateProduct, fetchProductById } = require('../controller/ProductController')


//Admin login and Signup route..
router.post('/signup', registerAdmin);
router.post('/login', AdminLogin);


//Category related routes..
router.post('/add_category', addCategory);
router.put('/edit-category/:id', updateCategory);
router.get('/categories', getCategories);
router.get('/categories/edit/:categoryId', fetchCategoryById);
router.patch('/categories/:id', updateCategoryStatus);


//Product related routes..                                                  
router.post('/add_product', addProduct);
router.get('/get_product', getProduct);
router.patch('/get_product/:id', updateProductStatus);
router.put('/update_product/:id', updateProduct);


//User related details..
router.get('/coustmers', getCoutomers);
router.patch('/coustmers/:id', updateCoustomerStatus);
router.get('/product/edit/:id', fetchProductById);

module.exports = router;