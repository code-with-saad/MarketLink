const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');
const { sendOtpEmail } = require('../config/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'marketlink_jwt_secret';
const OTP_TTL_MINUTES = 10;
const OTP_MAX_RESENDS = 3;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { name, email, password, role, contact_number, address, stall_name, consent } = req.body;

    if (consent !== true) {
      return res.status(400).json({ success: false, message: 'You must agree to the Privacy Policy and Terms of Service to register.' });
    }

    if (role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admin registration is not allowed through public signup.' });
    }

    const validRoles = ['customer', 'farmer'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    if (role === 'farmer' && !stall_name) {
      return res.status(400).json({ success: false, message: 'Stall name is required for farmer registration.' });
    }

    if (role === 'customer' && !address) {
      return res.status(400).json({ success: false, message: 'Address is required for customer registration.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    const userStatus = role === 'farmer' ? 'pending' : 'active';

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

    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
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
      success: true,
      message: 'Registration successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    let stall_name;
    if (user.role === 'farmer') {
      const profile = await FarmerProfile.findOne({ user_id: user._id });
      if (profile) stall_name = profile.stall_name;
    }

    const token = jwt.sign(
      { user_id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
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
      success: true,
      message: 'Login successful',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.user_id).select('-password_hash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account is suspended.' });
    }

    let farmerProfile = null;
    if (user.role === 'farmer') {
      farmerProfile = await FarmerProfile.findOne({ user_id: user._id }).populate('markets');
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        ...(farmerProfile ? { farmerProfile } : {}),
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving user.' });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    // Always respond generically to avoid email enumeration
    const genericMsg = `If an account exists for ${normalizedEmail}, you will receive a reset code shortly.`;

    if (!user || user.status === 'suspended') {
      return res.status(200).json({ success: true, message: genericMsg });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    user.otp_code = otp;
    user.otp_expires_at = expiry;
    user.otp_last_sent_at = new Date();
    user.otp_resend_count = 0;
    await user.save();

    await sendOtpEmail(user.email, otp);

    return res.status(200).json({ success: true, message: genericMsg });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing request.' });
  }
};

// POST /api/auth/resend-otp
const resendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user || user.status === 'suspended') {
      return res.status(400).json({ success: false, message: 'No active reset session found for this email.' });
    }

    if (!user.otp_code) {
      return res.status(400).json({ success: false, message: 'No active password reset session. Please start again from step 1.' });
    }

    if (user.otp_resend_count >= OTP_MAX_RESENDS) {
      // Clear session -- force back to step 1
      user.otp_code = undefined;
      user.otp_expires_at = undefined;
      user.otp_last_sent_at = undefined;
      user.otp_resend_count = 0;
      await user.save();
      return res.status(429).json({
        success: false,
        message: 'Maximum resend limit reached. Please start the password reset process again.',
        forceRestart: true,
      });
    }

    const now = new Date();
    if (user.otp_last_sent_at && now - user.otp_last_sent_at < OTP_RESEND_COOLDOWN_MS) {
      const remainingMs = OTP_RESEND_COOLDOWN_MS - (now - user.otp_last_sent_at);
      const remainingSecs = Math.ceil(remainingMs / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${remainingSecs} second(s) before requesting another code.`,
        cooldownRemaining: remainingSecs,
      });
    }

    const otp = generateOtp();
    const expiry = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    user.otp_code = otp;
    user.otp_expires_at = expiry;
    user.otp_last_sent_at = now;
    user.otp_resend_count = (user.otp_resend_count || 0) + 1;
    await user.save();

    await sendOtpEmail(user.email, otp);

    const resendsLeft = OTP_MAX_RESENDS - user.otp_resend_count;
    return res.status(200).json({
      success: true,
      message: 'A new verification code has been sent.',
      resendsRemaining: resendsLeft,
    });
  } catch (error) {
    console.error('ResendOtp error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing resend request.' });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  try {
    const { email, otp, new_password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid request. Please start the reset process again.' });
    }

    if (!user.otp_code) {
      return res.status(400).json({ success: false, message: 'No active reset session found. Please request a new code.' });
    }

    if (!user.otp_expires_at || new Date() > user.otp_expires_at) {
      return res.status(400).json({ success: false, message: 'Code has expired. Please resend or start the reset process again.' });
    }

    if (user.otp_code !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    const saltRounds = 10;
    user.password_hash = await bcrypt.hash(new_password, saltRounds);
    user.otp_code = undefined;
    user.otp_expires_at = undefined;
    user.otp_last_sent_at = undefined;
    user.otp_resend_count = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now sign in with your new password.',
    });
  } catch (error) {
    console.error('ResetPassword error:', error);
    return res.status(500).json({ success: false, message: 'Server error processing password reset.' });
  }
};

module.exports = { register, login, getMe, forgotPassword, resendOtp, resetPassword };
