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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { user_id, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

/**
 * requireRole(role) — must be used after verifyToken.
 * Example: router.get('/profile', verifyToken, requireRole('farmer'), ...)
 */
const requireRole = (role) => (req, res, next) => {
  if (req.user?.role !== role) {
    return res.status(403).json({ message: `Access restricted to ${role} role` });
  }
  next();
};

module.exports = { verifyToken, requireRole };
