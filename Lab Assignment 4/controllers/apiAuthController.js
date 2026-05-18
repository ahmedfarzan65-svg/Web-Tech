const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. POST: Generate JWT upon successful credentials validation
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials combo.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials combo.' });
    }

    // Sign the JSON Web Token using payload variables
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Authentication successful.',
      token: `Bearer ${token}`
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server processing error.' });
  }
};

// 2. GET: Retrieve detailed profile matching internal token variables
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User profile match not found.' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server processing anomaly.' });
  }
};