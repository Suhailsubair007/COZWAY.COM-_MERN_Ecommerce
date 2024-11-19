const Banner = require('../../model/Banner')


const addBanner = async (req, res) => {
    try {
        const { image, heading, subHeading, description } = req.body;

        if (!image || !heading || !subHeading || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const banner = new Banner({
            image,
            heading,
            subHeading,
            description,
        });
        const savedBanner = await banner.save();
        res.status(201).json({
            message: 'Banner added successfully',
            data: savedBanner,
        });
    } catch (error) {
        console.error('Error adding banner:', error);
        res.status(500).json({
            message: 'Internal server error',   
        });
    }
};

const getAllBanners = async (req, res) => {
    try {
        const banners = await Banner.find({});
        res.status(200).json({
            message: 'Banners fetched successfully',
            data: banners,
        });
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};


const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }
        await Banner.findByIdAndDelete(id);
        res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({
            message: 'Internal server error',
        });
    }
};
module.exports = {
    addBanner,
    getAllBanners,
    deleteBanner
};
