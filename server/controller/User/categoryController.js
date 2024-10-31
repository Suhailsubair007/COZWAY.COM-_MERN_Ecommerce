const Category = require('../../model/Category');


const getActiveCategories = async (req, res) => {
    try {
        const categories = await Category.find({ is_active: true }, 'name');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    getActiveCategories,
};     