const Product = require('../../model/Product')


///controller for fetch the lstest products...
const fetchLatestProduct = async (req, res) => {
    try {

        const products = await Product.find({ is_active: true }).sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


// Fetch the active products....
const fetchActiveProduct = async (req, res) => {
    try {
        const products = await Product.find({ is_active: true }).populate('category', 'name');;
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


//Fetch the products by purticular id...
const fetchProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id).populate('category').populate('offer');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};


//Reatated products recomentation....
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

//The main products searching and filtering controller...
const advancedSearch = async (req, res) => {
    try {
        const { searchTerm, categories, fits, sleeves, page = 1, limit = 8, sortBy = 'createdAt' } = req.query;

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

        if (fits && fits.length > 0) {
            query.fit = { $in: fits.split(',') };
        }

        if (sleeves && sleeves.length > 0) {
            query.sleeve = { $in: sleeves.split(',') };
        }

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
            case 'a_z':
                sortOption = { name: 1 };
                break;
            case 'z_a':
                sortOption = { name: -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const [totalProducts, products] = await Promise.all([
            Product.countDocuments(query),
            Product.find(query)
                .populate('category', 'name' ).populate('offer')
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(Number(limit)),
        ])

        const totalPages = Math.ceil(totalProducts / limit);


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
