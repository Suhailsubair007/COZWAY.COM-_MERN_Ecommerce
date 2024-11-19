const Banner = require('../../model/Banner')


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


module.exports = {
    getAllBanners
}