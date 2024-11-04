const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    is_blocked: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        required: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
