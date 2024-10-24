
const Category = require('../../model/Category');



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


module.exports = {
    addCategory,
    updateCategory,
    getCategories,
    fetchCategoryById,
    updateCategoryStatus,
};
