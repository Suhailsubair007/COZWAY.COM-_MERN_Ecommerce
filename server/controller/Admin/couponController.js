const Coupon = require('../../model/coupun');


//POST--Add a new coupen discount....
const addCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discount_type,
            discount_value,
            min_purchase_amount,
            max_discount_amount,
            expiration_date,
            usage_limit } = req.body;


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



//DELETE---To delete the ccoupen...
const deleteCoupon = async (req, res) => {

    // console.log("arrived.......")
    try {
        const { id } = req.params;

        const coupon = await Coupon.findOneAndDelete({ _id: id });

        if (!coupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }

        return res.status(200).json({
            message: "Coupon deleted successfully",
            // coupon: coupon
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

//GET---To Display the coupens in table in the admin side...
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();

        return res.status(200).json({
            message: "Coupons fetched...",
            coupons: coupons
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
    deleteCoupon,
    getAllCoupons
};
