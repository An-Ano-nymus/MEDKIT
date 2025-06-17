const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: String,
  specialty: String,
  location: String,
  availability: [String], // e.g. ['09:00 AM', '10:00 AM']
  experience: String
});

module.exports = mongoose.model('Doctor', doctorSchema);
