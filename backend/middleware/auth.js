const jwt  = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT authentication middleware.
 * Extracts token from Authorization header, verifies it,
 * and attaches the user document to req.user.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Extract from "Bearer <token>"
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized — no token' });
    }

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user (without password)
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized — user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Not authorized — invalid token' });
  }
};

module.exports = { protect };
