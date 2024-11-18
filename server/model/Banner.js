const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    heading: {
        type: String,
        required: true,
    },
    subHeading: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});



const Banner = mongoose.model('Banner', BannerSchema);

module.exports = Banner;