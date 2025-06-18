const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const { PythonShell } = require('python-shell');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// ✅ CORS: allow credentials and origin from frontend
app.use(cors({
  origin: 'http://localhost:5173', // Your React frontend
  credentials: true
}));

// ✅ Body parser
app.use(express.json());

// File Upload (Multer)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// ✅ Session middleware setup
app.use(session({
  secret: 'your-secret-key', // Use a strong secret, ideally from .env
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));


// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/med', require('./routes/medRoutes'));

app.post('/analyze', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    let options = {
        args: [filePath]
    };

    PythonShell.run('llama_using_api.py', options, function (err, results) {
        if (err) return res.status(500).send({ error: err.message });

        res.send({
            message: 'LLM response generated successfully',
            output: results.join("\n")
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
