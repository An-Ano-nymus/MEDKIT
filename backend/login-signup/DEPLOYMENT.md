# Backend Deployment Guide

This backend is ready for any Node-friendly cloud provider (Railway, Render, Fly.io, AWS ECS, etc.). The key requirements are:

## 1. Environment Variables
Copy `.env.example` to `.env` (for local use) and configure the following secrets inside your cloud dashboard:

| Variable | Description |
| --- | --- |
| `NODE_ENV` | Use `production` in the cloud. |
| `PORT` | Listener port. Most hosts inject their own; keep the default `5000`. |
| `MONGO_URI` | Connection string to your managed MongoDB (Atlas, DocumentDB, etc.). |
| `SESSION_SECRET` | Long random string used to sign cookies. |
| `CLIENT_URLS` | Comma-separated list of allowed origins (e.g., `https://medkit.vercel.app`). |
| `RAPIDAPI_KEY` | API key for the python analyzer. |

## 2. Docker Deploy

```
# build
docker build -t medkit-backend .

# run locally
docker run -p 5000:5000 --env-file .env medkit-backend
```

Push the image to your registry of choice and point your hosting provider at it. Python 3 is already baked in for the `python_scripts`.

## 3. Render/Railway (Node buildpack)
1. Create a new Web Service pointing at `backend/login-signup`.
2. Set build command: `npm ci`
3. Set start command: `npm start`
4. Add env vars listed above (special care for `CLIENT_URLS`).
5. Enable persistent storage for `/app/uploads` if you want uploaded files to survive restarts, or plug in S3/Blob storage and adjust the upload path.

## 4. Session & SSL Notes
- Deployed app automatically sets `secure` cookies and `sameSite=none`. Make sure HTTPS is enabled. If using a custom domain in front of a proxy (e.g., Cloudflare), keep `trust proxy` enabled (the server sets it when `NODE_ENV=production`).
- For signed URLs or CDN access to uploads, route requests via `/api/protected-uploads/:filename`.

## 5. Health Checks
Expose a basic health route (e.g., `GET /api/auth/me`) in your monitoring to ensure MongoDB connectivity remains healthy.
