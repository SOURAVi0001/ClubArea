const mongoose = require('mongoose');
const task_status = new mongoose.Schema(
{                                                         // Icon URL
  title: { type: String, required: true },                // Club title
  posted_by: { type: String, required: true },            // Creator/poster name
  assigned_to: { type: String, required: true },            // Creator/poster name
  description: { type: String, required: true },          // Just the <path> part
  task_status: { type: Number, required: true },          // Just the <path> part
  clubId: { type: String, required: true },      
  task_completion_date: { type: String, required: true },             // public or club only
  task_assign_date: { type: String, required: true },             // public or club only
}
,
{
  timestamps: true                                        // Adds createdAt and updatedAt fields automatically
}
);
module.exports = mongoose.model('task_status', task_status);

