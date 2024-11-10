const Product = require('../model/Product')
const Offer = require('../model/Offer')

async function applyProductOffer(productId, newOffer) {
    const product = await Product.findById(productId).populate('offer');
    if (!product) {
        throw new Error("Product not found");
    }

    const categoryOffer = await Offer.findOne({ target_type: 'category', target_id: product.category });

    if (!product.offer || newOffer.offer_value > product.offer.offer_value) {
        if (!categoryOffer || newOffer.offer_value > categoryOffer.offer_value) {
            product.offer = newOffer._id;
            await product.save();
        }
    }
}

async function applyCategoryOffer(categoryId, newOffer) {
    const products = await Product.find({ category: categoryId }).populate('offer');
    for (const product of products) {
        if (!product.offer || newOffer.offer_value > product.offer.offer_value) {
            product.offer = newOffer._id;
            await product.save();
        }
    }
}

async function removeProductOffer(productId) {
    const product = await Product.findById(productId).populate('category');
    if (product) {
        const categoryOffer = await Offer.findOne({ target_type: 'category', target_id: product.category._id });
        product.offer = categoryOffer ? categoryOffer._id : null;
        await product.save();
    }
}

async function removeCategoryOffer(categoryId) {
    const products = await Product.find({ category: categoryId }).populate('offer');
    for (const product of products) {
        if (product.offer && product.offer.target_type === 'category') {
            const productOffer = await Offer.findOne({
                target_type: 'product',
                target_id: product._id,
                offer_value: { $gt: product.offer.offer_value }
            });
            product.offer = productOffer ? productOffer._id : null;
            await product.save();
        }
    }
}

module.exports = {
    applyProductOffer,
    applyCategoryOffer,
    removeProductOffer,
    removeCategoryOffer
};