const Product = require('../models/Product');

exports.getCatalog = async (req, res) => {
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

    res.render('products', {
      products,
      currentPage: page,
      totalPages,
      filters: {
        search: req.query.search || '',
        category: req.query.category || '',
        minPrice: req.query.minPrice || '',
        maxPrice: req.query.maxPrice || ''
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error Encountered.');
  }
};