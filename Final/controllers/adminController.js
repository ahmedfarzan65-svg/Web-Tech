const Product = require('../models/Product');
const Order = require('../models/Order');
const multer = require('multer');
const path = require('path');

// Configure Multer Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/'); // Save files here
  },
  filename: (req, file, cb) => {
    // Generates a unique name: timestamp + original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize Upload Middleware Agent
exports.upload = multer({ storage: storage });

// 1. READ: Admin Dashboard Overview
exports.getDashboard = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('admin/dashboard', { products });
  } catch (err) {
    console.error(err);
    res.status(500).send('Admin Dashboard Error');
  }
};

// 2. CREATE: Render Form View
exports.getAddForm = (req, res) => {
  res.render('admin/add-product');
};

// 3. CREATE: Handle Database Insertion
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;
    
    // Backend Validation to ensure fields aren't blank
    if (!name || !price || !category || !rating || !stock || !req.file) {
      return res.status(400).send('All form entry inputs along with a product image asset are mandatory.');
    }

    const imagePath = '/uploads/' + req.file.filename;

    await Product.create({
      name,
      price: Number(price),
      category,
      rating: Number(rating),
      stock: Number(stock),
      image: imagePath
    });

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating database record.');
  }
};

// 4. UPDATE: Render Pre-populated Form View
exports.getEditForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product item was not found.');
    res.render('admin/edit-product', { product });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading edit panel interface.');
  }
};

// 5. UPDATE: Save Changes to Database
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, category, rating, stock } = req.body;
    let updateFields = { name, price: Number(price), category, rating: Number(rating), stock: Number(stock) };

    // Update image path only if a new file is uploaded
    if (req.file) {
      updateFields.image = '/uploads/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateFields);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating product registry properties.');
  }
};

// 6. DELETE: Drop Item Record out of the database
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error removing inventory unit from system database layers.');
  }
};

// Append this at the end of controllers/adminController.js

// 6. READ: Render the Live Sales Dashboard view
// 6. READ: Calculate and Render Live Sales Dashboard view
exports.getSalesPage = async (req, res) => {
  try {
    // 1. Calculate Total Revenue using a MongoDB Aggregation pipeline summing 'totalPrice'
    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);
    
    // If there are no orders yet, default to 0 revenue
    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].total : 0;

    // 2. Count the total number of orders placed in the system
    const totalOrders = await Order.countDocuments();

    // 3. Retrieve the 10 most recent orders and populate customer user profile names
    const recentTransactions = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Render the view file (sitting directly at views/sales.ejs based on your stack trace)
    // We pass both 'totalOrders' and 'orderCount' just in case line 24+ references either variable name
    res.render('sales', {
      totalRevenue,
      totalOrders,
      orderCount: totalOrders, 
      recentTransactions
    });

  } catch (err) {
    console.error("Critical dashboard error aggregating metric statistics:", err);
    res.status(500).send('Error compiling or loading the sales analytics interface.');
  }
};