const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['leader', 'member'], required: true },
  clubId: { type: String, required: true },
  clubName: { type: String, required: true },
  teamName: {
    type: String,
    required: function () {
      return this.role === 'member';
    }
  }
} );

module.exports = mongoose.model('admindb', AdminSchema);

