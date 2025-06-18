const express = require('express');
const router = express.Router();

const sentOtps = {}; // In-memory store (for testing only)

router.post('/send', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone is required' });

  const otp = Math.floor(100000 + Math.random() * 900000);
  sentOtps[phone] = otp;

  console.log(`🔐 OTP for ${phone} is ${otp}`);
  res.json({ success: true, message: 'OTP sent (logged in console)' });
});

router.post('/verify', (req, res) => {
  const { phone, otp } = req.body;
  if (sentOtps[phone] && parseInt(otp) === sentOtps[phone]) {
    delete sentOtps[phone];
    return res.json({ success: true, message: 'OTP verified' });
  }
  res.status(400).json({ error: 'Invalid or expired OTP' });
});

module.exports = router;
