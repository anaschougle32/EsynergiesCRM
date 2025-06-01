# 🔧 API Configuration Guide

This document outlines all the APIs required to make the CRM system 100% functional with automated lead capture and WhatsApp automation.

## 📋 **Complete API Requirements**

### **1. Core Lead Capture APIs**

#### **Meta (Facebook/Instagram) APIs**
```bash
# Required for Facebook & Instagram Lead Ads
FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"
FACEBOOK_VERIFY_TOKEN="your_webhook_verify_token"
FACEBOOK_ACCESS_TOKEN="your_long_lived_access_token"
```

**Setup Steps:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add Facebook Login product
4. Request permissions: `leads_retrieval`, `pages_read_engagement`, `pages_manage_ads`
5. Set up webhook subscription for leadgen events

**Webhook URL:** `https://yourcrm.com/api/webhooks/facebook`

#### **Google Ads API**
```bash
# Required for Google Ads Lead Form Extensions
GOOGLE_ADS_CLIENT_ID="your_oauth_client_id"
GOOGLE_ADS_CLIENT_SECRET="your_oauth_client_secret"
GOOGLE_ADS_DEVELOPER_TOKEN="your_developer_token"
GOOGLE_ADS_WEBHOOK_SECRET="your_webhook_secret"
```

**Setup Steps:**
1. Enable Google Ads API in [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Apply for developer token in Google Ads account
4. Configure lead form extensions with webhook

**Webhook URL:** `https://yourcrm.com/api/webhooks/google-ads`

#### **LinkedIn Marketing API**
```bash
# Required for LinkedIn Lead Gen Forms
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
```

**Setup Steps:**
1. Create app in [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Apply for Marketing Developer Platform access
3. Set up OAuth 2.0 authentication
4. Create Lead Gen Forms in Campaign Manager

**Webhook URL:** `https://yourcrm.com/api/webhooks/linkedin`

### **2. WhatsApp Business APIs**

#### **WhatsApp Business Cloud API (Recommended)**
```bash
# Meta's WhatsApp Business Cloud API
WHATSAPP_ACCESS_TOKEN="your_permanent_access_token"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
WHATSAPP_WABA_ID="your_business_account_id"
WHATSAPP_VERIFY_TOKEN="your_webhook_verify_token"
WHATSAPP_API_VERSION="18.0"
```

**Setup Steps:**
1. Create WhatsApp Business Account
2. Set up app in [Meta for Developers](https://developers.facebook.com/)
3. Add WhatsApp product to your app
4. Get permanent access token
5. Create and approve message templates
6. Configure webhook for message status updates

**Webhook URL:** `https://yourcrm.com/api/webhooks/whatsapp`

#### **Twilio WhatsApp API (Alternative)**
```bash
# Simpler setup but with usage costs
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"
```

### **3. Payment Processing APIs**

#### **Razorpay Payment Gateway**
```bash
# For subscription billing and payments
RAZORPAY_KEY_ID="rzp_test_or_live_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

**Setup Steps:**
1. Create account at [Razorpay](https://razorpay.com/)
2. Get API keys from dashboard
3. Set up webhook for payment events
4. Configure subscription plans

**Webhook URL:** `https://yourcrm.com/api/webhooks/razorpay`

### **4. Integration Platform APIs (Recommended Approach)**

#### **Pabbly Connect (Recommended)**
```bash
# Unified webhook receiver
PABBLY_WEBHOOK_URL="https://connect.pabbly.com/workflow/sendwebhookdata/..."
```

**Setup Steps:**
1. Create account at [Pabbly Connect](https://www.pabbly.com/connect/)
2. Create workflows for each platform:
   - **Trigger:** Facebook Lead Ads → **Action:** Webhook to your CRM
   - **Trigger:** Google Ads Lead Form → **Action:** Webhook to your CRM
   - **Trigger:** LinkedIn Lead Gen → **Action:** Webhook to your CRM
3. Add WhatsApp action for automated messaging

**Your CRM Webhook:** `https://yourcrm.com/api/webhooks/pabbly`

#### **Zapier (Alternative)**
```bash
# Alternative integration platform
ZAPIER_WEBHOOK_URL="https://hooks.zapier.com/hooks/catch/..."
```

### **5. Database & Backend APIs**

#### **Supabase (Already in use)**
```bash
# Database and authentication
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

## 🏗️ **Recommended Implementation Strategy**

### **Option 1: Hybrid Approach (Recommended)**
- Use **Pabbly Connect** for lead capture from all platforms
- Build **direct WhatsApp Business API** integration in your CRM
- Use **Razorpay** for payment processing
- Your CRM receives unified webhook data from Pabbly

**Benefits:**
- ✅ Easy setup for clients
- ✅ No complex OAuth flows to manage
- ✅ Unified data format
- ✅ Reliable delivery
- ✅ Easy to scale

### **Option 2: Direct API Integration**
- Build direct integrations with Facebook, Google, LinkedIn APIs
- Handle OAuth flows and token management
- Build webhook endpoints for each platform

**Benefits:**
- ✅ Full control over integrations
- ✅ No dependency on third-party tools
- ❌ Complex setup and maintenance
- ❌ Requires technical expertise from clients

## 📊 **API Endpoints Your CRM Needs**

### **Webhook Receivers**
```
POST /api/webhooks/facebook      # Facebook/Instagram leads
POST /api/webhooks/google-ads    # Google Ads leads
POST /api/webhooks/linkedin      # LinkedIn leads
POST /api/webhooks/pabbly        # Unified Pabbly webhook
POST /api/webhooks/zapier        # Unified Zapier webhook
POST /api/webhooks/whatsapp      # WhatsApp status updates
POST /api/webhooks/razorpay      # Payment notifications
```

### **Lead Management**
```
GET    /api/leads                # Get all leads (admin)
GET    /api/leads/client/:id     # Get client leads
POST   /api/leads                # Create new lead
PATCH  /api/leads/:id            # Update lead
DELETE /api/leads/:id            # Delete lead
```

### **WhatsApp Management**
```
GET    /api/whatsapp/templates        # Get templates
POST   /api/whatsapp/templates       # Create template
POST   /api/whatsapp/send            # Send message
GET    /api/whatsapp/messages        # Get message history
POST   /api/whatsapp/test-connection # Test connection
```

### **Integration Management**
```
GET    /api/integrations              # Get all integrations
POST   /api/integrations             # Save integration
POST   /api/integrations/:id/test    # Test integration
POST   /api/integrations/:id/sync    # Manual sync
```

### **Billing & Payments**
```
GET    /api/billing/plans            # Get subscription plans
POST   /api/billing/subscriptions   # Assign plan to client
POST   /api/billing/payments/create-link # Create payment link
POST   /api/billing/payments/verify # Verify payment
```

## 🔐 **Security Requirements**

### **Webhook Verification**
- Facebook: Verify `x-hub-signature-256` header
- Google Ads: Verify custom secret header
- WhatsApp: Verify `x-hub-signature-256` header
- Razorpay: Verify webhook signature

### **API Authentication**
- JWT tokens for CRM API access
- OAuth 2.0 for platform integrations
- API keys for service integrations

## 🚀 **Quick Start Setup**

### **1. For Development (Minimal Setup)**
```bash
# Use Pabbly Connect for lead capture
# Use WhatsApp Business Cloud API for messaging
# Use mock data for payments

# Required APIs:
- Pabbly Connect account
- WhatsApp Business API setup
- Supabase database
```

### **2. For Production (Full Setup)**
```bash
# All APIs configured
# Webhook endpoints secured
# Payment processing active
# Real-time lead capture working

# Required APIs:
- All platform APIs OR Pabbly Connect
- WhatsApp Business API
- Razorpay payment gateway
- Email service (SMTP)
- Supabase database
```

## 📝 **Environment Configuration**

Create a `.env` file with all the required API keys:

```bash
# Copy from .env.example and fill in your values
cp .env.example .env
```

## 🔄 **Data Flow**

1. **Lead Capture:** Platform → Pabbly/Direct API → Your CRM Webhook
2. **Lead Processing:** Webhook → Database → WhatsApp Automation
3. **WhatsApp Messaging:** Template → WhatsApp API → Status Updates
4. **Payment Processing:** Razorpay → Webhook → Database Update

## 📞 **Support & Documentation**

- **Facebook API:** [Graph API Documentation](https://developers.facebook.com/docs/graph-api/)
- **Google Ads API:** [Google Ads API Guide](https://developers.google.com/google-ads/api/)
- **LinkedIn API:** [Marketing API Documentation](https://docs.microsoft.com/en-us/linkedin/marketing/)
- **WhatsApp API:** [Business API Documentation](https://developers.facebook.com/docs/whatsapp/)
- **Razorpay API:** [Payment Gateway Documentation](https://razorpay.com/docs/)
- **Pabbly Connect:** [Integration Tutorials](https://www.pabbly.com/connect/integrations/)

---

This configuration will make your CRM 100% functional with automated lead capture, WhatsApp automation, and payment processing. The hybrid approach with Pabbly Connect is recommended for easier client setup and maintenance. 