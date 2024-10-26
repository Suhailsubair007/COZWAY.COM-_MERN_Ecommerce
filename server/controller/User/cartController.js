const Cart = require('../../model/cart');

// Controller to add a product to the cart
const addToCart = async (req, res) => {
    try {
        console.log("vannu njnnnnn")
        const { userId, product } = req.body;
        if (product.quantity <= 0 || product.quantity > product.stock) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        // Calculate discount and total price for the product
        const discount = ((product.price - product.offerPrice) / product.price) * 100;
        const totalProductPrice = product.offerPrice * product.quantity;


        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({
                userId,
                products: [{
                    ...product,
                    discount,
                    totalProductPrice
                }],
                totalCartPrice: totalProductPrice
            });
        } else {

            const existingProduct = cart.products.find(p =>
                p.productId.toString() === product.productId && p.size === product.size
            );

            if (existingProduct) {
                existingProduct.quantity += product.quantity;
                existingProduct.totalProductPrice += totalProductPrice;
            } else {

                cart.products.push({ ...product, discount, totalProductPrice });
            }

            cart.totalCartPrice = cart.products.reduce((acc, item) => acc + item.totalProductPrice, 0);
        }


        await cart.save();
        res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding product to cart' });
    }
};
                                                   
module.exports = { addToCart };
