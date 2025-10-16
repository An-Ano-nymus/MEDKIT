const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  username: String,
  phone: String,
  doctor: String,
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  date: String,
  time: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
