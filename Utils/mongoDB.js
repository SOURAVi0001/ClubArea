const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clubarea';
    
    // Remove deprecated options
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('⚠️ MongoDB connection failed:', error.message);
    
    // In production, don't crash the app - just log and continue
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Continuing without database in production mode');
      return null;
    } else {
      // In development, you can choose to crash or continue
      console.log('💡 Tip: Set up MongoDB locally or use cloud database');
      return null; // Don't crash, just return null
    }
  }
};

module.exports = connectDB;
