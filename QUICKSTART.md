# ⚡ Quick Start Guide - AI Email Assistant

Get your AI Email Assistant running in 5 minutes!

## Step 1: Get Your API Key (2 minutes)

1. Go to https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

## Step 2: Set Up the Project (1 minute)

Open your terminal and run:

```bash
cd outlook-ai-addon
npm install
cp .env.example .env
```

Edit the `.env` file and paste your API key:
```
GEMINI_API_KEY=your-actual-key-here
```

## Step 3: Start the Servers (1 minute)

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
# Option A - Python
python -m http.server 3000

# Option B - Node
npx http-server -p 3000
```

## Step 4: Install in Outlook (1 minute)

### Outlook Desktop:
1. Open Outlook
2. Home → Get Add-ins → My add-ins
3. Custom add-ins → Add from file
4. Select `manifest.xml`
5. Install

### Outlook Web:
1. Go to outlook.office.com
2. Settings (⚙️) → View all Outlook settings
3. Mail → Customize actions → Manage add-ins
4. Add from file → Upload `manifest.xml`

## Step 5: Use It!

1. Open any email in Outlook
2. Click the "AI Email Helper" button in the ribbon
3. Try "Summarize This Email" or any other feature!

## 🎉 That's it!

Your AI assistant is now ready to help with emails.

## Common Issues

**"Can't connect to server"**
- Make sure both terminals are running
- Backend should be on port 3001
- Frontend should be on port 3000

**"API key not configured"**
- Check your `.env` file has the key
- Restart the backend server (Terminal 1)

**"Add-in doesn't show up"**
- Restart Outlook
- Check the manifest.xml was uploaded correctly
- Wait a minute, sometimes it takes time to appear

## Next Steps

- Read the full README.md for customization options
- Try all the features (summarize, draft, improve, etc.)
- Customize the prompts in `server.js` to match your style

---

Need help? Check the full README.md or troubleshooting section.
