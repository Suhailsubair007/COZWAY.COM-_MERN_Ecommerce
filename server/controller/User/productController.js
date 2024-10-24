const Product = require('../../model/Product')

const fetchLatestProduct = async (req, res) => {
    try {

        const products = await Product.find({ is_active: true }).sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

const fetchActiveProduct = async (req, res) => {
    try {
        const products = await Product.find({ is_active: true }).populate('category', 'name');;
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
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

const fetchRelatedProducts = async (req, res) => {
    const { id } = req.params;
    try {
        const products = await Product.find({ category: id, is_active: true }).populate('category', 'name');
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found for this category' });
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

module.exports = {
    fetchLatestProduct,
    fetchActiveProduct,
    fetchProductById,
    fetchRelatedProducts
};
