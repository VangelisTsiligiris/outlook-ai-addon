# 🚀 Deployment Guide - Production Setup

This guide shows how to deploy your Outlook AI add-in so you don't need to run servers locally.

## Overview

For production, you need to:
1. **Deploy the backend** (Node.js server) to a cloud platform
2. **Host the frontend files** (HTML/JS) on a web server
3. **Update the manifest.xml** with your production URLs
4. **Install the add-in** in Outlook

---

## Option 1: Deploy to Render (Recommended - FREE)

**Best for: Simple, free hosting with automatic HTTPS**

### Step 1: Deploy Backend to Render

1. **Create a Render account** at https://render.com (free)

2. **Push your code to GitHub:**
   ```bash
   cd outlook-ai-addon
   git init
   git add .
   git commit -m "Initial commit"
   # Create a new repo on GitHub, then:
   git remote add origin https://github.com/yourusername/outlook-ai-addon.git
   git push -u origin main
   ```

3. **Create Web Service on Render:**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: outlook-ai-backend
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

4. **Add Environment Variable:**
   - In Render dashboard, go to "Environment"
   - Add: `GEMINI_API_KEY` = your-api-key

5. **Copy your backend URL:**
   - Will be like: `https://outlook-ai-backend.onrender.com`

### Step 2: Deploy Frontend to Render (Static Site)

1. **Create new Static Site on Render:**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Configure:
     - **Name**: outlook-ai-frontend
     - **Build Command**: (leave empty)
     - **Publish Directory**: `.`

2. **Copy your frontend URL:**
   - Will be like: `https://outlook-ai-frontend.onrender.com`

### Step 3: Update Configuration

1. **Update taskpane.js:**
   ```javascript
   // Change this line:
   const API_BASE_URL = 'https://outlook-ai-backend.onrender.com/api';
   ```

2. **Update manifest.xml** - Replace ALL localhost URLs:
   ```xml
   <!-- Change from localhost:3000 to your Render frontend URL -->
   <SourceLocation DefaultValue="https://outlook-ai-frontend.onrender.com/taskpane.html"/>
   <!-- Do this for ALL URLs in the manifest -->
   ```

3. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Update URLs for production"
   git push
   ```

---

## Option 2: Deploy to Vercel (Fast & Free)

**Best for: Quick deployment with automatic SSL**

### Backend (Using Vercel Serverless Functions)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `api` directory and move server logic:**
   ```bash
   mkdir api
   ```

3. **Create `api/[endpoint].js` files for each endpoint**

4. **Create `vercel.json`:**
   ```json
   {
     "version": 2,
     "builds": [
       { "src": "api/**/*.js", "use": "@vercel/node" },
       { "src": "*.html", "use": "@vercel/static" }
     ],
     "routes": [
       { "src": "/api/(.*)", "dest": "/api/$1" },
       { "src": "/(.*)", "dest": "/$1" }
     ],
     "env": {
       "GEMINI_API_KEY": "@gemini-api-key"
     }
   }
   ```

5. **Deploy:**
   ```bash
   vercel
   # Follow prompts
   vercel --prod
   ```

6. **Add environment variable:**
   ```bash
   vercel env add GEMINI_API_KEY
   ```

---

## Option 3: Deploy to Railway (Easy Setup)

**Best for: Zero configuration deployment**

### Deploy Everything Together

1. **Create Railway account** at https://railway.app (free tier)

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add Environment Variables:**
   - Go to Variables tab
   - Add: `GEMINI_API_KEY`
   - Add: `PORT` = 3001

4. **Railway auto-detects Node.js** and deploys

5. **Get your URL:**
   - Railway provides: `https://your-app.railway.app`

6. **Update manifest.xml and taskpane.js** with Railway URL

---

## Option 4: Azure Static Web Apps + Azure Functions

**Best for: Microsoft ecosystem integration**

### Deploy Backend as Azure Functions

1. **Install Azure Functions Core Tools:**
   ```bash
   npm install -g azure-functions-core-tools@4
   ```

2. **Create Functions project:**
   ```bash
   func init outlook-ai-functions --javascript
   cd outlook-ai-functions
   ```

3. **Create functions for each endpoint:**
   ```bash
   func new --name summarize --template "HTTP trigger"
   # Repeat for other endpoints
   ```

4. **Deploy to Azure:**
   ```bash
   func azure functionapp publish your-function-app-name
   ```

### Deploy Frontend to Azure Static Web Apps

1. **Install Azure Static Web Apps CLI:**
   ```bash
   npm install -g @azure/static-web-apps-cli
   ```

2. **Deploy:**
   ```bash
   swa deploy
   ```

---

## Option 5: Heroku (Classic Option)

**Note: Heroku is no longer free, but very reliable**

### Deploy Backend

1. **Install Heroku CLI:**
   ```bash
   brew install heroku/brew/heroku  # Mac
   # or download from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Create app:**
   ```bash
   heroku create outlook-ai-backend
   ```

3. **Set environment variable:**
   ```bash
   heroku config:set GEMINI_API_KEY=your-api-key
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **Your backend URL:**
   - `https://outlook-ai-backend.herokuapp.com`

### Deploy Frontend to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

---

## After Deployment Checklist

### 1. Update Frontend Configuration

**File: `taskpane.js`**
```javascript
// Change from:
const API_BASE_URL = 'http://localhost:3001/api';

// To your production URL:
const API_BASE_URL = 'https://your-backend-url.com/api';
```

### 2. Update Manifest URLs

**File: `manifest.xml`**

Find and replace ALL instances of:
- `https://localhost:3000` → `https://your-frontend-url.com`
- `http://localhost:3000` → `https://your-frontend-url.com`

Example locations:
```xml
<SourceLocation DefaultValue="https://your-frontend-url.com/taskpane.html"/>
<bt:Url id="Commands.Url" DefaultValue="https://your-frontend-url.com/commands.html"/>
<bt:Url id="Taskpane.Url" DefaultValue="https://your-frontend-url.com/taskpane.html"/>
```

### 3. Update Icon URLs (if hosting icons separately)

```xml
<IconUrl DefaultValue="https://your-frontend-url.com/assets/icon-64.png"/>
<HighResolutionIconUrl DefaultValue="https://your-frontend-url.com/assets/icon-128.png"/>
```

### 4. Enable CORS on Backend

Make sure your deployed backend allows requests from your frontend domain:

**File: `server.js`**
```javascript
const cors = require('cors');

app.use(cors({
    origin: 'https://your-frontend-url.com',
    credentials: true
}));
```

### 5. Test Your Deployment

1. **Test backend health:**
   ```bash
   curl https://your-backend-url.com/api/health
   ```

2. **Test frontend loads:**
   - Visit `https://your-frontend-url.com/taskpane.html` in browser

3. **Install updated manifest** in Outlook

---

## Recommended Setup for Beginners

**Use Render (both backend and frontend) - FREE**

1. ✅ Sign up at render.com
2. ✅ Push code to GitHub
3. ✅ Create Web Service for backend
4. ✅ Create Static Site for frontend
5. ✅ Add GEMINI_API_KEY environment variable
6. ✅ Update manifest.xml and taskpane.js with Render URLs
7. ✅ Reinstall add-in in Outlook

**Total cost: FREE**
**Setup time: 15-20 minutes**
**No local servers needed!**

---

## Domain Setup (Optional)

If you want a custom domain like `ai-email.yourdomain.com`:

### On Render:
1. Go to Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

### On Vercel:
1. Go to Domains
2. Add your custom domain
3. Update DNS records

Then update manifest.xml with your custom domain.

---

## SSL/HTTPS Certificate

✅ **All recommended platforms provide free SSL certificates automatically:**
- Render: ✅ Auto SSL
- Vercel: ✅ Auto SSL
- Railway: ✅ Auto SSL
- Netlify: ✅ Auto SSL

**No manual SSL setup required!**

---

## Troubleshooting Production Issues

### "Add-in won't load"
- Check URLs in manifest.xml are HTTPS (not HTTP)
- Verify backend is responding: `curl https://your-backend/api/health`
- Check browser console for CORS errors

### "API calls failing"
- Verify GEMINI_API_KEY is set in environment variables
- Check CORS configuration in server.js
- Ensure backend URL in taskpane.js matches deployment

### "Manifest validation errors"
- All URLs must use HTTPS in production
- Ensure all referenced files exist at specified URLs
- Use Microsoft's manifest validator: https://appsource.microsoft.com/en-us/product/office/wa200002144

---

## Cost Comparison

| Platform | Backend | Frontend | Total/Month | Free Tier |
|----------|---------|----------|-------------|-----------|
| **Render** | Free | Free | $0 | 750 hrs/month |
| **Vercel** | Free | Free | $0 | 100GB bandwidth |
| **Railway** | Free | Free | $0 | $5 credit/month |
| Heroku | $7 | - | $7+ | ❌ No free tier |
| Azure | Pay per use | Free | $5-20 | Limited free |

---

## Next Steps

1. Choose a platform (Render recommended)
2. Follow the deployment steps for that platform
3. Update your manifest.xml and taskpane.js
4. Test thoroughly
5. Reinstall the add-in in Outlook
6. Enjoy your production-ready AI email assistant! 🎉

**Need help?** Check the platform-specific documentation:
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
