const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  // Verify token structural validity
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access Denied: No token provided in authorization header.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Decrypt and process token payload matching environmental key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Appends token payload details containing user_id and role to req
    next();
  } catch (err) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access Denied: Security signature verification failed or token expired.' 
    });
  }
};