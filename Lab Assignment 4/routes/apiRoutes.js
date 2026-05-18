const express = require('express');
const router = express.Router();

const apiAuthController = require('../controllers/apiAuthController');
const apiProductController = require('../controllers/apiProductController');
const apiOrderController = require('../controllers/apiOrderController');

const { verifyToken } = require('../middleware/apiAuth');

// --- Public Authentication Pipelines ---
router.post('/auth/login', apiAuthController.login);

// --- Public Product Extraction Pipelines ---
router.get('/products', apiProductController.getAllProducts);
router.get('/products/:id', apiProductController.getProductById);

// --- Secure Token Validation Guard Endpoints ---
router.post('/orders', verifyToken, apiOrderController.createOrder);
router.get('/user/profile', verifyToken, apiAuthController.getProfile);

module.exports = router;