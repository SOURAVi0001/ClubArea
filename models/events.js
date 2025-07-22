const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({

  title: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  clubId: { type: String, required: true },
  time: { type: String, required: true },

});

module.exports = mongoose.model('event', eventSchema);