const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const config = require('../config/config');

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

exports.signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, username, password } = req.body;

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
      password
    });

    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: config.env === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      token,
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: config.env === 'development' ? error.message : undefined
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    res.json(req.user.toJSON());
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching profile',
      error: config.env === 'development' ? error.message : undefined
    });
  }
};
