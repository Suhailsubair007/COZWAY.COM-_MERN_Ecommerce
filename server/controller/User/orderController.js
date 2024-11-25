const Order = require('../../model/order');
const Cart = require('../../model/cart')
const Product = require('../../model/Product');
const Wallet = require('../../model/Wallet')
const Coupon = require('../../model/coupun')


const getCheckoutCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const cartItems = await Cart.findOne({ userId })
            .populate({
                path: 'products.productId',
                populate: [
                    {
                        path: 'category',
                        select: 'name'
                    },
                    {
                        path: 'offer',
                        select: 'offer_value'
                    }
                ]
            });

        if (!cartItems) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const filtered = cartItems.products.filter((item) =>
            item.quantity > 0 && item.productId.is_active
        );

        filtered.forEach((item) => {
            const product = item.productId;
            const sizeData = product.sizes.find((s) => s.size === item.size);

            if (sizeData) {
                if (item.quantity > sizeData.stock) {
                    item.quantity = sizeData.stock;
                } else if (item.quantity === 0 && sizeData.stock > 1) {
                    item.quantity = 1;
                }

                item.totalProductPrice = (item.offerPrice - (item.offerPrice * (item.productId?.offer?.offer_value ? item.productId?.offer?.offer_value : 0) / 100)) * item.quantity;
                item.discount = (((item.price - item.offerPrice) / item.price) * 100) + (item.productId?.offer?.offer_value ? item.productId?.offer?.offer_value : 0);
            }
        });

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


const checkStockAvailability = async (req, res) => {
    try {
        const { order_items } = req.body;

        for (const item of order_items) {
            const product = await Product.findById(item.productId._id);

            if (!product || !product.is_active) {
                return res.status(400).json({
                    success: false,
                    message: `The product ${item.productId.name} has been blocked by the admin.`
                });
            }

            const currentProduct = product.sizes.find(s => s.size === item.size);
            if (!currentProduct || currentProduct.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Currently, the quantity of ${product.name} for size ${item.size} is out of stock!`
                });
            }
        }

        return res.status(200).json({
            success: true,
            message: "All items are in stock"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error checking stock availability",
            error: error.message
        });
    }
};
//cerate an order...
const createOrder = async (req, res) => {
    try {
        const {
            userId,
            order_items,
            address,
            payment_method,
            payment_status,
            subtotal,
            total_discount,
            coupon_discount,
            total_price_with_discount,
            shipping_fee,
            coupon
        } = req.body;




        const discountAmount = (subtotal * total_discount) / 100;
        const calculatedTotal = subtotal - discountAmount + shipping_fee;

        if (total_price_with_discount === 0) {
            return res.status(200), json({
                sucess: false,
                message: "Cannot place the order"
            })
        }


        for (const item of order_items) {
            const product = await Product.findById(item.productId._id);

            if (!product || !product.is_active) {
                return res.status(400).json({
                    success: false,
                    message: `The product ${item.productId.name} has been blocked by the admin.`
                });
            }

            const currentProduct = product.sizes.find(s => s.size === item.size);
            if (currentProduct && currentProduct.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Currently, the quantity of ${product.name} for size ${item.size} is out of stock!`
                });
            }
        }

        if (payment_method === 'Cash on Delivery' && total_price_with_discount > 1200) {
            return res.status(400).json({
                sucess: false,
                message: "COD is not availble for above 1200 Rs"
            })
        }


        // Check if payment method is wallet...
        if (payment_method === 'Wallet') {
            const wallet = await Wallet.findOne({ user: userId });
            if (!wallet || wallet.balance < total_price_with_discount) {
                return res.status(400).json({ success: false, message: "Insufficient wallet balance" });
            }
        }

        const products = order_items.map(item => {
            const discountedPrice =
                item.offerPrice -
                (item.offerPrice *
                    (item.productId?.offer?.offer_value ?
                        item.productId.offer.offer_value : 0)) / 100;
            return {
                product: item.productId,
                quantity: item.quantity,
                price: discountedPrice,
                selectedSize: item.size,
                discount: item.discount,
                totalProductPrice: (discountedPrice * item.quantity).toFixed(0),
                order_status: "pending",
                size: item.size
            };
        });

        const order = await Order.create({
            userId,
            order_items: products,
            total_amount: subtotal,
            shipping_address: address,
            payment_method: payment_method,
            payment_status: payment_method === "Cash on Delivery" ? "Pending" : "Paid",
            total_discount,
            coupon_discount,
            payment_status: payment_status,
            total_price_with_discount,
            shipping_fee,
            coupon
        });

        // Update product stock
        for (const item of order_items) {
            await Product.findOneAndUpdate(
                {
                    _id: item.productId._id,
                    'sizes.size': item.size
                },
                {
                    $inc: {
                        'sizes.$.stock': -item.quantity,
                        'totalStock': -item.quantity
                    }
                }
            );
        }

        // Update cart
        await Cart.findOneAndUpdate(
            { userId },
            {
                $pull: {
                    products: {
                        $or: order_items.map(orderItem => ({
                            productId: orderItem.productId._id,
                            size: orderItem.size
                        }))
                    }
                }
            }
        );

        const updatedCart = await Cart.findOne({ userId });
        if (updatedCart) {
            const newTotalCartPrice = updatedCart.products.reduce(
                (total, item) => total + item.totalProductPrice,
                0
            );
            await Cart.findOneAndUpdate(
                { userId },
                { totalCartPrice: newTotalCartPrice }
            );
        }

        if (payment_method === 'Wallet') {
            await Wallet.findOneAndUpdate(
                { user: userId },
                {
                    $inc: { balance: -total_price_with_discount },
                    $push: {
                        transactions: {
                            order_id: order._id,
                            transaction_date: new Date(),
                            transaction_type: "debit",
                            transaction_status: "completed",
                            amount: total_price_with_discount
                        }
                    }
                }
            );
        }

        if (coupon) {
            await Coupon.findOneAndUpdate(
                {
                    code: coupon,
                    'users_applied.user': { $ne: userId }
                },
                {
                    $push: {
                        users_applied: {
                            user: userId,
                            used_count: 1
                        }
                    }
                }
            );

            await Coupon.findOneAndUpdate(
                {
                    code: coupon,
                    'users_applied.user': userId
                },
                {
                    $inc: {
                        'users_applied.$.used_count': 1
                    }
                }
            );
        }
        return res.status(201).json({ order, success: true, message: "Order Placed" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Failed to place order", error: error.message });
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
                select: 'name price offerPrice images category offer',
                populate: [
                    {
                        path: 'offer',
                        select: 'name offer_value'
                    },
                    {
                        path: 'category',
                        select: 'name'
                    }
                ],
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
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { userId } = req.body;
        const { orderId, productId } = req.params;
        const order = await Order.findById(orderId).populate('order_items.product');
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found."
            });
        }

        const orderItem = order.order_items.find(
            item => item._id.toString() === productId
        );

        if (!orderItem) {
            return res.status(404).json({
                success: false,
                message: "Product not found in order..."
            });
        }
        if (orderItem.order_status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Order is already canceled."
            });
        }
        if (orderItem.order_status === 'shipped' || orderItem.order_status === 'delivered') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel shipped or delivered products"
            });
        }
        if (order.payment_status === "Failed") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel the order because the payment has failed."
            });
        }

        let refundAmount = orderItem.totalProductPrice;
        if (order.coupon_discount > 0) {
            const totalOrderValue = order.order_items.reduce((sum, item) => sum + item.totalProductPrice, 0);
            const itemProportion = orderItem.totalProductPrice / totalOrderValue;
            const itemCouponDiscount = order.coupon_discount * itemProportion;
            refundAmount -= itemCouponDiscount;
        }



        const product = await Product.findById(orderItem.product);
        if (product) {
            const sizeIndex = product.sizes.findIndex(s => s.size === orderItem.selectedSize);
            if (sizeIndex !== -1) {
                product.sizes[sizeIndex].stock += orderItem.quantity;
                product.totalStock += orderItem.quantity;
                await product.save();
            }
        }

        if (order.payment_status === "Paid") {
            if (order.payment_method === "Wallet" || order.payment_method === "RazorPay") {
                let wallet = await Wallet.findOne({ user: userId });

                if (!wallet) {
                    wallet = new Wallet({
                        user: userId,
                        balance: 0,
                        transactions: []
                    });
                }
                wallet.balance += refundAmount;
                wallet?.transactions.push({
                    order_id: order._id,
                    transaction_date: new Date(),
                    transaction_type: "credit",
                    transaction_status: "completed",
                    amount: refundAmount,
                });

                await wallet.save();
            }
        } 

        orderItem.order_status = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order canceled, stock updated, and wallet refunded successfully."
        });
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message
        });
    }
};

const returnRequest = async (req, res) => {

    try {
        const { productId, orderId } = req.params;
        const { returnReason, returnComments } = req.body;

        const order = await Order.findOne({ _id: orderId })

        if (!order) {
            return res.status(404).json({
                sucess: false,
                message: "Order not found.."
            })
        }

        const product = order.order_items.find(
            (item) => item._id.toString() === productId
        );

        if (!product) {
            return res.status(404).json({
                sucess: false,
                message: "product not found.."
            });
        }

        if (product.return_request.is_requested) {
            return res.status(400).json({
                sucess: false,
                message: "Return request alredy exist.."
            })
        }

        product.return_request = {
            is_requested: true,
            reason: returnReason,
            comment: returnComments,
            is_approved: false,
            is_response_send: false,
        }
        await order.save();

        res.status(200).json({
            success: true,
            message: "Return request submitted successfully.",
            order,
        });


    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message
        });
    }

}

const failedPaymet = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, {
            $set: {
                payment_status: status,
            }
        },
            {
                new: true
            })

        res.status(200).json({
            sucess: true,
            message: "Orer status updated",
            order
        })
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message
        });
    }
}


module.exports = {
    createOrder,
    getCheckoutCartItems,
    getUserOrders,
    getOrderById,
    cancelOrder,
    returnRequest,
    failedPaymet,
    checkStockAvailability
};




