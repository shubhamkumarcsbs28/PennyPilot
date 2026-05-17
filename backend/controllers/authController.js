const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// Build user response (strips password)
const userResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  currency: user.currency,
  balance: user.balance,
  joinedAt: user.createdAt,
  token,
});

/**
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json(userResponse(user, token));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user._id);
    res.json(userResponse(user, token));
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(userResponse(user, null));
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/me
 */
exports.updateMe = async (req, res, next) => {
  try {
    const { name, avatar, currency, balance } = req.body;
    const updates = {};
    if (name !== undefined)     updates.name     = name;
    if (avatar !== undefined)   updates.avatar   = avatar;
    if (currency !== undefined) updates.currency = currency;
    if (balance !== undefined)  updates.balance  = balance;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true, runValidators: true,
    });

    res.json(userResponse(user, null));
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist' });
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB with 10-minute expiry
    user.resetPasswordToken = code;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Print to server console for development testing
    console.log(`🔑 PASSWORD RESET CODE for ${email}: ${code}`);

    res.json({
      message: 'Password reset code generated successfully',
      devCode: code, // For easy development testing
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: 'Email, code, and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({
      email,
      resetPasswordToken: code,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset code' });
    }

    // Set new password (will be hashed automatically by userSchema's pre('save') hook)
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save();

    res.json({ message: 'Password reset successful! You can now log in with your new password.' });
  } catch (err) {
    next(err);
  }
};
