const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/authController');
const{ login }=require('../controllers/authController');

router.post('/signup', signup);
router.post('/login',login);

router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

module.exports = router;
