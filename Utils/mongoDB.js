// Utils/mongoConnect.js
const mongoose = require('mongoose');

const mongoDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ClubEaria', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB (ClubEaria DB)');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = mongoDB;