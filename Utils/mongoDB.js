// Utils/mongoDB.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clubarea';
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('⚠️ MongoDB connection failed:', error.message);
    
    // DON'T exit in production - let the app continue
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Continuing without database in production mode');
      return null;
    } else {
      // Only exit in development for debugging
      console.log('💥 Exiting in development mode for debugging');
      throw error; // This will be caught by the calling function
    }
  }
};

module.exports = connectDB;
