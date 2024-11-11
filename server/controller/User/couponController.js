const Coupon = require('../../model/coupun');

const applyCoupon = async (req, res) => {
    try {
        const { code, userId, subtotal } = req.body;

        console.log("sub total coupon -->", subtotal)
        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }

        if (subtotal < coupon.min_purchase_amount) {
            return res.status(400).json({
                message: `Minimum purchase amount of ${coupon.min_purchase_amount} is required to apply this coupon`
            });
        }

        const currentDate = new Date();
        if (currentDate > coupon.expiration_date) {
            return res.status(400).json({
                message: "Coupon has expired"
            });
        }

        const userUsage = coupon.users_applied.find(u => u.user.toString() === userId);

        if (userUsage && coupon.usage_limit && userUsage.used_count >= coupon.usage_limit) {
            return res.status(400).json({
                message: "Coupon usage limit reached for this user"
            });
        }


        let discountAmount;
        if (coupon.discount_type === "percentage") {
            discountAmount = Math.ceil((subtotal * coupon.discount_value) / 100);
            if (coupon.max_discount_amount) {
                discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
            }
        } else {
            discountAmount = coupon.discount_value;
            if (coupon.max_discount_amount) {
                discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
            }
        }

        console.log("discount amount ----->", discountAmount)

        return res.status(200).json({
            coupon,
            discountAmount,
            message: "Coupon applied successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error", error: error.message
        });
    }
} ;

const getCoupens = async (req, res) => {
    try {
        const coupens = await Coupon.find({})

        res.status(200).json({
            sucess: true,
            message: "fetched...",
            coupens
        })

    } catch (error) {
        console.log(error)
    }

}


module.exports = {
    applyCoupon,
    getCoupens
};