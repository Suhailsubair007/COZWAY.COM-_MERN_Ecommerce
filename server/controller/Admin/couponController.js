const Coupon = require('../../model/coupun');


const addCoupon = async (req, res) => {
    try {
        const { code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, expiration_date, usage_limit } = req.body;


        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                message: "Coupon code already exists."
            });
        }

        const newCoupon = new Coupon({
            code: code.toUpperCase(),
            description,
            discount_type,
            discount_value,
            min_purchase_amount,
            max_discount_amount,
            expiration_date,
            usage_limit,
        });

        await newCoupon.save();
        return res.status(201).json({
            message: "Coupon added successfully",
            coupon: newCoupon
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    addCoupon,
};
