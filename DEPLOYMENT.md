# Deployment Guide for Vercel - FIXED VERSION

This guide will help you deploy your Meal Prep Planner application to Vercel.

## ⚠️ CRITICAL: Root Directory Setting

**THE MOST IMPORTANT SETTING:** In Vercel, you MUST set Root Directory to `frontend`.

If Root Directory is NOT set to `frontend`, you will see `{"detail":"Not Found"}` instead of your Next.js app.

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

### 3. Configure Project Settings - ⚠️ DO THIS FIRST!

**BEFORE ANYTHING ELSE - Set Root Directory:**

1. Go to **Settings → General**
2. Scroll to **"Root Directory"**
3. Click **"Edit"**
4. Type: `frontend` (exactly this, no quotes, no trailing slash)
5. Click **"Save"**

**This is the #1 cause of `{"detail":"Not Found"}` errors!**

#### Framework Preset
- Vercel should auto-detect **Next.js** after setting Root Directory
- If not, select **Next.js** manually

#### Build and Output Settings
- **Build Command:** Leave empty (Vercel will auto-detect)
- **Output Directory:** Leave empty (Vercel will use `.next`)
- **Install Command:** Leave empty (Vercel will auto-detect)

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

1. Click **"Deploy"** button (or it will auto-deploy after you push to GitHub)
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at the provided URL!

## How It Works

### Frontend (Next.js)
- Located in `frontend/` directory
- When Root Directory = `frontend`, Vercel builds Next.js from that directory
- Served at your domain root (`/`)

### Backend (Python API)
- Located in `frontend/api/` directory
- When Root Directory = `frontend`, Vercel sees `frontend/api/index.py` as `api/index.py`
- `frontend/api/index.py` with route `/chat` → accessible at `/api/index/chat`
- `vercel.json` rewrites `/api/chat` → `/api/index/chat`

## Troubleshooting

### ❌ App shows `{"detail":"Not Found"}`

**This means FastAPI is serving `/` instead of Next.js!**

**Solution:**
1. Go to Vercel → Your Project → Settings → General
2. Check **"Root Directory"** - it MUST be `frontend` (not `.` or empty)
3. If it's wrong, change it to `frontend` and click Save
4. Go to Deployments tab
5. Click the three dots (⋯) on the latest deployment
6. Click **"Redeploy"**
7. Wait for build to complete
8. Test again

### Error: "cd frontend: No such file or directory"
**Solution:** Root Directory must be `.` (root), NOT `frontend`. But then you'll need different config. **Recommended: Use Root Directory = `frontend`**

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
2. **You should see the Meal Prep Planner UI** (not JSON like `{"detail":"Not Found"}`)
3. Fill out the meal preferences form
4. Send a test message
5. Verify the AI responds correctly

## Need Help?

- Check Vercel logs in the Deployments tab
- Review [Vercel documentation](https://vercel.com/docs)
- Check your repository's README for additional info
