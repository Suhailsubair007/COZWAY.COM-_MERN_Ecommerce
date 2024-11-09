const Order = require('../../model/order');
const Cart = require('../../model/cart')
const Product = require('../../model/Product');
const Wallet = require('../../model/Wallet')


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

        const filtered = cartItems.products.filter((item) =>
            item.quantity > 0 && item.productId.is_active
        );
        // console.log("cartItems========================>", filtered);

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

//cerate an order...
const createOrder = async (req, res) => {
    try {
        const { userId, order_items, address, payment_method, subtotal } = req.body;
        // console.log("payment method------>>>>", payment_method);

        // Check if payment method is wallet
        if (payment_method === 'Wallet') {
            const wallet = await Wallet.findOne({ user: userId });
            if (!wallet || wallet.balance < subtotal) {
                return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
            }
        }

        const products = order_items.map(item => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.offerPrice,
            selectedSize: item.size,
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

        // Update product stock
        for (const item of order_items) {
            const product = await Product.findById(item.productId._id);
            if (product) {
                const sizeIndex = product.sizes.findIndex(s => s.size === item.size);
                if (sizeIndex !== -1) {
                    product.sizes[sizeIndex].stock -= item.quantity;
                    await product.save();
                }
            }
        }

        // Update cart
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
        }

        // Update wallet if payment method is wallet
        if (payment_method === 'Wallet') {
            const wallet = await Wallet.findOne({ user: userId });
            wallet.balance -= subtotal;
            wallet.transactions.push({
                order_id: order._id,
                transaction_date: new Date(),
                transaction_type: "debit",
                transaction_status: "completed",
                amount: subtotal
            });
            await wallet.save();
        }

        return res.status(201).json({ order, success: true, message: "Order Placed" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to place order", error });
    }
};


//get the order details in the my orders page also pagination applied here...
const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;

        const totalOrders = await Order.countDocuments({ userId });
        const totalPages = Math.ceil(totalOrders / limit);

        const orders = await Order.find({ userId })
            .populate({
                path: 'order_items.product',
                model: 'Product',
                select: 'name price images category',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            })
            .skip(skip)
            .limit(limit)
            .sort({ placed_at: -1 });

        if (!orders.length) {
            return res.status(404).json({ success: false, message: 'No orders found for this user' });
        }

        res.status(200).json({
            success: true,
            message: "User orders fetched successfully",
            orders,
            currentPage: page,
            totalPages,
            totalOrders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};



//Detailed display of order......
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({ _id: orderId })
            .populate({
                path: 'order_items.product',
                model: 'Product',
                select: 'name price images category',
                populate: {
                    path: 'category',
                    select: 'name'
                }
            });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


const cancelOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        // console.log("user id for delete order------>", userId)
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate('order_items.product');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        if (order.order_status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Order is already canceled." });
        }

        order.order_status = 'cancelled';
        await order.save();


        for (const item of order.order_items) {
            const product = await Product.findById(item.product);
            if (product) {
                const sizeIndex = product.sizes.findIndex(s => s.size === item.selectedSize);
                if (sizeIndex !== -1) {
                    product.sizes[sizeIndex].stock += item.quantity;
                    product.totalStock += item.quantity;
                    await product.save();
                }
            }
        }

        console.log("updated order---------->", order)


        if (order.payment_method === "Wallet" && order.payment_method === "RazoryPay") {
            const wallet = await Wallet.findOne({ user: userId });
            if (wallet) {
                wallet.balance += order.total_amount;
                wallet.transactions.push({
                    order_id: order._id,
                    transaction_date: new Date(),
                    transaction_type: "credit",
                    transaction_status: "completed",
                    amount: order.total_amount,
                });

                await wallet.save();
            }
        }


        res.status(200).json({ success: true, message: "Order canceled and stock updated successfully." });
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({ success: false, message: "Failed to cancel order", error: error.message });
    }
};




module.exports = {
    createOrder,
    getCheckoutCartItems,
    getUserOrders,
    getOrderById,
    cancelOrder
};




