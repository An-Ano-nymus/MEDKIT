const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const User = require('../models/User');

router.post('/signup', signup);
router.post('/login', login);

router.get('/me', async (req, res) => {
  try {
    if (req.session && req.session.userId) {
      const user = await User.findById(req.session.userId).select('_id name email');
      if (user) {
        return res.status(200).json({ loggedIn: true, user: { id: user._id, name: user.name, email: user.email } });
      }
    }
    return res.status(401).json({ loggedIn: false });
  } catch (e) {
    return res.status(500).json({ loggedIn: false });
  }
});

router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Logged out' });
    });
  } else {
    return res.status(200).json({ message: 'Logged out' });
  }
});

module.exports = router;
