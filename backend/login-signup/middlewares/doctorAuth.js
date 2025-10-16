const Doctor = require('../models/Doctor');

// Middleware to ensure the requester is an authenticated doctor
module.exports = async function doctorAuth(req, res, next) {
  try {
    if (!req.session || !req.session.doctorId) {
      return res.status(401).json({ error: 'Unauthorized: doctor session required' });
    }

    // Lazy-load doctor if needed
    if (!req.doctor) {
      const doctor = await Doctor.findById(req.session.doctorId).select('_id name email specialty');
      if (!doctor) {
        return res.status(401).json({ error: 'Unauthorized: doctor not found' });
      }
      req.doctor = doctor;
    }

    next();
  } catch (err) {
    console.error('doctorAuth middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
