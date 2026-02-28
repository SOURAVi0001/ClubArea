import mongoose from 'mongoose';

const connectDB = async (): Promise<typeof mongoose | null> => {
  try {
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URL || '';
    if (!mongoURI) {
      throw new Error('MongoDB URI not provided in environment variables.');
    }
    
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('⚠️ MongoDB connection failed:', errorMessage);
    
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Continuing without database in production mode');
      return null;
    } else {
      console.log('💡 Tip: Check your MongoDB connection');
      return null;
    }
  }
};

export default connectDB;
