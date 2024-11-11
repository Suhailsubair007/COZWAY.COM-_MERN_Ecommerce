if (current_offer.target_type == "product") {
    const product_data = await Product.findOne({
        _id: current_offer.target_id,
    }).populate("offer");

    const is_any_category_offer_exists = await Offer.findOne({
        target_id: product_data.category,
    });

    console.log(
        "is any category offer exists===>",
        is_any_category_offer_exists
    );

    if (product_data) {
        product_data.offer = is_any_category_offer_exists
            ? is_any_category_offer_exists._id
            : null;
    }
    await product_data.save();
}

if (current_offer.target_type == "category") {
    const product_data = await Product.find({
        category: current_offer.target_id,
    }).populate("offer");

    for (const product of product_data) {
        const is_any_product_offer_exists = await Offer.findOne({
            target_id: product._id,
        });
        console.log(is_any_product_offer_exists);
        if (product) {
            product.offer = is_any_product_offer_exists
                ? is_any_product_offer_exists._id
                : null;
        }
        await product.save();
    }
}