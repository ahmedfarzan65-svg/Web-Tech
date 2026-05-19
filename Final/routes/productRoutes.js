const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const salesController = require('../controllers/salesController');
const { isAdmin } = require('../middleware/auth'); // Import your session guard layer

router.get('/products', productController.getCatalog);

// Secure assignment path for Managers/Admins
router.get('/sales', isAdmin, salesController.getSalesDashboard);

router.get('/', (req, res) => res.redirect('/products'));

module.exports = router;