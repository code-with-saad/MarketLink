const jwt = require('jsonwebtoken');

/**
 * verifyToken — attaches req.user = { user_id, role } from JWT.
 * All protected routes must use this middleware.
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'marketlink_jwt_secret');
    req.user = decoded; // { user_id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * requireRole(...roles) — must be used after verifyToken.
 * Accepts one or multiple allowed roles.
 * Example: router.get('/profile', verifyToken, requireRole('farmer'), ...)
 * Example: router.get('/manage', verifyToken, requireRole('farmer', 'admin'), ...)
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Access forbidden: requires ${roles.join(' or ')} role` 
    });
  }
  next();
};

/**
 * requireActiveUser — ensures user account is not pending or suspended.
 * Blocks product listings, market interactions if pending/suspended.
 */
const User = require('../models/User');

const requireActiveUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.user.user_id).select('status role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account is suspended. Please contact support/admin.' });
    }

    next();
  } catch (error) {
    console.error('requireActiveUser error:', error);
    return res.status(500).json({ message: 'Server error during authorization check' });
  }
};

module.exports = { verifyToken, requireRole, requireActiveUser };


