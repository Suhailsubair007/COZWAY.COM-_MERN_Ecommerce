const User = require("../../model/User");
const Order = require('../../model/order')



//GET ---Get the data of the users in the admin side....
const getCoutomers = async (req, res) => {
    try {
        const users = await User.find({});
        if (users) {
            res.status(200).json({
                users

            });
        }
    } catch (error) {
        console.error("error", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

//PATCH---to change the active ststus of the user by the admin....
const updateCoustomerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_blocked } = req.body;

        const updateStats = await User.findByIdAndUpdate(id, { is_blocked }, { new: true })
        if (!updateStats) {
            return res.status(404).json({ message: 'Product not found..' });
        }

        res.status(200).json(updateStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating category status' });
    }

}

const getOrderStatistics = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();

        const totalPendingOrders = await Order.aggregate([
            { $unwind: "$order_items" },
            { $match: { "order_items.order_status": "pending" } },
            { $count: "count" },
        ]);

        const totalOrderRevenue = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$total_price_with_discount" } } },
        ]);

        // Monthly sales and customer data
        const monthlySalesData = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$placed_at" } },
                    sales: { $sum: "$total_price_with_discount" },
                    customers: { $addToSet: "$userId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: "$_id",
                    sales: 1,
                    customers: { $size: "$customers" }
                }
            },
            { $sort: { month: 1 } }
        ]);

        // Yearly sales data
        const yearlySalesData = await Order.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y", date: "$placed_at" } },
                    sales: { $sum: "$total_price_with_discount" },
                    customers: { $addToSet: "$userId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    sales: 1,
                    customers: { $size: "$customers" }
                }
            },
            { $sort: { year: 1 } }
        ]);

        res.status(200).json({
            totalOrders,
            totalUsers,
            totalPendingOrders: totalPendingOrders[0]?.count || 0,
            totalOrderRevenue: totalOrderRevenue[0]?.totalRevenue || 0,
            monthlySalesData,
            yearlySalesData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch order statistics" });
    }
};



module.exports = {
    getCoutomers,
    updateCoustomerStatus,
    getOrderStatistics
};
