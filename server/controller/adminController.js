const User = require("../model/User");
const Category = require('../model/Category');
const bcrypt = require("bcrypt");
const Product = require('../model/Product')



const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;


        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category with this name already exists' });
        }


        const newCategory = new Category({
            name,
            description,
            isActive: true,
            createdAt: new Date(),
        });


        await newCategory.save();

        res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


const updateCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        let categoryId = req.params.id;

        categoryId = categoryId.replace(/:/g, '');

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};






const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}, '_id name description is_active');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


const fetchCategoryById = async (req, res) => {
    const { categoryId } = req.params;  // Use params instead of body
    console.log(categoryId)

    try {
        const category = await Category.findById(categoryId);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


const updateCategoryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { is_active },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating category status' });
    }
};




const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, fit, sleeve, sizes, totalStock, images } = req.body;
        if (!name || !description || !price || !category || !fit || !sleeve || !sizes || !totalStock || !images) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(400).json({ message: 'Category not found.' });
        }

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            fit,
            sleeve,
            sizes,
            totalStock,
            images,
        });
        console.log(newProduct);

        const savedProduct = await newProduct.save();
        res.status(201).json({
            message: 'Product added successfully!',
            product: savedProduct,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


const getProduct = async (req, res) => {
    try {
        // Fetch products and populate the category name
        const products = await Product.find({}).populate('category', 'name');

        // Map through products to include populated category name
        const formattedProducts = products.map(product => ({
            ...product.toObject(), // Convert the Mongoose document to a plain JavaScript object
            category: product.category.name, // Replace the category ID with the category name
        }));

        // Send the formatted response
        res.status(200).json(formattedProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Product ID:", id);

        const { is_active } = req.body;
        console.log("is_active:", is_active);  // Ensure this is being received correctly

        // Update the product status
        const updateStatus = await Product.findByIdAndUpdate(
            id,
            { is_active },
            { new: true }
        );

        if (!updateStatus) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updateStatus);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product status' });
    }
};





module.exports = {
    addCategory,
    updateCategory,
    getCategories,
    fetchCategoryById,
    updateCategoryStatus,
    addProduct,
    getProduct,
    updateProductStatus,
};