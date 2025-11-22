const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const multer = require('multer');
const { PythonShell } = require('python-shell');
const path = require('path');
const translateRoute = require('./routes/translateRoute');
const appointmentRoute=require('./routes/appointmentRoute');
const doctorRoute= require('./routes/doctorRoute');
const otpRoute=require('./routes/otpRoute');
const authDoctorRoutes = require('./routes/authDoctor');
const reportRoute = require('./routes/reportRoute');
const protectedUploads = require('./routes/protectedUploads');



dotenv.config();
connectDB();

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

if (isProduction) {
    app.set('trust proxy', 1);
}

// ✅ CORS: allow credentials, restrict to configured frontends
app.use(cors({
    origin(origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Not allowed by CORS'));
    },
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
const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    console.warn('⚠️  SESSION_SECRET is missing. Set it in production.');
}

app.use(session({
    secret: sessionSecret || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

// Serve uploads statically for local debugging only
if (!isProduction) {
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}


// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/med', require('./routes/medRoutes'));

app.post('/analyze', upload.single('file'), (req, res) => {
    const filePath = req.file.path;

    const scriptPath = path.join(__dirname, 'python_scripts', 'llama_using_api.py');

    let options = {
        args: [filePath],
        pythonOptions: ['-u'], // `-u` makes python output unbuffered (real-time)
    };

    const pyshell = new PythonShell(scriptPath, options);

    let output = '';

    // Send response chunks as they come
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    pyshell.stdout.on('data', function (data) {
        console.log("🔁 Python Output:", data);
        res.write(data.toString()); // Stream chunk to client
        output += data.toString();
    });

    pyshell.stderr.on('data', function (errData) {
        console.error("🐍 Python Error:", errData.toString());
        res.write(`ERROR: ${errData.toString()}`);
    });

    pyshell.on('close', function (code) {
        console.log(`✅ Python script finished with code ${code}`);
        res.end(); // Close the response stream
    });

    pyshell.on('error', function (err) {
        console.error("❌ PythonShell Error:", err);
        res.status(500).send({ error: err.message });
    });
});

app.use('/translate', translateRoute);
app.use('/api/doctors', doctorRoute);
app.use('/api/otp', otpRoute);
app.use('/appointments',appointmentRoute);
app.use('/api/doctor', authDoctorRoutes);
app.use('/api/reports', reportRoute);
app.use('/api/protected-uploads', protectedUploads);

// app.use('/api/doctor', require('./routes/authDoctor'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
