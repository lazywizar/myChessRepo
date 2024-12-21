const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('../config/config');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

    // Enhanced password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long'
      });
    }

    if (!/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      return res.status(400).json({
        message: 'Password must contain both letters and numbers'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email or username'
      });
    }

    // Create new user
    const user = new User({
      email,
      username,
      password,
      isVerified: true // Set to true by default for now
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: user.toJSON(),
      message: 'Account created successfully'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Set token expiration based on remember me
    const tokenExpiration = rememberMe ? '30d' : '1d';
    
    res.json({
      token,
      user: user.toJSON(),
      expiresIn: tokenExpiration
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    res.json(req.user.toJSON());
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
