const mongoose = require('mongoose');
const feedback = new mongoose.Schema(
{                                                         
  title: { type: String, required: true },               
  posted_by: { type: String, required: true },            // Creator/poster name
  description: { type: String, required: true },         
  clubId: { type: String, required: true },               // Club ID (e.g., C001)            // Club ID (e.g., C001)
  user_type: { type: String, required: true },    
  email: { type: String, required: true },    
  date: { type: Date, required: true },             // public or club only
}
);
module.exports = mongoose.model('feedback', feedback);

