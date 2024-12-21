require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3005,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/chess-manager'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-here',
    expiresIn: '24h'
  },
  env: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000'
};
