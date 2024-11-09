const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    transactions: [
        {
            order_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "order",
            },
            transaction_date: {
                type: Date,
                required: true,
            },
            transaction_type: {
                type: String,
                enum: ["debit", "credit"],
                required: true,
            },
            transaction_status: {
                type: String,
                enum: ["pending", "completed", "failed"],
                required: true,
            },
            amount: {
                type: Number,
                required: true,
            },
        }
    ]
})


const Wallet = mongoose.model("Wallet", walletSchema)
module.exports = Wallet