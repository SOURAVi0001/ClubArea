const mongoose = require('mongoose');
const updates = new mongoose.Schema(
{                                                         // Icon URL
  title: { type: String, required: true },                // Club title
  posted_by: { type: String, required: true },            // Creator/poster name
  description: { type: String, required: true },          // Just the <path> part
  clubId: { type: String, required: true },               // Club ID (e.g., C001)            // Club ID (e.g., C001)
  type: { type: String, required: true },    
  date: { type: Date, required: true },             // public or club only
}
,
{
  timestamps: true                                        // Adds createdAt and updatedAt fields automatically
}
);
module.exports = mongoose.model('updates', updates);

