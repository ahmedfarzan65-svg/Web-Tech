const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration Routing Pipelines
router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);

// Session Login Pipelines
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Logout Pipeline
router.get('/logout', authController.logout);

module.exports = router;