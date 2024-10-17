const express = require("express");
const router = express.Router();
const { addCategory, registerAdmin, AdminLogin, updateCategory, getCategories, fetchCategoryById, updateCategoryStatus, addProduct, getProduct, updateProductStatus, updateProduct, getCoutomers, updateCoustomerStatus, fetchProductById } = require('../controller/adminController');


router.post('/add_category', addCategory);
router.post('/signup', registerAdmin);
router.post('/login', AdminLogin);
router.put('/edit-category/:id', updateCategory);
router.get('/categories', getCategories);
router.get('/categories/edit/:categoryId', fetchCategoryById);
router.patch('/categories/:id', updateCategoryStatus);
router.post('/add_product', addProduct);
router.get('/get_product', getProduct);
router.patch('/get_product/:id', updateProductStatus);
router.put('/update_product/:id', updateProduct);
router.get('/coustmers', getCoutomers);
router.patch('/coustmers/:id', updateCoustomerStatus);
router.get('/product/edit/:id', fetchProductById);

module.exports = router;