# College Marketplace Deployment (Render)

## Frontend-only deploy (quickest)

If you only want the React app online:

1. Go to [Vercel](https://vercel.com/new) and import this GitHub repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variables:
   - `VITE_API_URL` = your backend base URL (for example `https://your-backend.onrender.com`)
   - `VITE_UPLOADS_URL` = same backend base URL
4. Deploy.

Notes:
- `frontend/vercel.json` is already added so React routes do not show `Not Found` on refresh.
- If backend is not deployed, login/products/AI calls will fail; only static UI pages will load.

This project has 3 services:
- `frontend` (Vite static site)
- `backend` (Node/Express API)
- `ai-services` (Flask + Groq)

The repo already includes a Render blueprint in `render.yaml`.

## 1) Push code to GitHub

From repo root:

```bash
git add .
git commit -m "Add Render deployment configuration"
git push
```

## 2) Create services from Blueprint

1. Open [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** -> **Blueprint**
3. Connect/select this GitHub repository
4. Select branch and create

Render will create:
- `college-marketplace-frontend`
- `college-marketplace-backend`
- `college-marketplace-ai`

## 3) Set required secret environment variables

After services are created, configure these in Render:

### Backend service (`college-marketplace-backend`)
- `MONGO_URI` = your MongoDB connection string
- `JWT_SECRET` = long random secret string

### AI service (`college-marketplace-ai`)
- `GROQ_API_KEY` = your Groq API key

No secret is required for frontend.

## 4) Frontend/API URL wiring (automatic)

In `render.yaml`, frontend env vars are linked automatically to backend service URL using `fromService`.
That means you do **not** need to manually set backend URL strings in most cases.

Also, SPA rewrite is configured so React routes do not return `Not Found` on refresh:
- `/* -> /index.html`

If you customized service names, ensure `fromService.name` values still match.

## 5) Quick health checks

After deployment:

1. Open backend URL:
   - `https://<your-backend>.onrender.com/`
   - Expected: `College Marketplace API running`
2. Open AI health URL:
   - `https://<your-ai-service>.onrender.com/health`
   - Expected: JSON with `"status": "ok"` and `"api_key_loaded": true`
3. Open frontend URL:
   - Confirm homepage loads
   - Register/login works
   - Product create/list works
   - AI chat/price/listing generation works
   - Uploaded images load from backend `/uploads/...`

## 6) Common issues and fixes

- **Frontend shows `Not Found` on refresh/deep link**
  - Ensure frontend service includes rewrite route:
    - `source: /*`
    - `destination: /index.html`
  - Redeploy frontend

- **CORS or network errors from frontend**
  - Verify frontend env vars are linked to backend via `fromService`
  - Redeploy frontend after blueprint sync

- **Backend fails on startup**
  - `MONGO_URI` missing or invalid
  - `JWT_SECRET` missing

- **AI routes fail (`503` or timeout)**
  - AI service not running
  - `GROQ_API_KEY` missing/invalid
  - Backend `AI_SERVICE_URL` not matching AI service URL

- **Image URLs broken**
  - Verify `VITE_UPLOADS_URL` points to backend base URL (without `/api`)
