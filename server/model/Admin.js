const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },

}, { timestamps: true });

module.exports = mongoose.model("Admin", userSchema);
