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

module.exports = { verifyToken, requireRole };

