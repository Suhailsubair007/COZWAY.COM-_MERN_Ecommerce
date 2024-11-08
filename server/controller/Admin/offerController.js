const Offer = require('../../model/Offer');
const Product = require('../../model/Product');
const Category = require('../../model/Category')





const getOffers = async (req, res) => {
    try {
        const offers = await Offer.find({});

        const categoryOffers = offers.filter(offer => offer.target_type === "category");
        const productOffers = offers.filter(offer => offer.target_type === "product");

        res.status(200).json({
            success: true,
            message: "Success",
            categoryOffers,
            productOffers
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

//Contoller for add a new offfer.....
const addOffer = async (req, res) => {
    console.log("reachedddd---------------------")
    try {
        const { name, value, target, targetId, targetName, endDate } = req.body;

        console.log("target id------>",target)
        console.log("target -------->",targetId)

        const new_offer = await Offer.create({
            name,
            offer_value: value,
            target_type: target,
            target_id: targetId,
            target_name: targetName,
            end_date: endDate
        });

        if (target === "product") {
            const product = await Product.findById(targetId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found.."
                });
            }
            if (value > product?.offer?.offer_value || product?.offer?.offer_value == undefined) {
                product.offer = new_offer._id;
            }
            await product.save();
        } else if (target === "category") {
            const products = await Product.find({ category: targetId }).populate("offer");
            for (const product of products) {
                const originalOfferId = product.offer ? product.offer._id : null;

                if (value > product?.offer?.offer_value || product?.offer?.offer_value == undefined) {
                    product.offer = new_offer._id;
                }
                await product.save();

                product.originalOfferId = originalOfferId;
                await product.save();
            }
        }
        console.log("offerrrr added ==>", new_offer);

        res.status(201).json({ success: true, new_offer });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}


//controller for delete the order
const deleteOffer = async (req, res) => {
    try {
        const { offerId } = req.body;
        const existingOffer = await Offer.findById(offerId);

        if (!existingOffer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        const offer = await Offer.deleteOne({ _id: offerId });

        if (!offer) {
            return res.status(404).json({
                success: false,
                message: "Offer not found"
            });
        }

        if (existingOffer.target_type === "product") {
            const product_data = await Product.find({
                category: existingOffer.target_id,
            }).populate("offer");

            for (const product of product_data) {
                if (product.offer && product.offer.target_type === "product") {
                    product.offer = null;
                }
                await product.save();
            }
        }

        if (existingOffer.target_type === "category") {
            const products = await Product.find({ category: existingOffer.target_id }).populate("offer");

            for (const product of products) {
                if (product.originalOfferId) {
                    product.offer = product.originalOfferId;
                } else {
                    product.offer = null;
                }
                await product.save();
            }
        }

        return res.status(200).json({
            success: true,
            message: "Offer deleted successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500)
    }
}

const getCategoriesForOffer = async (req, res) => {
    console.log("reachedddddddddddddddddddddddddddd ")
    try {
        const categories = await Category.find({ is_active: true }, 'name');
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { addOffer, deleteOffer, getOffers, getCategoriesForOffer };