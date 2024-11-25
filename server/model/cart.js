const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            size: {
                type: String,
                required: true
            },
            stock: {
                type: Number,
                default: 1
            },
            price: {
                type: Number,
                required: true,
                min: 0
            },
            offerPrice: {
                type: Number,
                min: 0,
            },
            discount: {
                type: Number,
                default: function () {
                    return ((this.price - this.offerPrice) / this.price) * 100;
                }
            },
            quantity: {
                type: Number,
                required: true,
            },
            totalProductPrice: {
                type: Number,
                required: true,
                default: function () {
                    return this.offerPrice * this.quantity;
                }
            }
        }
    ],
    totalCartPrice: {
        type: Number,
        required: true,
        default: function () {
            return this.products.reduce((acc, product) => acc + product.totalProductPrice, 0);
        }
    }
}, {
    timestamps: true
});

// Calculate totalCartPrice on save

cartSchema.pre('save', function (next) {
    this.totalCartPrice = this.products.reduce((acc, product) => acc + product.totalProductPrice, 0);
    next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
