const Category = require('../../model/Category');
const Product = require('../../model/Product')


const addProduct = async (req, res) => {
    try {
        const { name, description, price, offerPrice, category, fit, sleeve, sizes, images } = req.body;
        if (!name || !description || !price || !offerPrice || !category || !fit || !sleeve || !sizes || !images) {
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
            offerPrice,
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
            ...product.toObject(),
            category: product.category.name,
        }));
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
        const { name, description, offerPrice, price, category, fit, sleeve, sizes, images } = req.body;

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

        // Update fields only if they are provided in the request
        existingProduct.name = name || existingProduct.name;
        existingProduct.description = description || existingProduct.description;
        existingProduct.price = price || existingProduct.price;
        existingProduct.offerPrice = offerPrice !== undefined ? offerPrice : existingProduct.offerPrice;
        existingProduct.category = category || existingProduct.category;
        existingProduct.fit = fit || existingProduct.fit;
        existingProduct.sleeve = sleeve || existingProduct.sleeve;
        existingProduct.images = images || existingProduct.images;

        if (sizes) {
            existingProduct.sizes = sizes;
            existingProduct.totalStock = sizes.reduce((total, size) => total + size.stock, 0);
        }

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
    addProduct,
    getProduct,
    updateProductStatus,
    updateProduct,
    fetchProductById,
};
