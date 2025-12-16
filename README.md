# 🤖 AI Email Assistant for Outlook

An intelligent Outlook add-in powered by Google Gemini that helps you manage and streamline your emails with features like summarization, action item extraction, email drafting, and smart replies.

## ✨ Features

- **📧 Email Summarization** - Get concise summaries of long emails
- **✅ Action Item Extraction** - Automatically identify tasks and action items
- **✍️ Email Drafting** - Generate professional emails from brief instructions
- **🎨 Tone Adjustment** - Write emails in different tones (professional, friendly, formal, casual)
- **💬 Smart Replies** - Generate context-aware responses to emails
- **🔧 Email Improvement** - Enhance clarity and professionalism of your drafts

## 🚀 Prerequisites

- Node.js (v14 or higher)
- Outlook (Desktop, Web, or Mobile)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/apikey))
- Basic knowledge of terminal/command line

## 📦 Installation

### 1. Clone or Download This Project

Save all the files to a directory on your computer.

### 2. Set Up the Backend Server

```bash
# Navigate to the project directory
cd outlook-ai-addon

# Install dependencies
npm install

# Create your environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=your_actual_api_key_here
```

### 3. Get Your Google Gemini API Key

1. Go to [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in your `.env` file

### 4. Start the Backend Server

```bash
npm start
```

You should see:
```
Backend server running on http://localhost:3001
API Key configured: true
```

Keep this terminal window open!

### 5. Serve the Add-in Files

You need to host the add-in files. The simplest way for development:

**Option A: Using Python (if installed)**
```bash
# In a NEW terminal window, in the same directory
python -m http.server 3000
```

**Option B: Using Node.js http-server**
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run the server
http-server -p 3000
```

**Option C: Using VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click on `taskpane.html` and select "Open with Live Server"

### 6. Install the Add-in in Outlook

#### For Outlook on Windows/Mac:

1. Open Outlook
2. Go to **Home** tab → **Get Add-ins** (or **Store**)
3. Click **My add-ins** on the left
4. Under **Custom add-ins**, click **+ Add a custom add-in** → **Add from file**
5. Browse to your `manifest.xml` file and select it
6. Click **Install** and confirm

#### For Outlook on Web:

1. Go to [outlook.office.com](https://outlook.office.com)
2. Click the **Settings** gear icon (⚙️)
3. Search for "add-ins" or go to **View all Outlook settings** → **Mail** → **Customize actions** → **Manage add-ins**
4. Click **+ Add from file**
5. Upload your `manifest.xml`
6. Click **Install**

#### For Testing (Sideloading):

You can also use the Office Add-in Development tools:

```bash
# Install Yeoman and Office Add-in generator
npm install -g yo generator-office

# For easier sideloading
npm install -g office-addin-dev-certs
npm install -g office-addin-debugging
```

## 🎯 Usage

1. **Open or compose an email** in Outlook
2. **Click the "AI Email Helper" button** in the ribbon (it appears when you view or compose emails)
3. **Choose a feature:**
   - Click "Summarize This Email" to get a quick summary
   - Click "Extract Action Items" to find tasks
   - Enter instructions to draft a new email
   - Click "Improve Current Draft" to enhance what you've written
   - Click "Generate Quick Reply" for smart response suggestions

## 🌐 Production Deployment (No Local Servers!)

**Don't want to run servers locally?** Deploy to the cloud in 5 minutes!

**👉 See [EASY-DEPLOY.md](EASY-DEPLOY.md) for a step-by-step guide**

Quick options:
- **Render** (Recommended - FREE): Complete guide in EASY-DEPLOY.md
- **Vercel**: `vercel --prod` (includes vercel.json)
- **Railway**: One-click deployment
- **Full options**: See [DEPLOYMENT.md](DEPLOYMENT.md) for all platforms

After deployment:
1. Update `API_BASE_URL` in `taskpane.js` with your backend URL
2. Replace all `localhost:3000` in `manifest.xml` with your frontend URL
3. Reinstall the add-in with the updated manifest

## 🏗️ Project Structure

```
outlook-ai-addon/
├── manifest.xml          # Outlook add-in configuration
├── taskpane.html        # UI interface
├── taskpane.js          # Frontend logic
├── commands.html        # Commands file (required by manifest)
├── server.js            # Backend API server
├── package.json         # Node.js dependencies
├── .env                 # Your API keys (create this, not in repo)
├── .env.example         # Template for .env
└── README.md            # This file
```

## 🔐 Security Notes

- **NEVER commit your `.env` file** to version control
- The backend server keeps your API key secure
- All AI processing happens server-side
- Add `.env` to your `.gitignore` file

## 🛠️ Customization

### Adding New Features

Edit `server.js` to add new API endpoints:

```javascript
app.post('/api/your-feature', async (req, res) => {
    try {
        const { data } = req.body;
        const prompt = `Your prompt here: ${data}`;
        const result = await callClaudeAPI(prompt, 'System prompt');
        res.json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

Then add a button in `taskpane.html` and handler in `taskpane.js`.

### Changing the AI Model

In `server.js`, modify the model parameter:

```javascript
model: 'gemini-2.0-flash-exp',  // Or 'gemini-1.5-pro' for more capable model
```

### Adjusting Response Length

Change `max_tokens` in `server.js`:

```javascript
max_tokens: 1024,  // Increase for longer responses
```

## 🐛 Troubleshooting

### Add-in doesn't appear in Outlook
- Make sure the manifest.xml file is properly installed
- Check that the URLs in manifest.xml match your server (localhost:3000)
- Try restarting Outlook

### "API Key not configured" error
- Check that your `.env` file exists and contains `ANTHROPIC_API_KEY=...`
- Restart the backend server after adding the key
- Verify the key is valid at console.anthropic.com

### "Failed to fetch" errors
- Ensure the backend server is running on port 3001
- Check CORS settings if deploying to production
- Verify your firewall isn't blocking the ports

### SSL/HTTPS errors in production
- For production, you'll need HTTPS
- Use a service like Heroku, Railway, or DigitalOcean
- Update manifest.xml URLs to your production URLs

## 🚀 Deployment

For production deployment without local servers, see:
- **[EASY-DEPLOY.md](EASY-DEPLOY.md)** - 5-minute guide to deploy on Render (FREE)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete guide with all platform options

Basic steps:
1. Deploy backend to cloud platform (Render, Vercel, Railway, etc.)
2. Deploy frontend to static hosting
3. Update `taskpane.js` API_BASE_URL with your backend URL
4. Update `manifest.xml` with your frontend URL (replace all localhost:3000)
5. Reinstall add-in in Outlook with updated manifest

## 📚 Additional Resources

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [Office Add-ins Documentation](https://docs.microsoft.com/en-us/office/dev/add-ins/)
- [Outlook Add-in API Reference](https://docs.microsoft.com/en-us/javascript/api/outlook)
- [Office.js Library](https://docs.microsoft.com/en-us/office/dev/add-ins/develop/understanding-the-javascript-api-for-office)

## 📄 License

MIT License - Feel free to modify and use as needed!

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

**Note:** This add-in uses the Google Gemini API. Check Google AI Studio for any usage limits or costs.
