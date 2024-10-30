const Order = require('../../model/order');
const Cart = require('../../model/cart')
const Product = require('../../model/Product');

const getCheckoutCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const cartItems = await Cart.findOne({ userId })
            .populate({
                path: 'products.productId',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            });

        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const filtered = cartItems.products.filter((item) => item.quantity > 0);


        const totalCartPrice = filtered.reduce((total, item) => {
            return total + item.totalProductPrice;
        }, 0);

        res.status(200).json({
            success: true,
            message: "CHECKOUT CART ITEMS FETCHED",
            products: filtered,
            totalCartPrice
        });
    } catch (error) {
        console.error("Error fetching checkout cart items:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


const createOrder = async (req, res) => {
    try {
        const { userId, order_items, address, payment_method, subtotal } = req.body;
        const products = order_items.map(item => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.offerPrice,
            discount: 0,
            totalProductPrice: item.totalProductPrice,
            order_status: "Pending",
            size: item.size
        }));


        const order = await Order.create({
            userId,
            order_items: products,
            total_amount: subtotal,
            shipping_address: address,
            payment_method: payment_method,
            total_price_with_discount: subtotal,
            shipping_fee: 0,
        });

        console.log("order itemss=====>>>>",order_items)


        for (const item of order_items) {
            const product = await Product.findById(item.productId._id);
            console.log("prouct =======================>",product)
            if (product) {
                const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
                if (sizeIndex !== -1) {
                    product.sizes[sizeIndex].stock -= item.quantity;
                    await product.save();
                    console.log("size updatedddddd")
                }
            }
        }

        const cart = await Cart.findOne({ userId });

        if (cart) {
            cart.products = cart.products.filter(cartItem =>
                !order_items.some(orderItem =>
                    orderItem.productId._id === cartItem.productId.toString() &&
                    orderItem.size === cartItem.size
                )
            );

            cart.totalCartPrice = cart.products.reduce((total, item) => total + item.totalProductPrice, 0);

            await cart.save();
            console.log("Updated cart:", cart);
        }

        return res.status(201).json({ order, success: true, message: "Order Placed" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to place order", error });
    }
};



module.exports = { createOrder, getCheckoutCartItems }