const Order = require('../models/Order');
const Painting = require('../models/Painting');
const User = require('../models/User');

// @desc    Get admin dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
    try {
        // 1. Total Sales (Sum of totalPrice for paid orders)
        const orders = await Order.find({ isPaid: true });
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);

        // 2. Total Orders (Count of all orders)
        const totalOrders = await Order.countDocuments();

        // 3. Total Products
        const totalProducts = await Painting.countDocuments();

        // 4. Monthly Sales (Aggregation)
        const monthlySales = await Order.aggregate([
            { $match: { isPaid: true } },
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    sales: { $sum: '$totalPrice' }
                }
            },
            { $sort: { _id: 1 } } // Sort by month (Jan=1, Feb=2)
        ]);

        // 5. Order Status Breakdown
        const orderStatusCounts = await Order.aggregate([
            {
                $group: {
                    _id: { $ifNull: ['$orderStatus', 'Processing'] },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 6. Recent Orders
        const recentOrders = await Order.find({})
            .populate('user', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // 7. New Users (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsersCount = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

        // 8. Top Selling Products
        const topProducts = await Order.aggregate([
            { $match: { isPaid: true } },
            { $unwind: '$orderItems' },
            {
                $group: {
                    _id: '$orderItems.painting',
                    totalSold: { $sum: '$orderItems.qty' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'paintings', // collection name
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' }
        ]);


        res.json({ totalSales, totalOrders, totalProducts, monthlySales, orderStatusCounts, recentOrders, newUsersCount, topProducts });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getAnalytics };