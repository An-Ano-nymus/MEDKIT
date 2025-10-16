const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
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
      userId: req.session && req.session.userId ? req.session.userId : undefined,
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

// Get appointments for logged-in user
router.get('/user', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = await User.findById(req.session.userId).select('name');
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Prefer userId; fallback to username for legacy items
    const appts = await Appointment.find({ $or: [ { userId: req.session.userId }, { username: user.name } ] })
      .sort({ createdAt: -1 })
      .lean();
    return res.json({ success: true, appointments: appts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Update (reschedule) appointment date/time
router.put('/:id', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { date, time } = req.body || {};
    if (!date || !time) return res.status(400).json({ error: 'Missing date/time' });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    // Ownership: either matches by userId or by username fallback
    const user = await User.findById(req.session.userId).select('name');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const owns = (appt.userId && appt.userId.toString() === req.session.userId) || appt.username === user.name;
    if (!owns) return res.status(403).json({ error: 'Forbidden' });

    appt.date = date;
    appt.time = time;
    await appt.save();
    return res.json({ success: true, appointment: appt });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Cancel appointment
router.delete('/:id', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    const user = await User.findById(req.session.userId).select('name');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const owns = (appt.userId && appt.userId.toString() === req.session.userId) || appt.username === user.name;
    if (!owns) return res.status(403).json({ error: 'Forbidden' });
    await appt.deleteOne();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to cancel appointment' });
  }
});

module.exports = router;
