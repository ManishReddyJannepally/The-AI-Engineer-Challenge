# Deployment Guide for Vercel

This guide will help you deploy your Meal Prep Planner application to Vercel.

## Prerequisites

1. ✅ Code pushed to GitHub
2. ✅ Vercel account (sign up at [vercel.com](https://vercel.com) with GitHub)
3. ✅ OpenAI API key

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

Make sure all your code is committed and pushed:
```bash
git push origin main
```

### 2. Import Project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `ManishReddyJannepally/The-AI-Engineer-Challenge`

### 3. Configure Project Settings

**CRITICAL SETTINGS - Follow these exactly:**

#### Root Directory
- **Set Root Directory to:** `frontend` ⚠️ (This is REQUIRED!)
- This tells Vercel to build from the `frontend/` directory
- The `api/` folder is inside `frontend/` directory (`frontend/api/`)

#### Framework Preset
- Vercel should auto-detect **Next.js**
- If not, select **Next.js** manually

#### Build and Output Settings
- **Build Command:** Leave empty (Vercel will auto-detect `npm run build`)
- **Output Directory:** Leave empty (Vercel will use `.next`)
- **Install Command:** Leave empty (Vercel will auto-detect `npm install`)

**Why Root Directory = `frontend`?**
- When Root Directory is `frontend`, Vercel sees:
  - `frontend/package.json` → Next.js app
  - `frontend/api/index.py` → Python FastAPI API
- Vercel automatically:
  - Builds Next.js from `frontend/`
  - Detects Python API in `frontend/api/`
  - Routes Next.js to `/` (root)
  - Routes API to `/api/*`

### 4. Environment Variables

Go to **Settings → Environment Variables** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-your-actual-key-here` | Production, Preview, Development |

**Important:** 
- Make sure to select all three environments (Production, Preview, Development)
- Click **Save** after adding
- **Redeploy** after adding environment variables

### 5. Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at the provided URL!

## How It Works

### Frontend (Next.js)
- Located in `frontend/` directory
- Vercel auto-detects and builds it when Root Directory = `frontend`
- Served at your domain root (`/`)

### Backend (Python API)
- Located in `frontend/api/` directory
- Vercel auto-detects Python files in `api/` subdirectory
- `frontend/api/index.py` → accessible at `/api/index/chat`
- `vercel.json` rewrites `/api/chat` → `/api/index/chat`
- Uses FastAPI with auto-detection

## Troubleshooting

### Error: "cd frontend: No such file or directory"
**Solution:** Root Directory must be `frontend`, NOT `.` (root)

### Error: "No Next.js version detected"
**Solution:** 
1. Check Root Directory is set to `frontend`
2. Verify `frontend/package.json` exists and has `next` in dependencies
3. Check build logs for specific errors

### Error: "No fastapi entrypoint found"
**Solution:** 
1. Verify `frontend/api/index.py` exists
2. Check that it has `app = FastAPI()` defined
3. Make sure `frontend/api/requirements.txt` exists with FastAPI dependencies

### App shows `{"detail":"Not Found"}` or `{"status":"ok"}`
**Solution:** 
1. **Root Directory MUST be `frontend`** (not `.`)
2. This ensures Next.js serves `/` and API only handles `/api/*`
3. If Root Directory is `.`, Vercel might route `/` to the API instead of Next.js
4. Go to Vercel Settings → General → Root Directory → Set to `frontend`
5. Redeploy

### Error: "OPENAI_API_KEY not configured"
**Solution:** 
1. Go to Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your actual key
3. Make sure it's enabled for Production environment
4. **Redeploy** after adding

### Build Fails
**Solution:**
1. Check Vercel build logs for specific errors
2. Verify `frontend/package.json` exists
3. Make sure Root Directory is `frontend`
4. Check that all dependencies are in `package.json`

## Testing Your Deployment

1. Visit your Vercel deployment URL
2. You should see the Meal Prep Planner UI (not JSON)
3. Fill out the meal preferences form
4. Send a test message
5. Verify the AI responds correctly

## Need Help?

- Check Vercel logs in the Deployments tab
- Review [Vercel documentation](https://vercel.com/docs)
- Check your repository's README for additional info
