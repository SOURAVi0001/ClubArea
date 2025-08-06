// models/Club.js
const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  photo: String
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);