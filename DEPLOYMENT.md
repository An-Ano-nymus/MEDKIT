# MEDKIT Deployment Playbook

This repository is ready for a split deployment: the Express API runs on any cloud host, and the Vite frontend runs on Vercel with analytics enabled.

## 1. Backend API (cloud server / container)

### 1.1 Configure secrets
Copy `backend/login-signup/.env.example` and set the following values in your hosting provider:

| Key | Example |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | `5000` (let the host override if required) |
| `MONGO_URI` | `mongodb+srv://<user>:<pass>@cluster/medkit` |
| `SESSION_SECRET` | long random string |
| `CLIENT_URLS` | `https://medkit.vercel.app,https://staging-medkit.vercel.app` |
| `RAPIDAPI_KEY` | key for the analyzer script |

### 1.2 Deploy with Docker
```bash
cd backend/login-signup
cp .env.example .env   # dev only
# build and push
az acr login -n <registry>
docker build -t <registry>/medkit-backend:latest .
docker push <registry>/medkit-backend:latest
```
Run the image with `docker run -p 5000:5000 --env-file .env <image>` or reference it from ECS, GKE, etc. Python 3 is preinstalled for the `python_scripts`.

### 1.3 Deploy without Docker (Render/Railway/Fly.io)
- Build command: `npm ci`
- Start command: `npm start`
- Node version: `>=18.17.0` (declared in `package.json`).
- Optional persistent storage: mount `/app/uploads` or wire uploads to S3/Blob storage.

### 1.4 Networking & security
- HTTPS is required for secure cookies; the server automatically sets `secure` + `sameSite=none` when `NODE_ENV=production`.
- Only authenticated users can access uploads via `GET /api/protected-uploads/<path>`. Remove the dev-only `/uploads` static route once you no longer need it locally.

## 2. Frontend (Vercel)

1. In Vercel, import this repo and set the project root to `frontend4/`.
2. Verify `vercel.json` is picked up (build = `npm run build`, output = `dist`).
3. Add environment variables:
   - `VITE_API_ORIGIN=https://api.your-domain.com`
4. Deploy. Vercel injects `VERCEL_ANALYTICS_ID`; `src/App.tsx` renders `<Analytics />`, so Web Vitals automatically appear under **Analytics** in the dashboard.
5. (Optional) Enable Vercel Web Analytics Pro for Real User Monitoring and set alerts.

## 3. Post-deploy checks
- **Backend health**: `GET https://api.your-domain.com/api/auth/me` should return a 401 (expected) but prove the server is reachable.
- **Frontend health**: `https://medkit.vercel.app` loads, cookies are set with `Secure` + `SameSite=None`, and cross-origin calls succeed (CORS is controlled via `CLIENT_URLS`).
- **Metrics**: Within a few minutes, Vercel Analytics should show traffic. Use the dashboard to confirm.

For more backend-specific details (storage, scaling, etc.) see `backend/login-signup/DEPLOYMENT.md`.
