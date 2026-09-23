const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const FarmerProfile = require('../models/FarmerProfile');


const JWT_SECRET = process.env.JWT_SECRET || 'marketlink_jwt_secret';

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, role, contact_number, address, stall_name } = req.body;

    // Validate base fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const validRoles = ['customer', 'farmer', 'admin'];
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

    // Create User
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password_hash,
      role,
      contact_number: contact_number || '',
      address: address || '',
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

    // Check account status
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

module.exports = { register, login, getMe };

