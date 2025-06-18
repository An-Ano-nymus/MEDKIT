const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const router = express.Router();

router.post('/book', async (req, res) => {
  const { username, phone, doctorId, date, time } = req.body;

  if (!username || !phone || !doctorId || !date || !time) {
    return res.status(400).json({ error: 'Missing appointment info' });
  }

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

    const appointment = await Appointment.create({
      doctor: doctor.name,
      date,
      time,
      phone,
      username,
      doctorId
    });

    const message = `Appointment Confirmed: ${doctor.name}, ${date}, ${time}, Patient: ${username}`;
    const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`;

    res.json({ success: true, appointment, message });
  } catch (err) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

module.exports = router;
