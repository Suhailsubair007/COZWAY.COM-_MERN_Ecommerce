const Order = require('../../model/order');
const Cart = require('../../model/cart')

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
            order_status: "Pending"
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

        const cart = await Cart.findOne({ userId });
        console.log(cart)

        if (cart) {
            cart.products = cart.products.filter(item =>
                !order_items.some(orderItem => orderItem.product === item.productId)
            );
            await cart.save();
            console.log("Items removed from cart");

        }
        return res.status(201).json({ order, success: true, message: "Order Placed" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to place order", error });
    }
};



module.exports = { createOrder, getCheckoutCartItems }