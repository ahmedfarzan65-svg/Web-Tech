// Middleware to ensure a user is logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource.');
  res.redirect('/login');
};

// Middleware to restrict access to Admins only
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  req.flash('error_msg', 'Access Denied: Administrative privileges required.');
  res.redirect('/products');
};