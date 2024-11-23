const mongoose = require("mongoose");


function generateReferralCode(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode = '';
    for (let i = 0; i < length; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return referralCode;
}

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
    hasSeen: {
        type: Boolean,
        default: false,
    },
    referralCode: {
        type: String,
        unique: true,
    },
}, { timestamps: true });

userSchema.pre('save', function (next) {
    if (this.isNew && !this.referralCode) {
        this.referralCode = generateReferralCode();
    }
    next();
});

module.exports = mongoose.model("User", userSchema);
