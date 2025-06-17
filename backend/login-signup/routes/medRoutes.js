const express = require('express');
const router = express.Router();
const { analyzePDF, getHistory } = require('../controllers/medController');

router.post('/analyze', analyzePDF);
router.get('/history', getHistory)

module.exports = router;