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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    fit: {
        type: String,
        required: true,
    },
    sleeve: {
        type: String,
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
    ia_active:{
        type:Boolean,
        default:true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
