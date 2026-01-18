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
- **DO NOT CHANGE** - Leave Root Directory as `.` (root/empty)
- ⚠️ **DO NOT** set it to `frontend` - this will hide the `api/` folder!

#### Framework Preset
- Vercel should auto-detect **Next.js**
- If not, select **Next.js** manually

#### Build and Output Settings
- **Build Command:** Leave empty (Vercel will auto-detect from `frontend/package.json`)
- **Output Directory:** Leave empty (Vercel will use `frontend/.next`)
- **Install Command:** Leave empty (Vercel will auto-detect)

**Why?** When Root Directory is `.` (root), Vercel will:
- Auto-detect Next.js in `frontend/` directory
- Auto-detect Python API in `api/` directory
- Build everything correctly

### 4. Environment Variables

Go to **Settings → Environment Variables** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-your-actual-key-here` | Production, Preview, Development |

**Important:** 
- Make sure to select all three environments (Production, Preview, Development)
- Click **Save** after adding

### 5. Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (usually 2-3 minutes)
3. Your app will be live at the provided URL!

## How It Works

### Frontend (Next.js)
- Located in `frontend/` directory
- Vercel auto-detects and builds it
- Served at your domain root (`/`)

### Backend (Python API)
- Located in `api/` directory
- Vercel auto-detects Python files in `api/`
- `api/chat.py` → accessible at `/api/chat`
- Uses FastAPI with auto-detection

## Troubleshooting

### Error: "cd frontend: No such file or directory"
**Solution:** Root Directory must be `.` (root), NOT `frontend`

### Error: "404 NOT_FOUND" on `/api/chat`
**Solution:** 
1. Check Root Directory is `.` (not `frontend`)
2. Verify `api/chat.py` exists in repository
3. Check `api/requirements.txt` has FastAPI dependencies

### Error: "OPENAI_API_KEY not configured"
**Solution:** 
1. Go to Settings → Environment Variables
2. Add `OPENAI_API_KEY` with your actual key
3. Make sure it's enabled for Production environment
4. Redeploy

### Build Fails
**Solution:**
1. Check Vercel build logs for specific errors
2. Verify `frontend/package.json` exists
3. Make sure Root Directory is `.` (root)

## Testing Your Deployment

1. Visit your Vercel deployment URL
2. Fill out the meal preferences form
3. Send a test message
4. Verify the AI responds correctly

## Need Help?

- Check Vercel logs in the Deployments tab
- Review [Vercel documentation](https://vercel.com/docs)
- Check your repository's README for additional info
