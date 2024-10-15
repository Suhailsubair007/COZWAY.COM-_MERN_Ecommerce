const express = require("express");
const router = express.Router();
const { addCategory, updateCategory, getCategories, fetchCategoryById, updateCategoryStatus, addProduct ,getProduct ,updateProductStatus } = require('../controller/adminController');


router.post('/add_category', addCategory);
router.put('/edit-category/:id', updateCategory);
router.get('/categories', getCategories);
router.get('/categories/edit/:categoryId', fetchCategoryById);
router.patch('/categories/:id', updateCategoryStatus);
router.post('/add_product', addProduct);
router.get('/get_product',getProduct);
router.patch('/get_product/:id', updateProductStatus);


module.exports = router;