// API endpoint - change this to your deployed backend URL
const API_BASE_URL = 'https://outlook-ai-addon.onrender.com/api';

let currentMailItem = null;

Office.onReady((info) => {
    if (info.host === Office.HostType.Outlook) {
        currentMailItem = Office.context.mailbox.item;
        
        // Set up event listeners
        document.getElementById('summarizeBtn').onclick = summarizeEmail;
        document.getElementById('extractActionsBtn').onclick = extractActions;
        document.getElementById('draftBtn').onclick = draftEmail;
        document.getElementById('improveBtn').onclick = improveEmail;
        document.getElementById('quickReplyBtn').onclick = generateQuickReply;
        
        console.log('AI Email Assistant loaded successfully');
    }
});

// Helper functions
function showLoading() {
    document.getElementById('loading').classList.add('show');
    document.getElementById('error').classList.remove('show');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('show');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    hideLoading();
}

function showResult(elementId, content) {
    const resultDiv = document.getElementById(elementId);
    resultDiv.innerHTML = content;
    resultDiv.classList.add('show');
    hideLoading();
}

// Get email body content
async function getEmailBody() {
    return new Promise((resolve, reject) => {
        currentMailItem.body.getAsync(Office.CoercionType.Text, (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                resolve(result.value);
            } else {
                reject(result.error);
            }
        });
    });
}

// Get email subject
function getEmailSubject() {
    return currentMailItem.subject;
}

// Set email body (for compose mode)
async function setEmailBody(content) {
    return new Promise((resolve, reject) => {
        currentMailItem.body.setAsync(content, { coercionType: Office.CoercionType.Html }, (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
                resolve();
            } else {
                reject(result.error);
            }
        });
    });
}

// Summarize email
async function summarizeEmail() {
    try {
        showLoading();
        const emailBody = await getEmailBody();
        const subject = getEmailSubject();
        
        const response = await fetch(`${API_BASE_URL}/summarize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: subject,
                body: emailBody
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to summarize email');
        }
        
        const data = await response.json();
        showResult('summaryResult', `<strong>Summary:</strong><br>${data.summary.replace(/\n/g, '<br>')}`);
    } catch (error) {
        showError('Error summarizing email: ' + error.message);
    }
}

// Extract action items
async function extractActions() {
    try {
        showLoading();
        const emailBody = await getEmailBody();
        const subject = getEmailSubject();
        
        const response = await fetch(`${API_BASE_URL}/extract-actions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: subject,
                body: emailBody
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to extract actions');
        }
        
        const data = await response.json();
        const actionsList = data.actions.map(action => `• ${action}`).join('<br>');
        showResult('summaryResult', `<strong>Action Items:</strong><br>${actionsList || 'No action items found.'}`);
    } catch (error) {
        showError('Error extracting actions: ' + error.message);
    }
}

// Draft email
async function draftEmail() {
    try {
        showLoading();
        const draftInput = document.getElementById('draftInput').value;
        const tone = document.getElementById('toneSelect').value;
        
        if (!draftInput) {
            showError('Please enter what you want to say');
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/draft`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                instructions: draftInput,
                tone: tone
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to draft email');
        }
        
        const data = await response.json();
        showResult('draftResult', `
            <strong>Generated Email:</strong><br><br>
            <div style="white-space: pre-wrap; font-family: monospace; background: white; padding: 10px; border-radius: 4px;">
                ${data.draft.replace(/\n/g, '<br>')}
            </div>
            <br>
            <button onclick="insertDraft('${encodeURIComponent(data.draft)}')">Insert into Email</button>
        `);
    } catch (error) {
        showError('Error drafting email: ' + error.message);
    }
}

// Improve current email draft
async function improveEmail() {
    try {
        showLoading();
        const emailBody = await getEmailBody();
        
        if (!emailBody || emailBody.trim().length === 0) {
            showError('No email content to improve. Please write a draft first.');
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/improve`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: emailBody
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to improve email');
        }
        
        const data = await response.json();
        showResult('draftResult', `
            <strong>Improved Version:</strong><br><br>
            <div style="white-space: pre-wrap; font-family: monospace; background: white; padding: 10px; border-radius: 4px;">
                ${data.improved.replace(/\n/g, '<br>')}
            </div>
            <br>
            <button onclick="insertDraft('${encodeURIComponent(data.improved)}')">Replace Email with This</button>
        `);
    } catch (error) {
        showError('Error improving email: ' + error.message);
    }
}

// Generate quick reply
async function generateQuickReply() {
    try {
        showLoading();
        const emailBody = await getEmailBody();
        const subject = getEmailSubject();
        
        const response = await fetch(`${API_BASE_URL}/quick-reply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subject: subject,
                body: emailBody
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to generate reply');
        }
        
        const data = await response.json();
        showResult('replyResult', `
            <strong>Suggested Reply:</strong><br><br>
            <div style="white-space: pre-wrap; font-family: monospace; background: white; padding: 10px; border-radius: 4px;">
                ${data.reply.replace(/\n/g, '<br>')}
            </div>
            <br>
            <button onclick="insertReply('${encodeURIComponent(data.reply)}')">Use This Reply</button>
        `);
    } catch (error) {
        showError('Error generating reply: ' + error.message);
    }
}

// Insert draft into email body
window.insertDraft = async function(encodedContent) {
    try {
        const content = decodeURIComponent(encodedContent);
        await setEmailBody(content.replace(/\n/g, '<br>'));
        showResult('draftResult', '<strong>✓ Inserted into email!</strong>');
    } catch (error) {
        showError('Error inserting content: ' + error.message);
    }
};

// Insert reply (for read mode, this would open a reply window)
window.insertReply = async function(encodedContent) {
    try {
        const content = decodeURIComponent(encodedContent);
        
        // If in compose mode, insert directly
        if (currentMailItem.itemType === Office.MailboxEnums.ItemType.Message && 
            currentMailItem.body) {
            await setEmailBody(content.replace(/\n/g, '<br>'));
            showResult('replyResult', '<strong>✓ Reply inserted!</strong>');
        } else {
            // In read mode, display reply for user to copy
            navigator.clipboard.writeText(content);
            showResult('replyResult', '<strong>✓ Reply copied to clipboard! Click Reply in Outlook and paste.</strong>');
        }
    } catch (error) {
        showError('Error inserting reply: ' + error.message);
    }
};
