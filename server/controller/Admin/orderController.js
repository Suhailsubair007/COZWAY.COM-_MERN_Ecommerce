const Order = require('../../model/order');
const Product = require('../../model/Product')
const Wallet = require('../../model/Wallet')


// GET --Get all orders for display in the table in admin side....
const getAllOrders = async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const skip = (page - 1) * limit;
        const totalOrders = await Order.countDocuments({});
        const totalPages = Math.ceil(totalOrders / limit);
        const orders = await Order.find({})
            .populate('userId')
            .sort({
                placed_at
                    : -1
            })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ orders, totalPages });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: error.message });
    }
}

//PATCH -- update the order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus, itemId } = req.body;

        const order = await Order.findById({ _id: orderId });
        if (!orderId) {
            res.status(404).json({ error: "order id not fount..." })
        }

        const product = order.order_items.find(
            (item) => item._id.toString() === itemId
        )

        if (product.order_status === 'Cancelled') {
            return res.status(400).json({ error: 'Cannot modify a cancelled order' });
        }
        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid order status' });
        }
        product.order_status = newStatus;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: error.message });
    }
}

//GET--- get he purticular order by ID
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
            message: "Order fetched...",
            order
        });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

//POST - Return request responce contoller..
const responseToReturnRequest = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { itemId, isApproved } = req.body;

        console.log("Item id=========>", itemId)
        console.log("IS approved=====>>>>>>", isApproved)

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const orderItem = order.order_items.find(
            item => item._id.toString() === itemId
        );


        if (!orderItem) {
            return res.status(404).json({
                success: false,
                message: 'Order item not found'
            });
        }

        if (!orderItem.return_request.is_requested) {
            return res.status(400).json({
                success: false,
                message: 'No return request for this item'
            });
        }

        orderItem.return_request.is_approved = isApproved;
        orderItem.return_request.is_response_send = true;

        if (isApproved) {
            orderItem.order_status = 'returned';
        } else {
            orderItem.order_status = 'delivered';
        }

        await order.save();

        let refundAmount = orderItem.totalProductPrice;
        if (order.coupon_discount > 0) {
            const totalOrderValue = order.order_items.reduce((sum, item) => sum + item.totalProductPrice, 0);
            const itemProportion = orderItem.totalProductPrice / totalOrderValue;
            const itemCouponDiscount = order.coupon_discount * itemProportion;
            refundAmount -= itemCouponDiscount;
        }


        await order.save();


        if (isApproved) {
            const product = await Product.findById(orderItem.product);
            if (product) {
                const sizeIndex = product.sizes.findIndex(s => s.size === orderItem.selectedSize);
                if (sizeIndex !== -1) {
                    product.sizes[sizeIndex].stock += orderItem.quantity;
                    product.totalStock += orderItem.quantity;
                    await product.save();
                }
            }
        }



        if (isApproved) {
            if (order.payment_method === "Wallet" || order.payment_method === "RazorPay") {
                let wallet = await Wallet.findOne({ user: order.userId });

                if (!wallet) {
                    wallet = new Wallet({
                        user: order.userId,
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


        res.status(200).json({
            success: true,
            message: `Return request ${isApproved ? 'approved' : 'rejected'}`,
            order: order
        });

    } catch (error) {
        console.error("Error processing return request:", error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};



module.exports = {
    getAllOrders,
    updateOrderStatus,
    getOrderById,
    responseToReturnRequest
};