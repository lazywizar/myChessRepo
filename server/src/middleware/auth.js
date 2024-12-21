const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      console.log('No Authorization header');
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      console.log('Empty token');
      return res.status(401).json({ message: 'Invalid authorization token' });
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await User.findById(decoded.userId);

      if (!user) {
        console.log('User not found:', decoded.userId);
        return res.status(401).json({ message: 'User not found' });
      }

      req.token = token;
      req.user = user;
      next();
    } catch (jwtError) {
      console.log('JWT verification error:', jwtError.message);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication error' });
  }
};

module.exports = { auth };
