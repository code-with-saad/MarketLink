// authController.js — Dev 1 owns this file
// Logic to be implemented in Phase 1

const register = async (req, res) => {
  // TODO: validate role-specific fields, hash password, create User (+ FarmerProfile if role=farmer)
  res.status(501).json({ message: 'Not implemented yet' });
};

const login = async (req, res) => {
  // TODO: find user, verify password, return JWT with { user_id, role }
  res.status(501).json({ message: 'Not implemented yet' });
};

const getMe = async (req, res) => {
  // TODO: return req.user's profile from DB
  res.status(501).json({ message: 'Not implemented yet' });
};

module.exports = { register, login, getMe };
