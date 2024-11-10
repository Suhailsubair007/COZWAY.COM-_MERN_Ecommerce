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


const applyCoupon = async (req, res) => {
    try {
        const { code, userId } = req.body;
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }
        const currentDate = new Date();
        if (currentDate > coupon.expiration_date) {
            return res.status(400).
                json({ message: "Coupon has expired" });
        }

        const userUsage = coupon.users_applied.find(u => u.user.toString() === userId);

        if (userUsage) {
            if (coupon.usage_limit && userUsage.used_count >= coupon.usage_limit) {
                return res.status(400).json({
                    message: "Coupon usage limit reached for this user"
                });
            }

            userUsage.used_count += 1;
        } else {

            coupon.users_applied.push({ user: userId, used_count: 1 });
        }

        await coupon.save();
        return res.status(200).json({
            message: "Coupon applied successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error", error: error.message
        });
    }
};
module.exports = {
    addCoupon,
    applyCoupon
};
