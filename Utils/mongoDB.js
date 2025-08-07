const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGODB_URI for production, MONGO_URL for local development
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL;
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('⚠️ MongoDB connection failed:', error.message);
    
    // Don't crash in production
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Continuing without database in production mode');
      return null;
    } else {
      console.log('💡 Tip: Check your MongoDB connection');
      return null;
    }
  }
};

module.exports = connectDB;
