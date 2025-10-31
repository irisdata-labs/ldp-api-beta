/**
 * Lunar Landing Site API - Beta User Onboarding Automation
 * 
 * This script automatically:
 * 1. Generates unique API keys for new beta signups
 * 2. Sends welcome emails with API keys and onboarding instructions
 * 3. Logs API keys in the response spreadsheet
 * 
 * Setup Instructions:
 * 1. Open your Google Form
 * 2. Go to "Responses" tab
 * 3. Click the green Sheets icon to create a linked spreadsheet
 * 4. In the spreadsheet: Extensions → Apps Script
 * 5. Delete any existing code and paste this script
 * 6. Click "Save" (disk icon)
 * 7. Run "setup" function once to grant permissions
 * 8. Set up trigger: Click clock icon → Add Trigger → Choose "onFormSubmit" → Save
 */

// ============================================
// CONFIGURATION - CUSTOMIZE THESE SETTINGS
// ============================================

const CONFIG = {
  // Your API base URL
  API_BASE_URL: 'https://api.lunarlanding.space',
  
  // Email settings
  FROM_NAME: 'Lunar Landing API Team',
  
  // Column indices in the spreadsheet (0-based, adjust if your columns are different)
  COLUMNS: {
    TIMESTAMP: 0,
    EMAIL: 1,
    NAME: 2,
    ORGANIZATION: 3,
    ROLE: 4,
    USE_CASE: 5,
    SOURCE: 6,
    API_KEY: 7,        // We'll add this column
    EMAIL_SENT: 8      // We'll add this column
  }
};

// ============================================
// MAIN FUNCTION - Triggers on Form Submit
// ============================================

/**
 * This function runs automatically when someone submits the form
 */
function onFormSubmit(e) {
  try {
    Logger.log('Form submission detected!');
    
    // Get the spreadsheet and the row that was just added
    const sheet = e.range.getSheet();
    const row = e.range.getRow();
    
    // Extract user information
    const userData = {
      timestamp: e.values[CONFIG.COLUMNS.TIMESTAMP],
      email: e.values[CONFIG.COLUMNS.EMAIL],
      name: e.values[CONFIG.COLUMNS.NAME],
      organization: e.values[CONFIG.COLUMNS.ORGANIZATION] || 'Independent',
      role: e.values[CONFIG.COLUMNS.ROLE],
      useCase: e.values[CONFIG.COLUMNS.USE_CASE] || 'Not specified',
      source: e.values[CONFIG.COLUMNS.SOURCE] || 'Not specified'
    };
    
    Logger.log('New beta user: ' + userData.email);
    
    // Check if API key already exists for this row
    const existingKey = sheet.getRange(row, CONFIG.COLUMNS.API_KEY + 1).getValue();
    if (existingKey) {
      Logger.log('API key already exists for this user. Skipping.');
      return;
    }
    
    // Generate unique API key
    const apiKey = generateApiKey();
    Logger.log('Generated API key: ' + apiKey);
    
    // Store API key in spreadsheet
    sheet.getRange(row, CONFIG.COLUMNS.API_KEY + 1).setValue(apiKey);
    
    // Send welcome email
    const emailSent = sendWelcomeEmail(userData, apiKey);
    
    // Mark email as sent
    sheet.getRange(row, CONFIG.COLUMNS.EMAIL_SENT + 1).setValue(emailSent ? 'Yes' : 'Failed');
    
    if (emailSent) {
      Logger.log('✅ Beta onboarding completed for: ' + userData.email);
    } else {
      Logger.log('⚠️ Email failed to send for: ' + userData.email);
    }
    
  } catch (error) {
    Logger.log('❌ Error in onFormSubmit: ' + error.toString());
    
    // Optionally send error notification to admin
    // MailApp.sendEmail('admin@yourdomain.com', 'Beta Signup Error', error.toString());
  }
}

// ============================================
// API KEY GENERATION
// ============================================

/**
 * Generates a secure, unique API key
 * Format: ldp_live_[32 random characters]
 */
function generateApiKey() {
  const prefix = 'ldp_live_';
  const randomPart = Utilities.getUuid().replace(/-/g, '');
  return prefix + randomPart;
}

// ============================================
// EMAIL SENDING
// ============================================

/**
 * Sends welcome email with API key and onboarding instructions
 */
function sendWelcomeEmail(userData, apiKey) {
  try {
    const subject = '🌙 Welcome to Lunar Landing API Beta - Your API Key Inside';
    const htmlBody = createEmailTemplate(userData, apiKey);
    
    // Send HTML email
    MailApp.sendEmail({
      to: userData.email,
      subject: subject,
      htmlBody: htmlBody,
      name: CONFIG.FROM_NAME
    });
    
    Logger.log('Email sent successfully to: ' + userData.email);
    return true;
    
  } catch (error) {
    Logger.log('Failed to send email: ' + error.toString());
    return false;
  }
}

/**
 * Creates the HTML email template
 */
function createEmailTemplate(userData, apiKey) {
  const firstName = userData.name.split(' ')[0];
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { margin: 0; font-size: 28px; }
    .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
    .api-key-box { background: #f8f9fa; border: 2px solid #4CAF50; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    .api-key { font-family: 'Courier New', monospace; font-size: 16px; font-weight: bold; color: #2e7d32; word-break: break-all; background: #e8f5e9; padding: 10px; border-radius: 4px; }
    .code-block { background: #0a0e27; color: #e0e0e0; padding: 20px; border-radius: 8px; overflow-x: auto; font-family: 'Courier New', monospace; font-size: 14px; }
    .code-comment { color: #4CAF50; }
    .btn { display: inline-block; background: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
    ul { padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌙 Welcome to Lunar Landing API</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">Your beta access is ready!</p>
    </div>
    
    <div class="content">
      <p>Hi ${firstName},</p>
      
      <p>Thank you for joining the Lunar Landing Site API beta program! We're excited to have you as part of our early community of lunar mission planners, researchers, and space enthusiasts.</p>
      
      <h2>🔑 Your API Key</h2>
      <div class="api-key-box">
        <p style="margin: 0 0 10px 0; font-weight: 600;">Your Personal API Key:</p>
        <div class="api-key">${apiKey}</div>
        <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">⚠️ Keep this secure - don't share it publicly</p>
      </div>
      
      <div class="warning">
        <strong>Important:</strong> Treat your API key like a password. Never commit it to public repositories or share it in forums. Store it in environment variables.
      </div>
      
      <h2>🚀 Quick Start Guide</h2>
      <p>Get started in 60 seconds:</p>
      
      <h3>1. Make Your First API Call</h3>
      <div class="code-block">
<span class="code-comment"># Find top 5 landing sites near lunar south pole</span>
import requests

response = requests.get(
    "${CONFIG.API_BASE_URL}/api/v1/recommendations",
    headers={"X-API-Key": "${apiKey}"},
    params={
        "lat": -89.5,
        "lon": 0,
        "mission_type": "artemis",
        "top_n": 5
    }
)

print(response.json())
      </div>
      
      <h3>2. Explore the API</h3>
      <p>Our interactive documentation has everything you need:</p>
      <ul>
        <li><strong>Interactive Docs:</strong> <a href="${CONFIG.API_BASE_URL}/docs">${CONFIG.API_BASE_URL}/docs</a></li>
        <li><strong>All Endpoints:</strong> Site search, recommendations, statistics, and exports</li>
        <li><strong>Code Examples:</strong> Python, JavaScript, cURL, and more</li>
        <li><strong>Data Dictionary:</strong> Full description of all 60+ features</li>
      </ul>
      
      <a href="${CONFIG.API_BASE_URL}/docs" class="btn">📖 View API Documentation</a>
      
      <h2>💡 What You Can Do</h2>
      <ul>
        <li><strong>Search 1.18M Sites:</strong> Query by location, terrain, illumination, and more</li>
        <li><strong>Get AI Recommendations:</strong> Mission-specific site suggestions with reasoning</li>
        <li><strong>Export Data:</strong> Download as GeoJSON, KML, or CSV for GIS tools</li>
        <li><strong>Analyze Terrain:</strong> Access 60+ features per site (slope, roughness, illumination, etc.)</li>
      </ul>
      
      <h2>📊 Beta Program Details</h2>
      <p><strong>Your Use Case:</strong> ${userData.useCase}</p>
      <p><strong>Rate Limits:</strong> 100 requests/day (plenty for testing and development)</p>
      <p><strong>Support:</strong> Reply to this email or contact <a href="mailto:info@irisdatalabs.com">info@irisdatalabs.com</a></p>
      
      <h2>🤝 Help Us Improve</h2>
      <p>As a beta user, your feedback is invaluable! Please let us know:</p>
      <ul>
        <li>What features you'd like to see</li>
        <li>Any bugs or issues you encounter</li>
        <li>How the API fits into your workflow</li>
        <li>Documentation improvements</li>
      </ul>
      
      <h2>📚 Helpful Resources</h2>
      <ul>
        <li><strong>Tutorial:</strong> <a href="${CONFIG.API_BASE_URL}/docs/tutorial">Getting Started Guide</a></li>
        <li><strong>Examples:</strong> <a href="${CONFIG.API_BASE_URL}/docs/examples">Real-world use cases</a></li>
        <li><strong>Data Sources:</strong> NASA LOLA (terrain) + LROC (illumination)</li>
      </ul>
      
      <p style="margin-top: 30px;">Ready to find the perfect lunar landing site? Start exploring now!</p>
      
      <a href="${CONFIG.API_BASE_URL}/docs" class="btn">🌙 Start Using the API</a>
      
      <p style="margin-top: 30px;">Best regards,<br>
      <strong>The Lunar Landing API Team</strong><br>
      Iris Data Labs</p>
    </div>
    
    <div class="footer">
      <p>🌙 Lunar Landing Site API - Beta Program</p>
      <p style="font-size: 12px; color: #999;">Built with data from NASA Lunar Reconnaissance Orbiter</p>
      <p style="font-size: 12px; margin-top: 15px;">
        Questions? Reply to this email or contact <a href="mailto:info@irisdatalabs.com">info@irisdatalabs.com</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}

// ============================================
// SETUP FUNCTIONS 
// ============================================

/**
 * One-time setup function
 * Run this manually once to:
 * 1. Add API Key and Email Sent columns
 * 2. Test email sending
 */
function setup() {
  Logger.log('🔧 Running initial setup...');
  
  try {
    // Get the active spreadsheet (your form responses)
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0];
    
    // Add headers if they don't exist
    const lastCol = sheet.getLastColumn();
    
    // Add "API Key" column if not exists
    const apiKeyHeader = sheet.getRange(1, CONFIG.COLUMNS.API_KEY + 1).getValue();
    if (!apiKeyHeader) {
      sheet.getRange(1, CONFIG.COLUMNS.API_KEY + 1).setValue('API Key');
      Logger.log('✅ Added "API Key" column');
    }
    
    // Add "Email Sent" column if not exists
    const emailSentHeader = sheet.getRange(1, CONFIG.COLUMNS.EMAIL_SENT + 1).getValue();
    if (!emailSentHeader) {
      sheet.getRange(1, CONFIG.COLUMNS.EMAIL_SENT + 1).setValue('Email Sent');
      Logger.log('✅ Added "Email Sent" column');
    }
    
    Logger.log('✅ Setup completed successfully!');
    Logger.log('Next steps:');
    Logger.log('1. Set up the form submit trigger (see instructions at top of script)');
    Logger.log('2. Test by submitting your form');
    
  } catch (error) {
    Logger.log('❌ Setup error: ' + error.toString());
  }
}

/**
 * Test the email template with sample data
 * Run this to preview what the email will look like
 */
function testEmail() {
  const testUser = {
    email: 'your-email@example.com',  // CHANGE THIS to your email
    name: 'Test User',
    organization: 'Test Organization',
    role: 'Developer',
    useCase: 'Testing the email system'
  };
  
  const testApiKey = 'ldp_test_1234567890abcdef1234567890abcdef';
  
  Logger.log('📧 Sending test email to: ' + testUser.email);
  const sent = sendWelcomeEmail(testUser, testApiKey);
  
  if (sent) {
    Logger.log('✅ Test email sent! Check your inbox.');
  } else {
    Logger.log('❌ Test email failed to send.');
  }
}

/**
 * Process any existing form responses that don't have API keys yet
 * Useful if you're adding this to an existing form with responses
 */
function processExistingResponses() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  const lastRow = sheet.getLastRow();
  
  Logger.log('Processing existing responses...');
  
  let processed = 0;
  
  // Start from row 2 (skip header)
  for (let row = 2; row <= lastRow; row++) {
    const apiKey = sheet.getRange(row, CONFIG.COLUMNS.API_KEY + 1).getValue();
    
    // If no API key exists, process this response
    if (!apiKey) {
      const userData = {
        email: sheet.getRange(row, CONFIG.COLUMNS.EMAIL + 1).getValue(),
        name: sheet.getRange(row, CONFIG.COLUMNS.NAME + 1).getValue(),
        organization: sheet.getRange(row, CONFIG.COLUMNS.ORGANIZATION + 1).getValue() || 'Independent',
        role: sheet.getRange(row, CONFIG.COLUMNS.ROLE + 1).getValue(),
        useCase: sheet.getRange(row, CONFIG.COLUMNS.USE_CASE + 1).getValue() || 'Not specified',
        source: sheet.getRange(row, CONFIG.COLUMNS.SOURCE + 1).getValue() || 'Not specified'
      };
      
      // Generate and store API key
      const newApiKey = generateApiKey();
      sheet.getRange(row, CONFIG.COLUMNS.API_KEY + 1).setValue(newApiKey);
      
      // Send email
      const emailSent = sendWelcomeEmail(userData, newApiKey);
      sheet.getRange(row, CONFIG.COLUMNS.EMAIL_SENT + 1).setValue(emailSent ? 'Yes' : 'Failed');
      
      processed++;
      Logger.log(`Processed: ${userData.email}`);
      
      // Add small delay to avoid rate limiting
      Utilities.sleep(1000);
    }
  }
  
  Logger.log(`✅ Processed ${processed} existing responses`);
}
