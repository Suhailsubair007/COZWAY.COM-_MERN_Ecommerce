const User = require("../model/User");
const Category = require('../model/Category');
const bcrypt = require("bcrypt");
const Product = require('../model/Product')
const Admin = require('../model/Admin')

const securePassword = async (password) => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        console.log(error);
    }
};

const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const hashedPassword = await securePassword(password);

        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();
        res.status(201).json({ message: 'User registered successfully', user: { email, name} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email)
        console.log(password)
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const admin = await Admin.findOne({ email });
        console.log(admin)
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            name: admin.name,
            email: admin.email,
            _id: admin._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};





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
        const categories = await Category.find({ is_active: true }, '_id name description is_active');
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
        const { name, description, price, category, fit, sleeve, sizes, images } = req.body;
        if (!name || !description || !price || !category || !fit || !sleeve || !sizes || !images) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const totalStock = sizes.reduce((total, size) => total + size.stock, 0);

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

        const products = await Product.find({}).populate('category', 'name');

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
        console.log("is_active:", is_active);
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



const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, fit, sleeve, sizes, totalStock, images } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }


        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }


        if (category) {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(400).json({ message: 'Category not found.' });
            }
        }

        existingProduct.name = name || existingProduct.name;
        existingProduct.description = description || existingProduct.description;
        existingProduct.price = price || existingProduct.price;
        existingProduct.category = category || existingProduct.category;
        existingProduct.fit = fit || existingProduct.fit;
        existingProduct.sleeve = sleeve || existingProduct.sleeve;
        existingProduct.sizes = sizes || existingProduct.sizes;
        existingProduct.totalStock = totalStock || existingProduct.totalStock;
        existingProduct.images = images || existingProduct.images;


        const updatedProduct = await existingProduct.save();

        res.status(200).json({
            message: 'Product updated successfully!',
            product: updatedProduct,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


const getCoutomers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users) {
            res.status(200).json({
                users

            });
            console.log(users)
        }
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const updateCoustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_blocked } = req.body;
        console.log(is_blocked)
        console.log(id)

        const updateStats = await User.findByIdAndUpdate(id, { is_blocked }, { new: true })
        console.log(updateStats);
        if (!updateStats) {
            return res.status(404).json({ message: 'Product not found..' });
        }

        res.status(200).json(updateStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating category status' });
    }

}


const fetchProductById = async (req, res) => {
    const { id } = req.params;

    console.log(id)

    try {
        const product = await Product.findById(id).populate('category');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
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
    updateProduct,
    getCoutomers,
    updateCoustomerStatus,
    fetchProductById,
    registerAdmin,
    AdminLogin,
};



