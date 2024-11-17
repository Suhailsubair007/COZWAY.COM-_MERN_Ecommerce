const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    order_id: {
        type: String,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    order_items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            selectedSize: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true,
            },
            totalProductPrice: {
                type: Number,
                required: true,
            },
            order_status: {
                type: String,
                required: true,
                enum: ["pending", "shipped", "delivered", "cancelled", "returned"],
                default: "pending",
            },
            return_request: {
                is_requested: {
                    type: Boolean,
                    default: false,
                },
                reason: {
                    type: String,
                },
                comment: {
                    type: String,
                },
                is_approved: {
                    type: Boolean,
                    default: false,
                },
                is_response_send: {
                    type: Boolean,
                    default: false,
                },
            },

        },
    ],
    total_amount: {
        type: Number,
        required: true,
        min: [0, "Total amount cannot be negative"],
    },
    shipping_address: {
        address: String,
        district: String,
        state: String,
        phone: Number,
        pincode: Number,
    },
    payment_method: {
        type: String,
        required: true,
        enum: [
            "Wallet",
            "Cash on Delivery",
            "RazorPay",
        ],
    },

    payment_status: {
        type: String,
        required: true,
        enum: ["Pending", "Paid", "Failed", "Refunded"],
        default: "Pending",
    },
    total_discount: {
        type: Number,
        default: 0,
    },
    coupon_discount: {
        type: Number,
        default: 0,
    },
    total_price_with_discount: {
        type: Number,
        required: true,
    },
    shipping_fee: {
        type: Number,
        required: true,
        default: 0,
        min: [0, "Shipping fee cannot be negative"],
    },
    placed_at: {
        type: Date,
        default: Date.now,
    },
    delivery_by: {
        type: Date,
        default: function () {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 7);
            return currentDate;
        },
    },
}, { timestamps: true });


//To genarate a random unique order id for each ordersss.....

orderSchema.pre('save', function (next) {
    if (!this.order_id) {
        const uniqueId = `COZ${Date.now()}${Math.floor(Math.random() * 1000)}`;
        this.order_id = uniqueId;
    }
    next();
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
