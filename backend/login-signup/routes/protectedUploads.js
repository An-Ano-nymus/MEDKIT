const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Basic session-based protection for serving files from uploads
router.get('/*', (req, res) => {
  const isAuthed = !!(req.session && (req.session.userId || req.session.doctorId));
  if (!isAuthed) return res.status(401).json({ error: 'Not authenticated' });

  const file = req.params[0];
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  const filePath = path.join(uploadsDir, file);

  // Prevent path traversal
  if (!file || file.includes('..') || path.isAbsolute(file)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

module.exports = router;
