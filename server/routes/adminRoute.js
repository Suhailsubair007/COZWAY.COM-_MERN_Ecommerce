const express = require("express");
const router = express.Router();
const { addCategory, updateCategory, getCategories, fetchCategoryById, updateCategoryStatus } = require('../controller/adminController');


router.post('/add_category', addCategory);
router.put('/edit-category/:id', updateCategory);
router.get('/categories', getCategories);
router.get('/categories/edit/:categoryId', fetchCategoryById);
router.patch('/categories/:id', updateCategoryStatus);


module.exports = router;