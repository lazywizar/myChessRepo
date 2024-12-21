require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/config');

const PORT = config.port;
const MONGODB_URI = config.mongodb.uri;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
