const Order = require('../models/Order');

// 1. POST: Process submission arrays into active data collection mappings
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;

    if (!items || items.length === 0 || !totalPrice) {
      return res.status(400).json({ success: false, message: 'Missing order parameters components.' });
    }

    const newOrder = await Order.create({
      user: req.user.user_id, // Assigned directly from verified token context parameters
      items,
      totalPrice
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      data: newOrder
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Failed to process order creation request.' });
  }
};