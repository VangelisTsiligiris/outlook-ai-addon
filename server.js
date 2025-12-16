const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY not found in environment variables');
    console.log('Please create a .env file with your API key');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || 'dummy-key');

// Helper function to call Gemini API
async function callGeminiAPI(prompt, systemPrompt = '') {
    try {
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-2.0-flash-exp',
            systemInstruction: systemPrompt
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
}

// API Endpoints

// 1. Summarize email
app.post('/api/summarize', async (req, res) => {
    try {
        const { subject, body } = req.body;
        
        const prompt = `Please provide a concise summary of this email:

Subject: ${subject}

Body:
${body}

Provide a 2-3 sentence summary highlighting the key points.`;

        const summary = await callGeminiAPI(
            prompt,
            'You are an expert email assistant. Provide clear, concise summaries of emails.'
        );
        
        res.json({ summary });
    } catch (error) {
        console.error('Summarize error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 2. Extract action items
app.post('/api/extract-actions', async (req, res) => {
    try {
        const { subject, body } = req.body;
        
        const prompt = `Extract all action items from this email:

Subject: ${subject}

Body:
${body}

List each action item as a separate bullet point. If there are no clear action items, respond with "No action items found."`;

        const actionsText = await callGeminiAPI(
            prompt,
            'You are an expert at identifying action items and tasks in emails. Be specific and actionable.'
        );
        
        // Parse the actions into an array
        const actions = actionsText
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[•\-*]\s*/, '').trim())
            .filter(line => line.length > 0);
        
        res.json({ actions });
    } catch (error) {
        console.error('Extract actions error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Draft email
app.post('/api/draft', async (req, res) => {
    try {
        const { instructions, tone } = req.body;
        
        const prompt = `Write an email with a ${tone} tone based on these instructions:

${instructions}

Write a complete email including appropriate greeting and sign-off.`;

        const draft = await callGeminiAPI(
            prompt,
            `You are an expert email writer. Write clear, professional emails in the specified tone. Keep emails concise but complete.`
        );
        
        res.json({ draft });
    } catch (error) {
        console.error('Draft error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. Improve email
app.post('/api/improve', async (req, res) => {
    try {
        const { content } = req.body;
        
        const prompt = `Improve this email draft by making it clearer, more concise, and more professional while maintaining the original intent:

${content}

Provide the improved version.`;

        const improved = await callGeminiAPI(
            prompt,
            'You are an expert editor. Improve emails for clarity, professionalism, and conciseness. Fix grammar and style issues.'
        );
        
        res.json({ improved });
    } catch (error) {
        console.error('Improve error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 5. Generate quick reply
app.post('/api/quick-reply', async (req, res) => {
    try {
        const { subject, body } = req.body;
        
        const prompt = `Generate a professional reply to this email:

Subject: ${subject}

Body:
${body}

Write a brief, appropriate reply.`;

        const reply = await callGeminiAPI(
            prompt,
            'You are an expert at writing professional email replies. Keep responses concise and appropriate.'
        );
        
        res.json({ reply });
    } catch (error) {
        console.error('Quick reply error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        apiKeyConfigured: !!GEMINI_API_KEY 
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log(`API Key configured: ${!!GEMINI_API_KEY}`);
    if (!GEMINI_API_KEY) {
        console.log('\n⚠️  WARNING: No API key found. Add GEMINI_API_KEY to your .env file\n');
    }
});
