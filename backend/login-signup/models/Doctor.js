const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  location: { type: String, required:true },
  availability: [String], // time slots like ['09:00 AM', '10:00 AM']
  experience: { type: String,required:true},

  // 🔐 Auth fields
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  licenseNumber: { type: String, required: true },
  licenseImage: { type: String,required:true },
  degreeImage: {type: String,required:true}, // path to uploaded image
  password: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
