const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Render Register Page
exports.getRegister = (req, res) => {
  res.render('register');
};

// Handle User Registration Action
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Basic field-level validations
    if (!name || !email || !password) {
      req.flash('error_msg', 'All registration inputs are required.');
      return res.redirect('/register');
    }
    if (password.length < 6) {
      req.flash('error_msg', 'Password must be at least 6 characters long.');
      return res.redirect('/register');
    }

    // 2. Check for unique email profile
    const userExists = await User.findOne({ email });
    if (userExists) {
      req.flash('error_msg', 'An account with that email already exists.');
      return res.redirect('/register');
    }

    // TESTING TIP: If email starts with 'admin@', make them an admin automatically
    let userRole = 'customer';
    if (email.toLowerCase().startsWith('admin@')) {
      userRole = 'admin';
    }

    // 3. Create user (password is automatically hashed by the pre-save hook in User model)
    await User.create({
      name,
      email,
      password,
      role: userRole
    });

    req.flash('success_msg', 'Registration successful! You can now log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Server error encountered during account creation.');
    res.redirect('/register');
  }
};

// Render Login Page
exports.getLogin = (req, res) => {
  res.render('login');
};

// Handle Session Login Authentication
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      req.flash('error_msg', 'Please fill in all verification fields.');
      return res.redirect('/login');
    }

    // Find User matching email registry
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error_msg', 'Invalid email or password combination.');
      return res.redirect('/login');
    }

    // Match hashed password variations using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error_msg', 'Invalid email or password combination.');
      return res.redirect('/login');
    }

    // Establish User state details onto session store
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    req.flash('success_msg', `Welcome back, ${user.name}!`);
    
    // Conditional Redirect based on role specifications
    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/products');
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'An anomaly occurred during credential parsing.');
    res.redirect('/login');
  }
};

// Handle Session Logouts
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('Session destruction failure:', err);
    res.clearCookie('connect.sid'); // Wipe cookie tracking key
    res.redirect('/login');
  });
};