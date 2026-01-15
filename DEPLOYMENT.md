# Deployment Guide for Vercel

This guide will help you deploy your LLM chat application to Vercel.

## Prerequisites

1. ✅ Code pushed to GitHub (your repository)
2. ✅ Vercel account (sign up at [vercel.com](https://vercel.com) with GitHub)
3. ✅ OpenAI API key (for the backend)

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "Add New Project"

2. **Import Your Repository**
   - Select your GitHub repository
   - Vercel will auto-detect it's a Next.js project

3. **Configure Project Settings**
   
   **IMPORTANT:** The `vercel.json` is configured to handle both frontend and API:
   
   - **Root Directory:** Leave as `.` (root) ⚠️ (DO NOT set to `frontend` - this hides the `api/` folder!)
   - **Framework Preset:** Next.js (will be detected from vercel.json config)
   - **Build Command:** Already configured in vercel.json (`cd frontend && npm install && npm run build`)
   - **Output Directory:** Already configured in vercel.json (`frontend/.next`)
   - **Install Command:** Already configured in vercel.json (`cd frontend && npm install`)
   
   **Critical:** If you set Root Directory to `frontend`, Vercel won't see the `api/` folder and your backend will return 404!

4. **Environment Variables**
   
   Add these in the Vercel dashboard:
   - `OPENAI_API_KEY` - Your OpenAI API key (for backend)
   - `NEXT_PUBLIC_API_URL` - Leave empty (uses relative URLs in production)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project root**:
   ```bash
   cd /Users/manish/Documents/AIEngineer/The-AI-Engineer-Challenge
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set root directory to `frontend` when prompted
   - Add environment variables when prompted

5. **For production deployment**:
   ```bash
   vercel --prod
   ```

## Important Configuration Notes

### For Monorepo Structure

Since your Next.js app is in `frontend/`, you have two options:

**Option A: Set Root Directory in Vercel Dashboard**
- In Vercel project settings, set "Root Directory" to `frontend`
- This is the easiest approach

**Option B: Use vercel.json (Current Setup)**
- The current `vercel.json` should work, but you may need to adjust:
  - Vercel might need the root directory set in dashboard anyway
  - The rewrites should handle API routing

### Backend API Routing

The `vercel.json` is configured to:
- Route `/api/*` requests to your Python backend (`/api/index.py`)
- Serve the Next.js frontend for all other routes

**Note:** Vercel will automatically handle Python serverless functions in the `/api` directory.

## Environment Variables

Make sure to set these in Vercel Dashboard → Project Settings → Environment Variables:

1. **OPENAI_API_KEY** (Required)
   - Your OpenAI API key
   - Used by the backend to call OpenAI API
   - Mark as "Production" and "Preview" environments

2. **NEXT_PUBLIC_API_URL** (Optional)
   - Leave empty for production (uses relative URLs)
   - Only set if your backend is hosted separately

## Testing Your Deployment

1. After deployment, visit your Vercel URL
2. Test the chat interface
3. Check browser console for any errors
4. Verify API calls are working

## Troubleshooting

### Build Fails

- **Error: "Cannot find module"**
  - Make sure root directory is set to `frontend` in Vercel settings
  - Or ensure `package.json` is in the correct location

- **Error: "API route not found"**
  - Check that `vercel.json` rewrites are correct
  - Verify `/api/index.py` exists in the repository

### API Not Working

- **CORS errors**
  - Backend CORS is configured to allow all origins (`*`)
  - Should work, but check if Vercel is adding extra headers

- **500 errors from API**
  - Check that `OPENAI_API_KEY` is set in Vercel environment variables
  - Check Vercel function logs for detailed error messages

### Frontend Not Loading

- **404 errors**
  - Verify root directory is set correctly
  - Check that Next.js build completed successfully
  - Review build logs in Vercel dashboard

## Post-Deployment

1. **Share your app**: Copy the Vercel deployment URL
2. **Test in incognito**: Make sure it works for others
3. **Monitor logs**: Check Vercel dashboard for any errors
4. **Custom domain** (optional): Add your own domain in Vercel settings

## Need Help?

- Check Vercel logs in the dashboard
- Review [Vercel documentation](https://vercel.com/docs)
- Check your repository's README for additional setup info

