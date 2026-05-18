const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Mapping Dashboard Routes
router.get('/', adminController.getDashboard);

// Mapping Create Form Processes
router.get('/add', adminController.getAddForm);
router.post('/add', adminController.upload.single('image'), adminController.createProduct);

// Mapping Edit Form Processes
router.get('/edit/:id', adminController.getEditForm);
router.post('/edit/:id', adminController.upload.single('image'), adminController.updateProduct);

// Mapping Delete Path
router.get('/delete/:id', adminController.deleteProduct);

module.exports = router;