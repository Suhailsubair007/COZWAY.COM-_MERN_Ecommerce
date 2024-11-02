const Order = require('../../model/order');

const getAllOrders = async (req, res) => {
    try {
        console.log("Reached");
        const orders = await Order.find({}).populate('userId');
        console.log("Orders:", orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: error.message });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { newStatus } = req.body;
        console.log(orderId, newStatus);
        console.log("testingggggg......");

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

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        await Order.findByIdAndDelete(orderId);
        res.status(200).json({ sucess: true, message: "Order deleted..." })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "internal server error" })
    }
}

module.exports = { getAllOrders, updateOrderStatus, deleteOrder };