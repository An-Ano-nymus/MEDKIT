const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');

// ✅ SIGNUP
exports.signupDoctor = async (req, res) => {
  try {
    const { name, phone, email, specialty, licenseNumber, password, availability,experience,location } = req.body;
    const parsedSlots = Array.isArray(availability)
  ? availability
  : availability.split(',').map(s => s.trim()) || [];

    if (!req.files || !req.files.degreeFile || !req.files.licenseFile) {
      return res.status(400).json({ error: 'Degree and license photo are required' });
    }

    const degreeImage = req.files.degreeFile[0].path;
    const licenseImage = req.files.licenseFile[0].path;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prevent duplicate license numbers in DB
    const existing = await Doctor.findOne({ licenseNumber });
    if (existing) {
      return res.status(400).json({ error: 'Doctor with this license number already registered' });
    }

    const doctor = new Doctor({
      name,
      phone,
      email,
      specialty,
      licenseNumber,
      password: hashedPassword,
      degreeImage,
      licenseImage,
availability:parsedSlots,
      experience,
      location
    });

    await doctor.save();

    res.json({ success: true, message: 'Doctor registered successfully' });
  } catch (err) {
    // Catch duplicate file errors
    if (err.message.includes('already exists')) {
      return res.status(400).json({ error: err.message });
    }

    console.error('❌ Signup error:', err.message);
    res.status(500).json({ error: 'Signup failed' });
  }
};


// ✅ LOGIN
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ error: 'Doctor not found' });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    res.json({
      success: true,
      message: 'Login successful',
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialty: doctor.specialty
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
};
