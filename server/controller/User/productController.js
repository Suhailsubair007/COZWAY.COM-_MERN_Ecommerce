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
    console.log("oombii")
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


const advancedSearch = async (req, res) => {
    try {
        const { searchTerm, categories, sizes, page = 1, limit = 8, sortBy = 'createdAt' } = req.query;

        let query = { is_active: true };

        if (searchTerm) {
            query.$or = [
                { name: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        if (categories && categories.length > 0) {
            query.category = { $in: categories.split(',') };
        }

        if (sizes && sizes.length > 0) {
            query.sizes = { $in: sizes.split(',') };
        }

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        let sortOption = {};
        switch (sortBy) {
            case 'price_asc':
                sortOption = { offerPrice: 1 };
                break;
            case 'price_desc':
                sortOption = { offerPrice: -1 };
                break;
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            default:
                sortOption = { createdAt: -1 }; 
        }

        const products = await Product.find(query)
            .populate('category', 'name')
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).json({
            products,
            currentPage: Number(page),
            totalPages,
            totalProducts
        });
    } catch (error) {
        console.error('Error in advanced search:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


module.exports = {
    fetchLatestProduct,
    fetchActiveProduct,
    fetchProductById,
    fetchRelatedProducts,
    advancedSearch
};
