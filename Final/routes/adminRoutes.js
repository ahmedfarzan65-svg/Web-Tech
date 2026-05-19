const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/auth'); // Import RBAC Guard

// SECURE THE GATEWAY: This ensures every route defined inside this file requires an Admin session role!
router.use(isAdmin);

router.use(isAdmin);

// Mapping Dashboard Routes
router.get('/', adminController.getDashboard);

// 🆕 ADD THIS LINE RIGHT HERE:
router.get('/sales', adminController.getSalesPage);

// Mapping Create Form Processes
router.get('/add', adminController.getAddForm);

// Mapping Create Form Processes
router.get('/add', adminController.getAddForm);
router.post('/add', adminController.upload.single('image'), adminController.createProduct);

// Mapping Edit Form Processes
router.get('/edit/:id', adminController.getEditForm);
router.post('/edit/:id', adminController.upload.single('image'), adminController.updateProduct);

// Mapping Delete Path
router.get('/delete/:id', adminController.deleteProduct);



module.exports = router;