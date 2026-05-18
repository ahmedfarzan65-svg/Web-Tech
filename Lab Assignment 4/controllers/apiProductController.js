const Product = require('../models/Product');

// 1. GET: Fetch list of all items including existing catalog query parsers
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(query).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit
      },
      data: products
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Error collecting data catalog items.' });
  }
};

// 2. GET: Identify item matching isolated dynamic parameters
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Item registry target not found.' });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Database query extraction error.' });
  }
};