const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: true,
    },
    offer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
        default: null,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    fit: {
        type: String,
        enum: ['Slim Fit', 'Regular Fit', 'Loose Fit'],
        required: true,
    },
    sleeve: {
        type: String,
        enum: ['Full Sleeve', 'Half Sleeve', 'Elbow Sleeve'],
        required: true,
    },
    sizes: [
        {
            size: { type: String, required: true },
            stock: { type: Number, required: true },
        },
    ],
    totalStock: {
        type: Number,
        required: true,
    },
    images: [
        {
            type: String,
            required: true,
        },
    ],
    is_active: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
