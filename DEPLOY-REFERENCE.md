# 📋 Deployment Quick Reference Card

## 🎯 Choose Your Deployment Method

### Option 1: Render (Recommended for Beginners)
- **Cost**: FREE
- **Setup Time**: 5-10 minutes
- **Difficulty**: ⭐ Easy
- **Guide**: [EASY-DEPLOY.md](EASY-DEPLOY.md)
- **Best For**: Simple setup, no configuration needed
- **Steps**:
  1. Push code to GitHub
  2. Create Web Service on Render for backend
  3. Create Static Site on Render for frontend
  4. Add GEMINI_API_KEY environment variable
  5. Update URLs in code

**Start here**: https://render.com

---

### Option 2: Vercel (Fastest)
- **Cost**: FREE
- **Setup Time**: 2-3 minutes
- **Difficulty**: ⭐⭐ Medium
- **Guide**: Run `vercel --prod`
- **Best For**: Developers familiar with CLI
- **Steps**:
  1. Install Vercel CLI: `npm i -g vercel`
  2. Run: `vercel`
  3. Add secret: `vercel env add GEMINI_API_KEY`
  4. Deploy: `vercel --prod`
  5. Update URLs in manifest.xml

**Docs**: https://vercel.com/docs

---

### Option 3: Railway (One-Click)
- **Cost**: FREE ($5 credit/month)
- **Setup Time**: 3 minutes
- **Difficulty**: ⭐ Easy
- **Guide**: [DEPLOYMENT.md](DEPLOYMENT.md#option-3-railway)
- **Best For**: All-in-one deployment
- **Steps**:
  1. Connect GitHub repo
  2. Add GEMINI_API_KEY
  3. Done!

**Start here**: https://railway.app

---

### Option 4: Azure (Enterprise)
- **Cost**: Pay-as-you-go
- **Setup Time**: 15-20 minutes
- **Difficulty**: ⭐⭐⭐ Advanced
- **Guide**: [DEPLOYMENT.md](DEPLOYMENT.md#option-4-azure)
- **Best For**: Enterprise environments, Microsoft ecosystem
- **Uses**: Azure Static Web Apps + Azure Functions

**Docs**: https://azure.microsoft.com

---

## 🔑 After Deployment Checklist

✅ **Update taskpane.js:**
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

✅ **Update manifest.xml:**
- Replace ALL `localhost:3000` with your frontend URL
- Ensure all URLs use HTTPS

✅ **Test endpoints:**
```bash
curl https://your-backend-url.com/api/health
```

✅ **Reinstall add-in** in Outlook with updated manifest

---

## 💰 Cost Comparison

| Platform | Free Tier | Paid Plans | Always-On |
|----------|-----------|------------|-----------|
| **Render** | 750 hrs/mo | $7/mo | ❌ Free / ✅ Paid |
| **Vercel** | 100GB/mo | $20/mo | ✅ Yes |
| **Railway** | $5 credit | $5/mo + usage | ✅ Yes |
| Azure | Limited | Pay-per-use | ✅ Yes |

---

## 🐛 Common Issues

**Issue**: Add-in won't load
- ✅ Check all URLs are HTTPS
- ✅ Verify manifest.xml has correct URLs
- ✅ Wait 2-3 minutes after deployment

**Issue**: API calls failing
- ✅ Verify GEMINI_API_KEY is set
- ✅ Check backend is responding: `/api/health`
- ✅ Check CORS settings in server.js

**Issue**: First request is slow (Render free tier)
- ✅ Normal behavior - server spins down after 15 min
- ✅ Upgrade to paid for always-on
- ✅ Or use Vercel/Railway (always-on free)

---

## 📱 Quick Commands

### Deploy to Vercel:
```bash
npm i -g vercel
vercel
vercel env add GEMINI_API_KEY
vercel --prod
```

### Deploy to Render:
```bash
git push origin main
# Then create services in Render dashboard
```

### Test Backend:
```bash
curl https://your-backend.com/api/health
```

### Update and Redeploy:
```bash
git add .
git commit -m "Update"
git push
# Auto-redeploys on most platforms!
```

---

## 🎓 Learning Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Outlook Add-ins**: https://docs.microsoft.com/office/dev/add-ins/

---

## 🚀 Next Steps

1. **Choose a platform** (Render recommended for beginners)
2. **Follow the guide** (EASY-DEPLOY.md for Render)
3. **Deploy** (5-10 minutes)
4. **Update URLs** in manifest.xml and taskpane.js
5. **Test** your endpoints
6. **Reinstall** add-in in Outlook
7. **Enjoy!** No more local servers 🎉

---

**Need help?** Open an issue or check the full [DEPLOYMENT.md](DEPLOYMENT.md) guide!
