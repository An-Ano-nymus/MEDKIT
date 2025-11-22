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

## Deployment

### Backend (Cloud VM, Docker host, Render/Railway)
1. Copy `backend/login-signup/.env.example` ➜ `.env` locally. In production, inject the same variables via your host UI (see `backend/login-signup/DEPLOYMENT.md`).
2. Either:
   - Build the Docker image inside `backend/login-signup` (`docker build -t medkit-backend .`) and run it wherever Docker is available, **or**
   - Point a Node-friendly platform (Render/Railway/Fly.io) at `backend/login-signup` with `npm ci` / `npm start` commands.
3. Set `CLIENT_URLS` to include both the local dev URL and the final Vercel domain (e.g., `https://medkit.vercel.app`).
4. Expose port `5000` (or the env port provided by your host) and ensure HTTPS is enabled so secure cookies work.

### Frontend (Vercel + Analytics)
1. In Vercel, import this repo and set the project root to `frontend4/` (or use a monorepo config). The provided `vercel.json` already declares the build and output commands.
2. Add an Environment Variable under **Settings → Environment Variables**:
   - `VITE_API_ORIGIN=https://your-backend-domain.com`
3. Deploy. Vercel automatically injects `VERCEL_ANALYTICS_ID`; the app renders `<Analytics />` (see `src/App.tsx`) so Web Vitals start flowing once traffic hits production.
4. Optional: connect Vercel Web Analytics in the dashboard for richer metrics (Realtime, Core Web Vitals, etc.).

### Static Assets / Uploads
- In production the backend only serves uploads through `/api/protected-uploads/*`, which requires either a logged-in patient or doctor session. Update the frontend `API_ORIGIN` if you front the API with a CDN.
