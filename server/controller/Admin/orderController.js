const Order = require('../../model/order');

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
        console.log("Orders:", orders);
        res.status(200).json({ orders, totalPages });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: error.message });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;
        // console.log(orderId, newStatus);
        // console.log("testingggggg......");

        const order = await Order.findById(orderId);
        if (!orderId) {
            res.status(404).json({ error: "order id not fount..." })
        }

        if (order.order_status === 'Cancelled') {
            return res.status(400).json({ error: 'Cannot modify a cancelled order' });
        }
        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({ error: 'Invalid order status' });
        }
        order.order_status = newStatus;
        await order.save();

        res.status(200).json({ message: 'Order status updated successfully', order });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: error.message });
    }
}

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


module.exports = { getAllOrders, updateOrderStatus, getOrderById };