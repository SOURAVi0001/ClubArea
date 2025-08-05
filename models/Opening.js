const mongoose = require('mongoose');

const openingSchema = new mongoose.Schema({
  clubId: {
    type: String,
    required: true
  },
  clubName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  teamName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  maxApplicants: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  createdBy: {
    type: String,
    required: true // leader email
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  closedDate: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Opening', openingSchema);
