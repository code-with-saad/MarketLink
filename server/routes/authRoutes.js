const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body } = require('express-validator');
const {
  register,
  login,
  getMe,
  forgotPassword,
  resendOtp,
  resetPassword,
} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts. Please try again in 15 minutes.' },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many registration attempts. Please try again later.' },
});

const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many password reset requests. Please try again in 15 minutes.' },
});

const resendOtpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 6,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many resend requests. Please try again in 15 minutes.' },
});

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Full name is required.').isLength({ min: 2 }).withMessage('Name must be at least 2 characters.'),
  body('email').trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('role').isIn(['customer', 'farmer']).withMessage('Role must be customer or farmer.'),
  body('consent').equals('true').withMessage('You must accept the Privacy Policy and Terms of Service.'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

const forgotPasswordValidation = [
  body('email').trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
];

const resendOtpValidation = [
  body('email').trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
];

const resetPasswordValidation = [
  body('email').trim().isEmail().withMessage('A valid email address is required.').normalizeEmail(),
  body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit code.'),
  body('new_password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

// POST /api/auth/register
router.post('/register', registerLimiter, registerValidation, register);

// POST /api/auth/login
router.post('/login', loginLimiter, loginValidation, login);

// GET /api/auth/me
router.get('/me', verifyToken, getMe);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordLimiter, forgotPasswordValidation, forgotPassword);

// POST /api/auth/resend-otp
router.post('/resend-otp', resendOtpLimiter, resendOtpValidation, resendOtp);

// POST /api/auth/reset-password
router.post('/reset-password', forgotPasswordLimiter, resetPasswordValidation, resetPassword);

module.exports = router;
