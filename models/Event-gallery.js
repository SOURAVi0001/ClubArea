const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  date:       { type: Date,   required: true },
  time:       { type: String, required: true }, // “HH:MM”
  venue:      { type: String },
  description:{ type: String },
  photos:     [String],                         // Array of S3 / Cloudinary URLs
 clubId:     { type: String, required: true },  // ✅ Changed to String
  clubName:   { type: String, required: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event-gallery', EventSchema);
