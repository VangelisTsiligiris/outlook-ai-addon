# 🚀 EASIEST DEPLOYMENT - Render (5 Minutes)

This is the SIMPLEST way to deploy your add-in without running local servers.

## Step 1: Prepare Your Code (2 minutes)

1. **Create GitHub account** if you don't have one: https://github.com

2. **Push your code to GitHub:**
   ```bash
   cd outlook-ai-addon
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Create new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `outlook-ai-addon`
   - Click "Create repository"

4. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/outlook-ai-addon.git
   git push -u origin main
   ```

## Step 2: Deploy Backend (2 minutes)

1. **Sign up for Render:** https://render.com (FREE - use your GitHub account)

2. **Create Web Service:**
   - Click "New +" → "Web Service"
   - Click "Connect GitHub" → Select your `outlook-ai-addon` repository
   - Fill in:
     - **Name**: `outlook-ai-backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: FREE

3. **Add Environment Variable:**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - Key: `GEMINI_API_KEY`
   - Value: `your-actual-gemini-api-key`
   - Click "Add"

4. **Click "Create Web Service"**

5. **Wait 2-3 minutes for deployment...**

6. **Copy your backend URL:**
   - Will look like: `https://outlook-ai-backend.onrender.com`
   - **SAVE THIS URL!**

## Step 3: Deploy Frontend (1 minute)

1. **In Render Dashboard, click "New +" → "Static Site"**

2. **Connect same repository:**
   - Select your `outlook-ai-addon` repository

3. **Fill in:**
   - **Name**: `outlook-ai-frontend`
   - **Build Command**: (leave EMPTY)
   - **Publish Directory**: `.`
   - **Plan**: FREE

4. **Click "Create Static Site"**

5. **Copy your frontend URL:**
   - Will look like: `https://outlook-ai-frontend.onrender.com`
   - **SAVE THIS URL!**

## Step 4: Update Your Code (2 minutes)

1. **Edit `taskpane.js` on your computer:**
   ```javascript
   // Line 2: Change from localhost to your Render backend URL
   const API_BASE_URL = 'https://outlook-ai-backend.onrender.com/api';
   ```

2. **Edit `manifest.xml` - Find and replace:**
   - Find: `https://localhost:3000`
   - Replace with: `https://outlook-ai-frontend.onrender.com`
   
   Do this for ALL occurrences (there are 5-6 places)

3. **Save and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update production URLs"
   git push
   ```

4. **Wait 1 minute** - Render automatically redeploys!

## Step 5: Install in Outlook

1. **Open Outlook**

2. **For Outlook Desktop:**
   - Home → Get Add-ins → My add-ins
   - Custom add-ins → Add from file
   - Select your updated `manifest.xml`
   - Click Install

3. **For Outlook Web:**
   - Settings (⚙️) → View all Outlook settings
   - Mail → Customize actions → Manage add-ins
   - Add from file → Upload `manifest.xml`

## ✅ Done! 

Your add-in is now live and doesn't require any local servers!

- Backend: `https://outlook-ai-backend.onrender.com`
- Frontend: `https://outlook-ai-frontend.onrender.com`

## 📝 Notes

- **Free tier**: Render free tier spins down after 15 minutes of inactivity. First request may be slow (5-10 seconds), then fast.
- **Upgrade** ($7/month): Keeps server always running for instant responses
- **Updates**: Just push to GitHub, Render auto-deploys!

## 🔧 Troubleshooting

**"Add-in won't load"**
- Wait 2 minutes after deployment
- Check URLs in manifest.xml match your Render URLs
- Ensure all URLs are HTTPS (not HTTP)

**"API calls fail"**
- Go to Render dashboard → outlook-ai-backend → Environment
- Verify GEMINI_API_KEY is set correctly
- Check backend logs for errors

**"First request is slow"**
- Normal on free tier! Server spins down after 15 min inactivity
- Upgrade to paid tier ($7/mo) for always-on server

---

## Alternative: One-Click Deploy to Railway

**Even easier - no GitHub needed!**

1. Go to: https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub"
3. Connect repository
4. Add environment variable: `GEMINI_API_KEY`
5. Railway auto-detects and deploys!
6. Get your URL and update manifest.xml

---

**That's it! No localhost, no running servers, just works!** 🎉
