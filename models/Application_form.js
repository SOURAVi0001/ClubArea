// models/Application_form.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  // Changed from fullName to match your code
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  // Changed from email to match your code  
  applicantEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  scholarNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  // Added clubName field from your code
  clubName: {
    type: String,
    required: true,
    trim: true
  },
  // Added teamName field from your code
  teamName: {
    type: String,
    required: true, 
    trim: true
  },
  role: {
    type: String,
    required: true,
    default: 'member' // Added default to match your code
  },
  motivation: {
    type: String,
    required: true,
    trim: true
  },
  resumeFileName: {
    type: String,
    required: true
  },
  resumePath: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'interview_scheduled', 'accepted', 'active'],
    default: 'pending' // Keep as pending, but your code can override to 'active'
  },
  // Made openingId optional since your code doesn't provide it
  openingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opening',
    required: false // Changed to optional
  },
  reviewedBy: {
    type: String // leader email
  },
  reviewedDate: {
    type: Date
  }
}, {
  timestamps: true // This replaces your manual createdDate and updatedDate
});

module.exports = mongoose.model('InterviewApplication', applicationSchema);

