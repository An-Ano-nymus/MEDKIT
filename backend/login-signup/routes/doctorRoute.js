const express = require('express');
const Doctor = require('../models/Doctor');
const doctorAuth = require('../middlewares/doctorAuth');
const router = express.Router();

// Create doctor - protect behind doctorAuth (could be admin-only in future)
router.post('/', doctorAuth, async (req, res) => {
  try {
    const doctor = await Doctor.create(req.body);
    res.status(201).json(doctor);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create doctor', details: err.message });
  }
});

// GET all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

module.exports = router;
