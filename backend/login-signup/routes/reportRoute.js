const express = require('express');
const Report = require('../models/Report');
const router = express.Router();

// Create a report document
router.post('/', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const { fileName, summary, medications = [], sideEffects = [] } = req.body || {};
    if (!summary) return res.status(400).json({ error: 'Missing summary' });
    const report = await Report.create({ userId: req.session.userId, fileName, summary, medications, sideEffects });
    return res.json({ success: true, report });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save report' });
  }
});

// List reports (latest first)
router.get('/', async (req, res) => {
  try {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    const reports = await Report.find({ userId: req.session.userId }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, reports });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;
