// controllers/salesController.js
const Order = require('../models/Order');

// Reusable data engine to calculate required sales metrics
const fetchSalesMetrics = async () => {
  const totalOrders = await Order.countDocuments();

  // Calculate total revenue using Mongoose aggregation pipelines
  const revenueData = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ]);
  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  // Retrieve the 5 most recent transactions with populated user and product context details
  const recentTransactions = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name email')
    .populate('items.product', 'name price');

  return {
    totalRevenue,
    totalOrders,
    recentTransactions
  };
};

// 1. GET: Render initial server-side compilation of the dashboard view
exports.getSalesDashboard = async (req, res) => {
  try {
    const data = await fetchSalesMetrics();
    res.render('sales', { 
      totalRevenue: data.totalRevenue,
      totalOrders: data.totalOrders,
      recentTransactions: data.recentTransactions
    });
  } catch (err) {
    console.error('Error compiling sales dashboard view:', err);
    res.status(500).send('Internal Server Error loading dashboard.');
  }
};

// 2. GET: Live update REST API response endpoint (Strictly JSON)
exports.getSalesDataAPI = async (req, res) => {
  try {
    const data = await fetchSalesMetrics();
    return res.status(200).json({
      success: true,
      totalRevenue: data.totalRevenue,
      totalOrders: data.totalOrders,
      recentTransactions: data.recentTransactions // Extra credit styling info for client updates!
    });
  } catch (err) {
    console.error('API Error updating sales data metrics:', err);
    return res.status(500).json({ success: false, message: 'Failed to extract live updates.' });
  }
};