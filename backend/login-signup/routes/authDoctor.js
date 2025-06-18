const express = require('express');
const multer = require('multer');
const path = require('path');
const { signupDoctor, loginDoctor } = require('../controllers/docAuthController');
const { doctorUpload } = require('../middlewares/upload');
// const {}=require();

const router = express.Router();

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/doctors/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage
});

// Route: /api/doctor/signup
// router.post(
//   '/signup',
//   upload.fields([
//     { name: 'degree', maxCount: 1 },
//     { name: 'licensePhoto', maxCount: 1 }
//   ]),
//   signupDoctor
// );

// Route: /api/doctor/login
router.post('/signup', doctorUpload, signupDoctor);
router.post('/login', loginDoctor);

module.exports = router;
