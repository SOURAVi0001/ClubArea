const mongoose = require('mongoose');

const appliedJobSchema = new mongoose.Schema({
  applicantEmail: {
    type: String,
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobOpening',
    required: true
  },
  clubName: {
    type: String,
    required: true   // set to false if optional
  },
  teamName: {
    type: String,
    required: true   // set to false if optional
  }
}, { timestamps: true });

module.exports = mongoose.model('AppliedJob', appliedJobSchema);