# 🧪 Localhost Testing Setup Guide

This guide will help you set up all platform integrations for testing on `localhost:5173` using ngrok for webhook testing.

## 🔧 Prerequisites

### 1. Install Required Tools

```bash
# Install ngrok for webhook testing
npm install -g ngrok

# Or download from https://ngrok.com/download
```

### 2. Set Up Ngrok

```bash
# Sign up at https://ngrok.com and get your auth token
ngrok config add-authtoken YOUR_NGROK_AUTH_TOKEN

# Start ngrok tunnel (keep this running during development)
ngrok http 5173
```

**Important:** Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`) - you'll use this for all webhook URLs.

---

## 🔵 Facebook/Instagram Setup for Localhost

### 1. Create Test App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app → **Business** type
3. **App Name:** "CRM Test App Local"
4. Add your test Facebook page

### 2. Configure OAuth Redirect URLs

**In Facebook App Settings → Basic:**
- **App Domains:** `localhost`
- **Site URL:** `http://localhost:5173`

**In Facebook Login → Settings:**
- **Valid OAuth Redirect URIs:**
  ```
  http://localhost:5173/auth/facebook/callback
  https://your-ngrok-url.ngrok.io/auth/facebook/callback
  ```

### 3. Configure Webhooks

**In Webhooks → Page Subscriptions:**
- **Callback URL:** `https://your-ngrok-url.ngrok.io/api/webhooks/facebook`
- **Verify Token:** `fb_verify_token_local_123`
- **Subscription Fields:** `leadgen`

### 4. Test Configuration

```javascript
// Test Facebook OAuth
const testFacebookAuth = () => {
  const clientId = import.meta.env.VITE_FACEBOOK_APP_ID;
  const redirectUri = `${window.location.origin}/auth/facebook/callback`;
  const scope = 'leads_retrieval,pages_read_engagement';
  
  window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
};
```

---

## 🔴 Google Ads Setup for Localhost

### 1. Create Test OAuth Client

**In Google Cloud Console → APIs & Services → Credentials:**
- **Application Type:** Web application
- **Name:** "CRM Local Test"
- **Authorized JavaScript origins:**
  ```
  http://localhost:5173
  https://your-ngrok-url.ngrok.io
  ```
- **Authorized redirect URIs:**
  ```
  http://localhost:5173/auth/google/callback
  https://your-ngrok-url.ngrok.io/auth/google/callback
  ```

### 2. Configure Webhook

**For Lead Form Extensions:**
- **Webhook URL:** `https://your-ngrok-url.ngrok.io/api/webhooks/google-ads`
- **Secret:** `google_webhook_secret_local`

### 3. Test Configuration

```javascript
// Test Google OAuth
const testGoogleAuth = () => {
  const clientId = import.meta.env.VITE_GOOGLE_ADS_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/google/callback`;
  const scope = 'https://www.googleapis.com/auth/adwords';
  
  window.location.href = `https://accounts.google.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
};
```

---

## 🔵 LinkedIn Setup for Localhost

### 1. Configure LinkedIn App

**In LinkedIn Developer Console → Auth:**
- **Redirect URLs:**
  ```
  http://localhost:5173/auth/linkedin/callback
  https://your-ngrok-url.ngrok.io/auth/linkedin/callback
  ```

### 2. Test Configuration

```javascript
// Test LinkedIn OAuth
const testLinkedInAuth = () => {
  const clientId = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
  const scope = 'r_ads_leadgen_automation,r_ads';
  
  window.location.href = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
};
```

---

## 💚 WhatsApp Business Setup for Localhost

### 1. Configure Webhook

**In Meta for Developers → WhatsApp → Configuration:**
- **Webhook URL:** `https://your-ngrok-url.ngrok.io/api/webhooks/whatsapp`
- **Verify Token:** `wa_verify_token_local_456`
- **Webhook Fields:** `messages`, `message_deliveries`

### 2. Test Message Templates

Create test templates for local development:

```javascript
// Test WhatsApp template
const testWhatsAppTemplate = {
  name: "welcome_test",
  language: { code: "en" },
  components: [
    {
      type: "body",
      parameters: [
        { type: "text", text: "John Doe" }
      ]
    }
  ]
};
```

---

## 💰 Razorpay Setup for Localhost

### 1. Use Test Mode Keys

- Always use `rzp_test_` keys for localhost
- **Webhook URL:** `https://your-ngrok-url.ngrok.io/api/webhooks/razorpay`
- **Secret:** `razorpay_webhook_secret_local`

### 2. Test Payment Flow

```javascript
// Test Razorpay integration
const testRazorpayPayment = () => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: 2999, // ₹29.99
    currency: 'INR',
    name: 'CRM Test',
    description: 'Test Payment',
    handler: function(response) {
      console.log('Payment successful:', response);
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
};
```

---

## 🔧 Webhook Handler Implementation

Create webhook handlers for all platforms:

### 1. Create Webhook Router

```javascript
// src/api/webhooks/index.js
import express from 'express';
import { handleFacebookWebhook } from './facebook.js';
import { handleGoogleAdsWebhook } from './google-ads.js';
import { handleWhatsAppWebhook } from './whatsapp.js';
import { handleRazorpayWebhook } from './razorpay.js';

const router = express.Router();

// Facebook/Instagram webhooks
router.get('/facebook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    console.log('Facebook webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post('/facebook', handleFacebookWebhook);

// Google Ads webhooks
router.post('/google-ads', handleGoogleAdsWebhook);

// WhatsApp webhooks
router.get('/whatsapp', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post('/whatsapp', handleWhatsAppWebhook);

// Razorpay webhooks
router.post('/razorpay', handleRazorpayWebhook);

export default router;
```

### 2. Facebook Webhook Handler

```javascript
// src/api/webhooks/facebook.js
export const handleFacebookWebhook = async (req, res) => {
  try {
    const body = req.body;
    
    if (body.object === 'page') {
      body.entry.forEach(entry => {
        entry.changes.forEach(change => {
          if (change.field === 'leadgen') {
            const leadgenId = change.value.leadgen_id;
            const formId = change.value.form_id;
            const pageId = change.value.page_id;
            
            console.log('New Facebook lead:', { leadgenId, formId, pageId });
            
            // Process the lead
            processFacebookLead(leadgenId, formId, pageId);
          }
        });
      });
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Facebook webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
};

const processFacebookLead = async (leadgenId, formId, pageId) => {
  // Fetch lead details from Facebook API
  // Save to database
  // Trigger WhatsApp automation
  console.log('Processing Facebook lead:', leadgenId);
};
```

### 3. WhatsApp Webhook Handler

```javascript
// src/api/webhooks/whatsapp.js
export const handleWhatsAppWebhook = async (req, res) => {
  try {
    const body = req.body;
    
    if (body.entry) {
      body.entry.forEach(entry => {
        entry.changes.forEach(change => {
          if (change.field === 'messages') {
            const messages = change.value.messages;
            const statuses = change.value.statuses;
            
            if (messages) {
              messages.forEach(message => {
                console.log('WhatsApp message received:', message);
                // Process incoming message
              });
            }
            
            if (statuses) {
              statuses.forEach(status => {
                console.log('WhatsApp status update:', status);
                // Update message delivery status
              });
            }
          }
        });
      });
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
};
```

---

## 🧪 Testing Workflow

### 1. Start Development Environment

```bash
# Terminal 1: Start ngrok
ngrok http 5173

# Terminal 2: Start development server
npm run dev

# Terminal 3: Start webhook server (if separate)
npm run webhook-server
```

### 2. Test Each Integration

#### Facebook/Instagram Test:
1. Create a test lead ad on Facebook
2. Submit a test lead
3. Check ngrok logs for webhook calls
4. Verify lead appears in your CRM

#### Google Ads Test:
1. Create a test lead form extension
2. Submit a test lead
3. Check webhook delivery
4. Verify data processing

#### WhatsApp Test:
1. Send a test template message
2. Check delivery status via webhook
3. Test incoming message handling

#### Razorpay Test:
1. Create a test payment
2. Complete payment flow
3. Verify webhook notification
4. Check payment status update

### 3. Debug Common Issues

```javascript
// Add debug logging to all webhook handlers
const debugWebhook = (platform, data) => {
  console.log(`[${platform}] Webhook received:`, {
    timestamp: new Date().toISOString(),
    headers: req.headers,
    body: data,
    ngrokUrl: process.env.VITE_WEBHOOK_BASE_URL
  });
};
```

---

## 🔄 Environment Switching

### 1. Local Development (.env.local)

```bash
VITE_APP_ENV=local
VITE_BASE_URL=http://localhost:5173
VITE_WEBHOOK_BASE_URL=https://your-ngrok-url.ngrok.io
```

### 2. Vercel Preview (.env.preview)

```bash
VITE_APP_ENV=preview
VITE_BASE_URL=https://your-preview-url.vercel.app
VITE_WEBHOOK_BASE_URL=https://your-preview-url.vercel.app
```

### 3. Production (.env.production)

```bash
VITE_APP_ENV=production
VITE_BASE_URL=https://your-domain.com
VITE_WEBHOOK_BASE_URL=https://your-domain.com
```

---

## 📱 Mobile Testing

### 1. Expose Local Server to Mobile

```bash
# Use ngrok for mobile testing
ngrok http 5173 --host-header=localhost:5173

# Or use your local IP
# Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
# Access via: http://192.168.1.100:5173
```

### 2. Test OAuth Flows on Mobile

- WhatsApp Business API works best on mobile
- Test Facebook/Instagram login flows
- Verify responsive design

---

## 🚨 Security Considerations for Testing

### 1. Webhook Security

```javascript
// Verify webhook signatures
const verifyWebhookSignature = (payload, signature, secret) => {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};
```

### 2. Environment Variables

- Never commit `.env` files
- Use different secrets for each environment
- Rotate tokens regularly

### 3. CORS Configuration

```javascript
// Configure CORS for local development
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://your-ngrok-url.ngrok.io'
  ],
  credentials: true
};
```

---

## 📋 Testing Checklist

### Before Testing:
- [ ] Ngrok tunnel is running
- [ ] All environment variables are set
- [ ] Webhook URLs are updated in all platforms
- [ ] Test credentials are configured

### During Testing:
- [ ] Facebook lead ads webhook working
- [ ] Google Ads lead forms webhook working
- [ ] WhatsApp message sending working
- [ ] WhatsApp status updates received
- [ ] Razorpay payments processing
- [ ] OAuth flows completing successfully

### After Testing:
- [ ] All test data cleaned up
- [ ] Webhook logs reviewed
- [ ] Error handling tested
- [ ] Performance metrics checked

---

## 🔧 Troubleshooting

### Common Issues:

1. **Ngrok URL Changes:**
   - Update all webhook URLs when ngrok restarts
   - Use ngrok auth token for persistent URLs

2. **CORS Errors:**
   - Add localhost and ngrok URLs to CORS whitelist
   - Check browser developer tools

3. **Webhook Verification Fails:**
   - Verify tokens match exactly
   - Check URL formatting

4. **OAuth Redirects Fail:**
   - Ensure redirect URLs are exactly configured
   - Check for trailing slashes

This setup will allow you to test all platform integrations locally before deploying to Vercel! 