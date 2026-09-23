const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const { sendOtpEmail } = require('../config/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'marketlink_jwt_secret';

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, contact_number, address, stall_name } = req.body;

    // Validate base fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    // Part A: Reject public admin registration
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed through public signup' });
    }

    const validRoles = ['customer', 'farmer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Role-specific validation
    if (role === 'farmer' && !stall_name) {
      return res.status(400).json({ message: 'Stall name is required for farmer registration' });
    }

    if (role === 'customer' && !address) {
      return res.status(400).json({ message: 'Address is required for customer registration' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Part C: Farmer default status is pending, Customer is active
    const userStatus = role === 'farmer' ? 'pending' : 'active';

    // Create User
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      role,
      contact_number: contact_number || '',
      address: address || '',
      status: userStatus,
    });

    await user.save();

    let farmerProfile = null;
    // If farmer, create linked FarmerProfile record
    if (role === 'farmer') {
      farmerProfile = new FarmerProfile({
        user_id: user._id,
        stall_name: stall_name.trim(),
        markets: [],
        operating_days: [],
        pickup_windows: '',
      });
      await farmerProfile.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      contact_number: user.contact_number,
      address: user.address,
      status: user.status,
      created_at: user.created_at,
      ...(farmerProfile ? { stall_name: farmerProfile.stall_name } : {}),
    };

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check account status - block suspended accounts
    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account is suspended. Please contact support/admin.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Fetch FarmerProfile if farmer
    let stall_name;
    if (user.role === 'farmer') {
      const profile = await FarmerProfile.findOne({ user_id: user._id });
      if (profile) {
        stall_name = profile.stall_name;
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      contact_number: user.contact_number,
      address: user.address,
      status: user.status,
      created_at: user.created_at,
      ...(stall_name ? { stall_name } : {}),
    };

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account is suspended.' });
    }

    let farmerProfile = null;
    if (user.role === 'farmer') {
      farmerProfile = await FarmerProfile.findOne({ user_id: user._id }).populate('markets');
    }

    return res.status(200).json({
      user: {
        ...user.toObject(),
        ...(farmerProfile ? { farmerProfile } : {}),
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ message: 'Server error retrieving user', error: error.message });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ message: 'Account is suspended. Please contact support.' });
    }

    // Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp_code = otp;
    user.otp_expires_at = expiry;
    user.otp_last_sent_at = new Date();
    await user.save();

    // Send OTP via email (or dev console fallback)
    await sendOtpEmail(user.email, otp);

    return res.status(200).json({
      message: 'Password reset OTP has been sent to your email',
    });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    return res.status(500).json({ message: 'Server error processing forgot password request', error: error.message });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, new_password } = req.body;

    if (!email || !otp || !new_password) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address' });
    }

    // Verify OTP exists and matches
    if (!user.otp_code || user.otp_code !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // Verify OTP expiry
    if (!user.otp_expires_at || new Date() > user.otp_expires_at) {
      return res.status(400).json({ message: 'OTP code has expired. Please request a new one.' });
    }

    // Hash new password and update
    const saltRounds = 10;
    user.password_hash = await bcrypt.hash(new_password, saltRounds);
    user.otp_code = undefined;
    user.otp_expires_at = undefined;
    await user.save();

    return res.status(200).json({
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('ResetPassword error:', error);
    return res.status(500).json({ message: 'Server error processing password reset', error: error.message });
  }
};

module.exports = { register, login, getMe, forgotPassword, resetPassword };


