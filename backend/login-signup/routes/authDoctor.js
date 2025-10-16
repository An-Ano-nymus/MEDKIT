const express = require('express');
const multer = require('multer');
const path = require('path');
const { signupDoctor, loginDoctor, meDoctor, logoutDoctor } = require('../controllers/docAuthController');
const { doctorUpload } = require('../middlewares/upload');
const doctorAuth = require('../middlewares/doctorAuth');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/doctors/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage
});

// Route: /api/doctor/signup
// router.post(
//   '/signup',
//   upload.fields([
//     { name: 'degree', maxCount: 1 },
//     { name: 'licensePhoto', maxCount: 1 }
//   ]),
//   signupDoctor
// );

// Route: /api/doctor/login
// Open doctor auth routes
router.post('/signup', doctorUpload, signupDoctor);
router.post('/login', loginDoctor);

// Doctor session routes
router.get('/me', meDoctor);
router.post('/logout', logoutDoctor);

// Example: protect any future doctor-only routes under this router
// router.get('/secure-data', doctorAuth, (req, res) => {
//   res.json({ ok: true, doctor: req.doctor });
// });

// Doctor: My appointments
router.get('/appointments', doctorAuth, async (req, res) => {
  try {
    const list = await Appointment.find({ doctorId: req.session.doctorId }).sort({ createdAt: -1 });
    res.json({ success: true, appointments: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Doctor: Update availability
router.put('/availability', doctorAuth, async (req, res) => {
  try {
    const { availability } = req.body;
    const doc = await Doctor.findByIdAndUpdate(
      req.session.doctorId,
      { availability: Array.isArray(availability) ? availability : [] },
      { new: true }
    ).select('_id name email availability');
    res.json({ success: true, doctor: doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

// Doctor: Update profile basic fields
router.put('/profile', doctorAuth, async (req, res) => {
  try {
    const updatable = (({ name, phone, location, experience, specialty }) => ({ name, phone, location, experience, specialty }))(req.body);
    const doc = await Doctor.findByIdAndUpdate(req.session.doctorId, updatable, { new: true })
      .select('_id name email phone location experience specialty');
    res.json({ success: true, doctor: doc });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
