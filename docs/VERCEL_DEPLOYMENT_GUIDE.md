# 🚀 Vercel Deployment Guide

This guide will help you deploy your CRM application to Vercel with all platform integrations properly configured.

## 📋 Prerequisites

- [Vercel account](https://vercel.com/signup)
- [Vercel CLI](https://vercel.com/cli) installed
- All API credentials from platform setup
- GitHub repository with your code

## 🔧 Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## 🔐 Step 2: Login to Vercel

```bash
vercel login
```

## 📁 Step 3: Project Setup

### Initialize Vercel Project

```bash
# In your project root
vercel

# Follow the prompts:
# ? Set up and deploy "~/your-project"? [Y/n] y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] n
# ? What's your project's name? crm-saas
# ? In which directory is your code located? ./
```

### Configure Build Settings

Create `vercel.json` in your project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "functions": {
    "src/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

## 🌍 Step 4: Environment Variables

### Set Environment Variables via CLI

```bash
# Database
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Facebook/Instagram
vercel env add VITE_FACEBOOK_APP_ID
vercel env add FACEBOOK_APP_SECRET
vercel env add FACEBOOK_VERIFY_TOKEN
vercel env add FACEBOOK_ACCESS_TOKEN

# Google Ads
vercel env add VITE_GOOGLE_ADS_CLIENT_ID
vercel env add GOOGLE_ADS_CLIENT_SECRET
vercel env add GOOGLE_ADS_DEVELOPER_TOKEN
vercel env add GOOGLE_ADS_WEBHOOK_SECRET

# LinkedIn
vercel env add VITE_LINKEDIN_CLIENT_ID
vercel env add LINKEDIN_CLIENT_SECRET

# WhatsApp Business
vercel env add WHATSAPP_ACCESS_TOKEN
vercel env add WHATSAPP_PHONE_NUMBER_ID
vercel env add WHATSAPP_WABA_ID
vercel env add WHATSAPP_VERIFY_TOKEN
vercel env add WHATSAPP_API_VERSION

# Razorpay
vercel env add VITE_RAZORPAY_KEY_ID
vercel env add RAZORPAY_KEY_SECRET
vercel env add RAZORPAY_WEBHOOK_SECRET

# Security
vercel env add JWT_SECRET
vercel env add ENCRYPTION_KEY
```

### Or Set via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all the variables listed above

### Environment Variables Template

```bash
# Production Environment Variables for Vercel

# Database (Supabase)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Facebook/Instagram
VITE_FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_VERIFY_TOKEN=fb_verify_token_prod_xyz123
FACEBOOK_ACCESS_TOKEN=your_long_lived_access_token

# Google Ads
VITE_GOOGLE_ADS_CLIENT_ID=your_google_client_id
GOOGLE_ADS_CLIENT_SECRET=your_google_client_secret
GOOGLE_ADS_DEVELOPER_TOKEN=your_google_developer_token
GOOGLE_ADS_WEBHOOK_SECRET=google_webhook_secret_prod_abc456

# LinkedIn
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# WhatsApp Business
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_WABA_ID=your_business_account_id
WHATSAPP_VERIFY_TOKEN=wa_verify_token_prod_def789
WHATSAPP_API_VERSION=18.0

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=razorpay_webhook_secret_prod_ghi012

# Security
JWT_SECRET=your_very_long_and_secure_jwt_secret_key
ENCRYPTION_KEY=your_32_character_encryption_key
```

## 🔗 Step 5: Update Platform Webhook URLs

After deployment, you'll get a Vercel URL (e.g., `https://your-app.vercel.app`). Update all platform webhook URLs:

### Facebook/Instagram
- **Webhook URL:** `https://your-app.vercel.app/api/webhooks/facebook`
- **Valid OAuth Redirect URIs:** `https://your-app.vercel.app/auth/facebook/callback`

### WhatsApp Business
- **Webhook URL:** `https://your-app.vercel.app/api/webhooks/whatsapp`

### Google Ads
- **Webhook URL:** `https://your-app.vercel.app/api/webhooks/google-ads`
- **Authorized redirect URIs:** `https://your-app.vercel.app/auth/google/callback`

### LinkedIn
- **Redirect URLs:** `https://your-app.vercel.app/auth/linkedin/callback`

### Razorpay
- **Webhook URL:** `https://your-app.vercel.app/api/webhooks/razorpay`

## 🚀 Step 6: Deploy

```bash
# Deploy to production
vercel --prod

# Or push to main branch if connected to GitHub
git push origin main
```

## 🔄 Step 7: Custom Domain (Optional)

### Add Custom Domain

```bash
vercel domains add yourdomain.com
```

### Configure DNS

Add these DNS records to your domain provider:

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### Update Platform URLs

After adding custom domain, update all webhook and OAuth URLs to use your custom domain:

- `https://yourdomain.com/api/webhooks/facebook`
- `https://yourdomain.com/auth/facebook/callback`
- etc.

## 📊 Step 8: Monitoring & Analytics

### Enable Vercel Analytics

```bash
npm install @vercel/analytics
```

Add to your main component:

```typescript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* Your app content */}
      <Analytics />
    </>
  );
}
```

### Enable Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

Add to your main component:

```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <>
      {/* Your app content */}
      <SpeedInsights />
    </>
  );
}
```

## 🔧 Step 9: API Routes Configuration

Create API routes in `api/` directory for Vercel Functions:

### `api/webhooks/facebook.js`

```javascript
import { handleFacebookWebhook, verifyFacebookWebhook } from '../../src/api/webhooks/facebook.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return verifyFacebookWebhook(req, res);
  } else if (req.method === 'POST') {
    return handleFacebookWebhook(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### `api/webhooks/whatsapp.js`

```javascript
import { handleWhatsAppWebhook, verifyWhatsAppWebhook } from '../../src/api/webhooks/whatsapp.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return verifyWhatsAppWebhook(req, res);
  } else if (req.method === 'POST') {
    return handleWhatsAppWebhook(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

### `api/webhooks/razorpay.js`

```javascript
import { handleRazorpayWebhook } from '../../src/api/webhooks/razorpay.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleRazorpayWebhook(req, res);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
```

## 🧪 Step 10: Testing Deployment

### Test Webhook Endpoints

```bash
# Test Facebook webhook verification
curl "https://your-app.vercel.app/api/webhooks/facebook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test_challenge"

# Test WhatsApp webhook verification  
curl "https://your-app.vercel.app/api/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test_challenge"

# Test Razorpay webhook
curl -X POST https://your-app.vercel.app/api/webhooks/razorpay \
  -H "Content-Type: application/json" \
  -d '{"event": "payment.captured", "payload": {"payment": {"entity": {"id": "test"}}}}'
```

### Test OAuth Flows

1. Visit your deployed app
2. Go to Admin → Integrations
3. Test each OAuth flow:
   - Facebook/Instagram connection
   - Google Ads connection
   - LinkedIn connection

## 🔒 Step 11: Security Configuration

### Environment-Specific Settings

Create different environment configurations:

```javascript
// src/config/environment.js
const config = {
  development: {
    apiUrl: 'http://localhost:5173/api',
    webhookUrl: process.env.VITE_WEBHOOK_BASE_URL || 'https://your-ngrok-url.ngrok.io'
  },
  preview: {
    apiUrl: `${process.env.VERCEL_URL}/api`,
    webhookUrl: `https://${process.env.VERCEL_URL}`
  },
  production: {
    apiUrl: 'https://yourdomain.com/api',
    webhookUrl: 'https://yourdomain.com'
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

### CORS Configuration

```javascript
// api/_middleware.js
export function middleware(req, res, next) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : '*'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}
```

## 📈 Step 12: Performance Optimization

### Enable Edge Functions

```json
// vercel.json
{
  "functions": {
    "api/webhooks/*.js": {
      "runtime": "edge"
    }
  }
}
```

### Configure Caching

```json
// vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## 🚨 Step 13: Error Monitoring

### Add Error Tracking

```bash
npm install @sentry/react @sentry/tracing
```

Configure Sentry:

```javascript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

## 📋 Step 14: Deployment Checklist

### Pre-Deployment

- [ ] All environment variables set in Vercel
- [ ] Database schema deployed to Supabase
- [ ] All API credentials are production-ready
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate is active

### Post-Deployment

- [ ] All webhook URLs updated in platforms
- [ ] OAuth redirect URLs updated in platforms
- [ ] Test all integrations end-to-end
- [ ] Monitor error logs for 24 hours
- [ ] Set up monitoring and alerts

### Platform-Specific Updates

#### Facebook/Instagram
- [ ] Webhook URL updated to production
- [ ] OAuth redirect URI updated
- [ ] App review submitted (if needed)
- [ ] Test lead capture flow

#### Google Ads
- [ ] Webhook URL updated
- [ ] OAuth redirect URI updated
- [ ] Developer token approved
- [ ] Test lead form extensions

#### LinkedIn
- [ ] Redirect URL updated
- [ ] Marketing API access confirmed
- [ ] Test lead generation forms

#### WhatsApp Business
- [ ] Webhook URL updated
- [ ] Business verification complete
- [ ] Message templates approved
- [ ] Test message sending

#### Razorpay
- [ ] Webhook URL updated
- [ ] Live mode keys configured
- [ ] KYC verification complete
- [ ] Test payment flow

## 🔄 Step 15: Continuous Deployment

### GitHub Integration

1. Connect your Vercel project to GitHub
2. Enable automatic deployments
3. Set up preview deployments for pull requests

### Environment Branches

```bash
# Production branch
vercel --prod

# Preview deployment
vercel

# Development with specific branch
vercel --target development
```

## 📞 Support & Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Check variable names match exactly
   - Redeploy after adding new variables

2. **Webhook Verification Failing**
   - Verify webhook URLs are correct
   - Check verify tokens match

3. **OAuth Redirects Failing**
   - Ensure redirect URLs are exactly configured
   - Check for trailing slashes

4. **API Routes Not Working**
   - Verify file structure in `api/` directory
   - Check function exports

### Getting Help

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [Platform-specific documentation](../API_SETUP_GUIDE.md)

---

🎉 **Congratulations!** Your CRM is now deployed and ready for production use!

Remember to monitor your application and update webhook URLs whenever you change domains or deployment settings. 