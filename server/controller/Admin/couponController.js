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



const getCouponById = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }

        return res.status(200).json({
            message: "Coupon fetched successfully",
            coupon: coupon
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// PUT - Edit coupon details
const editCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            code,
            description,
            discount_type,
            discount_value,
            min_purchase_amount,
            max_discount_amount,
            expiration_date,
            usage_limit
        } = req.body;

        const coupon = await Coupon.findById(id);

        if (!coupon) {
            return res.status(404).json({
                message: "Coupon not found"
            });
        }

        if (code !== coupon.code) {
            const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
            if (existingCoupon) {
                return res.status(400).json({
                    message: "Coupon code already exists."
                });
            }
        }

        coupon.code = code.toUpperCase();
        coupon.description = description;
        coupon.discount_type = discount_type;
        coupon.discount_value = discount_value;
        coupon.min_purchase_amount = min_purchase_amount;
        coupon.max_discount_amount = max_discount_amount;
        coupon.expiration_date = expiration_date;
        coupon.usage_limit = usage_limit;

        await coupon.save();

        return res.status(200).json({
            message: "Coupon updated successfully",
            coupon: coupon
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
    getAllCoupons,
    editCoupon,
    getCouponById
};
