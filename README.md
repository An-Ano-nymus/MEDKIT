# MEDKIT Monorepo

This repository contains:
- Backend API (Node/Express/Mongo) at `backend/login-signup`
- Patient Web App (Vite React) at `frontend4`
- Doctor Web App (Vite React) at `doctor_frontEnd`

## Prerequisites
- Node.js 18+
- MongoDB (connection string in `backend/login-signup/.env` as `MONGO_URI`)
- Python 3.10+ with any extra packages required by the python scripts

## Setup & Run

1. Backend
   - cd backend/login-signup
   - npm install
   - Create `.env` with `MONGO_URI=mongodb://localhost:27017/medkit` and optionally `PORT=5000`
   - npm run dev

2. Patient App (frontend4)
   - cd frontend4
   - npm install
   - npm run dev
   - Opens on http://localhost:5173

3. Doctor App (doctor_frontEnd)
   - cd doctor_frontEnd
   - npm install
   - npm run dev
   - Opens on http://localhost:5174

## API Overview
- POST /api/auth/signup {name,email,password}
- POST /api/auth/login {email,password}
- GET  /api/auth/me (session)
- POST /api/auth/logout
- POST /api/doctor/signup (multipart: degreeFile, licenseFile + fields)
- POST /api/doctor/login {email,password}
- GET  /api/doctors
- POST /appointments/book
- POST /api/otp/send {phone}
- POST /api/otp/verify {phone,otp}
- POST /translate (multipart: file, targetLang[,sourceLang])
- POST /analyze (multipart: file)

## Notes
- CORS is configured for http://localhost:5173 and http://localhost:5174
- Sessions are cookie-based; frontend uses `credentials: 'include'` in auth API
- Uploaded files saved under `backend/login-signup/uploads/`
