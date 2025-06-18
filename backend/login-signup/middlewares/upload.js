const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/doctors/');
    fs.mkdirSync(uploadDir, { recursive: true }); // ensure it exists
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const license = req.body.licenseNumber;
    const ext = path.extname(file.originalname);
    const baseName = file.fieldname === 'degreeFile' ? `${license}-degree${ext}` : `${license}-license${ext}`;
    const filePath = path.join(__dirname, '../uploads/doctors', baseName);
     if (fs.existsSync(filePath)) {
      return cb(new Error(`File for license number ${license} already exists.`));
    }
    cb(null, baseName);
  }
});

// This tells multer exactly which fields (file inputs) it expects
const doctorUpload = multer({
  storage: storage
}).fields([
  { name: 'degreeFile', maxCount: 1 },
  { name: 'licenseFile', maxCount: 1 }
]);

module.exports = { doctorUpload };
