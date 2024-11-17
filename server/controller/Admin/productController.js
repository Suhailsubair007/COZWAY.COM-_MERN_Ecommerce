const Category = require('../../model/Category');
const Product = require('../../model/Product')
const Offer = require('../../model/Offer')

//POST---To add a product and save to the database.....
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


        const offers = await Offer.find({
            target_type: 'category',
            target_id: category,
        });

        let highestOffer = null;
        if (offers.length > 0) {
            highestOffer = offers.reduce((prev, current) => {
                return (prev.offer_value > current.offer_value) ? prev : current;
            });
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
            offer: highestOffer ? highestOffer._id : null, 
        });

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

//GET--Get the products to display in the admin side....
const getProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalProducts = await Product.countDocuments({});
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find({})
            .populate('category', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const formattedProducts = products.map(product => ({
            ...product.toObject(),
            category: product.category ? product.category.name : null,
        }));

        res.status(200).json({
            products: formattedProducts,
            currentPage: page,
            totalPages,
            totalProducts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

//PATCH--Update the product status for admion toogle......
const updateProductStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const { is_active } = req.body;
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




//PUT -- Update the product....
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

        // Update fields only if they are provided in the request...
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


//GET---To get the purticular products details....
const fetchProductById = async (req, res) => {
    const { id } = req.params;
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

//GET -- To get the product in the offer search box --(debounce search...)
const get_product_offer = async (req, res) => {
    try {
        const { searchTerm } = req.query;
        const products = await Product.find(
            {
                name: { $regex: new RegExp(searchTerm, "i") },
                is_active: true
            },
            { name: true }
        );

        res.status(200).json({ success: true, products });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
}

module.exports = {
    addProduct,
    getProduct,
    updateProductStatus,
    updateProduct,
    fetchProductById,
    get_product_offer
};
