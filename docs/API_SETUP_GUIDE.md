# 🔧 Complete API Setup Guide: Step-by-Step

This guide provides detailed, step-by-step instructions to obtain all the APIs needed for your CRM system. Follow each section carefully to ensure proper setup.

## 📋 **Overview of Required APIs**

| Platform | Purpose | Difficulty | Time Required |
|----------|---------|------------|---------------|
| Meta (Facebook/Instagram) | Lead Ads capture | Medium | 30-45 mins |
| Google Ads | Lead Form Extensions | Hard | 45-60 mins |
| LinkedIn | Lead Gen Forms | Medium | 30-45 mins |
| WhatsApp Business | Automated messaging | Medium | 45-60 mins |
| Razorpay | Payment processing | Easy | 15-30 mins |
| Pabbly Connect | Unified integration | Easy | 30-45 mins |

---

## 🔵 **1. Meta (Facebook/Instagram) API Setup**

### **Step 1: Create Facebook Developer Account**

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Click "Get Started" in top right corner
   - Log in with your Facebook account (use business account if available)

2. **Verify Your Account**
   - Add phone number if prompted
   - Verify email address
   - Complete any additional verification steps

### **Step 2: Create a New App**

1. **Create App**
   - Click "Create App" button
   - Select "Business" as app type
   - Click "Next"

2. **App Details**
   - **App Name:** "YourCRM Lead Capture" (or your preferred name)
   - **App Contact Email:** Your business email
   - **Business Account:** Select or create business account
   - Click "Create App"

3. **App Dashboard Setup**
   - You'll be redirected to the app dashboard
   - Note down your **App ID** (you'll need this later)

### **Step 3: Add Facebook Login Product**

1. **Add Product**
   - In left sidebar, click "Add Product"
   - Find "Facebook Login" and click "Set Up"

2. **Configure Facebook Login**
   - Select "Web" platform
   - **Site URL:** `https://yourdomain.com` (your CRM domain)
   - Click "Save"

### **Step 4: Configure Webhooks**

1. **Add Webhooks Product**
   - In left sidebar, click "Add Product"
   - Find "Webhooks" and click "Set Up"

2. **Create Webhook**
   - Click "Create Subscription"
   - **Callback URL:** `https://yourdomain.com/api/webhooks/facebook`
   - **Verify Token:** Create a random string (e.g., `fb_verify_token_123`)
   - **Subscription Fields:** Select `leadgen`
   - Click "Verify and Save"

### **Step 5: Get Access Tokens**

1. **Generate Access Token**
   - Go to "Tools" → "Graph API Explorer"
   - Select your app from dropdown
   - Click "Generate Access Token"
   - Grant all requested permissions

2. **Convert to Long-lived Token**
   - Copy the short-lived token
   - Use Facebook's token debugger: https://developers.facebook.com/tools/debug/accesstoken/
   - Click "Extend Access Token"
   - Copy the long-lived token

### **Step 6: Request Permissions**

1. **App Review**
   - Go to "App Review" in left sidebar
   - Request these permissions:
     - `leads_retrieval`
     - `pages_read_engagement`
     - `pages_manage_ads`

2. **Submit for Review**
   - Provide business verification documents
   - Explain use case for lead capture
   - Wait for approval (usually 3-7 days)

### **Environment Variables to Save:**
```bash
FACEBOOK_APP_ID="your_app_id_here"
FACEBOOK_APP_SECRET="your_app_secret_here"
FACEBOOK_VERIFY_TOKEN="fb_verify_token_123"
FACEBOOK_ACCESS_TOKEN="your_long_lived_token_here"
```

---

## 🔴 **2. Google Ads API Setup**

### **Step 1: Create Google Cloud Project**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" dropdown
   - Click "New Project"
   - **Project Name:** "CRM Lead Capture"
   - **Organization:** Select your organization
   - Click "Create"

### **Step 2: Enable Google Ads API**

1. **Enable API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Ads API"
   - Click on "Google Ads API"
   - Click "Enable"

2. **Create Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - **Application Type:** Web application
   - **Name:** "CRM OAuth Client"
   - **Authorized redirect URIs:** `https://yourdomain.com/auth/google/callback`
   - Click "Create"

### **Step 3: Get Developer Token**

1. **Access Google Ads Account**
   - Go to: https://ads.google.com/
   - Sign in to your Google Ads account

2. **Apply for Developer Token**
   - Go to "Tools & Settings" → "Setup" → "API Center"
   - Click "Apply for API access"
   - Fill out the application form:
     - **Company:** Your business name
     - **Use Case:** Lead capture for CRM system
     - **Expected API calls:** 1000-10000 per day
   - Submit application

3. **Wait for Approval**
   - Google will review your application
   - This can take 1-2 weeks
   - You'll receive email notification

### **Step 4: Set Up Lead Form Extensions**

1. **Create Lead Form Extension**
   - In Google Ads, go to "Assets" → "Extensions"
   - Click "+" → "Lead form extension"
   - Configure your lead form fields

2. **Configure Webhook**
   - In lead form settings, add webhook URL
   - **Webhook URL:** `https://yourdomain.com/api/webhooks/google-ads`
   - **Secret:** Create a random string for verification

### **Environment Variables to Save:**
```bash
GOOGLE_ADS_CLIENT_ID="your_oauth_client_id"
GOOGLE_ADS_CLIENT_SECRET="your_oauth_client_secret"
GOOGLE_ADS_DEVELOPER_TOKEN="your_developer_token"
GOOGLE_ADS_WEBHOOK_SECRET="your_webhook_secret"
```

---

## 🔵 **3. LinkedIn Marketing API Setup**

### **Step 1: Create LinkedIn Developer Account**

1. **Go to LinkedIn Developers**
   - Visit: https://developer.linkedin.com/
   - Sign in with your LinkedIn account
   - Ensure your LinkedIn profile is complete

2. **Apply for Developer Access**
   - Click "Join the LinkedIn Developer Program"
   - Complete the application form
   - Wait for approval (usually 1-3 days)

### **Step 2: Create LinkedIn App**

1. **Create New App**
   - Click "Create App"
   - **App Name:** "CRM Lead Capture"
   - **LinkedIn Page:** Select your business page
   - **App Logo:** Upload your company logo
   - **Legal Agreement:** Accept terms
   - Click "Create App"

2. **App Settings**
   - Go to "Settings" tab
   - **Privacy Policy URL:** `https://yourdomain.com/privacy`
   - **Terms of Service URL:** `https://yourdomain.com/terms`
   - Save changes

### **Step 3: Request API Access**

1. **Apply for Marketing Developer Platform**
   - Go to "Products" tab
   - Find "Marketing Developer Platform"
   - Click "Request Access"

2. **Fill Application**
   - **Use Case:** Lead generation for CRM
   - **Integration Details:** Describe your lead capture system
   - **Expected Volume:** Number of leads per month
   - Submit application

3. **Wait for Approval**
   - LinkedIn will review (usually 5-10 business days)
   - You'll receive email notification

### **Step 4: Configure OAuth**

1. **Auth Settings**
   - Go to "Auth" tab
   - **Redirect URLs:** Add `https://yourdomain.com/auth/linkedin/callback`
   - Copy **Client ID** and **Client Secret**

### **Step 5: Set Up Lead Gen Forms**

1. **Create Lead Gen Form**
   - Go to LinkedIn Campaign Manager
   - Create new campaign with "Lead Generation" objective
   - Set up your lead form with required fields

2. **Configure Webhook (if available)**
   - Some LinkedIn integrations support webhooks
   - Check LinkedIn's latest documentation for webhook setup

### **Environment Variables to Save:**
```bash
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"
```

---

## 💚 **4. WhatsApp Business API Setup**

### **Step 1: Create WhatsApp Business Account**

1. **Go to Meta Business**
   - Visit: https://business.facebook.com/
   - Sign in with your Facebook account
   - Click "Create Account"

2. **Set Up Business Account**
   - **Business Name:** Your company name
   - **Business Email:** Your business email
   - **Business Website:** Your website URL
   - Complete verification process

### **Step 2: Create WhatsApp Business App**

1. **Go to Meta for Developers**
   - Visit: https://developers.facebook.com/
   - Use the same account as Facebook API setup

2. **Add WhatsApp Product**
   - Go to your existing app (or create new one)
   - Click "Add Product"
   - Find "WhatsApp" and click "Set Up"

### **Step 3: Configure WhatsApp Business**

1. **Add Phone Number**
   - Go to WhatsApp → "Getting Started"
   - Click "Add Phone Number"
   - Enter your business phone number
   - Verify with SMS/call

2. **Business Verification**
   - Upload business documents
   - Provide business information
   - Wait for verification (1-3 business days)

### **Step 4: Get API Credentials**

1. **Get Access Token**
   - Go to WhatsApp → "Getting Started"
   - Copy the temporary access token
   - Generate permanent access token (follow Meta's guide)

2. **Get Phone Number ID**
   - In WhatsApp settings, find "Phone Number ID"
   - Copy this ID (you'll need it for API calls)

3. **Get WABA ID**
   - Go to WhatsApp Business Account settings
   - Copy the "WhatsApp Business Account ID"

### **Step 5: Create Message Templates**

1. **Create Templates**
   - Go to WhatsApp → "Message Templates"
   - Click "Create Template"
   - **Template Name:** `welcome_message`
   - **Category:** Utility
   - **Language:** English
   - **Body Text:** "Hi {{1}}, thank you for your interest! We will contact you shortly."
   - Submit for approval

2. **Create More Templates**
   - Follow-up message template
   - Appointment reminder template
   - Wait for approval (usually 24-48 hours)

### **Step 6: Configure Webhook**

1. **Set Up Webhook**
   - Go to WhatsApp → "Configuration"
   - **Webhook URL:** `https://yourdomain.com/api/webhooks/whatsapp`
   - **Verify Token:** Create random string (e.g., `wa_verify_token_456`)
   - **Webhook Fields:** Select `messages` and `message_deliveries`

### **Environment Variables to Save:**
```bash
WHATSAPP_ACCESS_TOKEN="your_permanent_access_token"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
WHATSAPP_WABA_ID="your_business_account_id"
WHATSAPP_VERIFY_TOKEN="wa_verify_token_456"
WHATSAPP_API_VERSION="18.0"
```

---

## 💰 **5. Razorpay Payment Gateway Setup**

### **Step 1: Create Razorpay Account**

1. **Sign Up**
   - Visit: https://razorpay.com/
   - Click "Sign Up"
   - **Business Type:** Select your business type
   - **Business Name:** Your company name
   - **Email:** Your business email
   - **Phone:** Your business phone

2. **Complete KYC**
   - Upload required documents:
     - PAN Card
     - Bank Account Details
     - Business Registration Certificate
     - Address Proof
   - Wait for verification (1-2 business days)

### **Step 2: Get API Keys**

1. **Access Dashboard**
   - Log in to Razorpay Dashboard
   - Go to "Settings" → "API Keys"

2. **Generate Keys**
   - **Test Mode:** Get test keys for development
   - **Live Mode:** Get live keys for production
   - Download and securely store both sets

### **Step 3: Configure Webhooks**

1. **Set Up Webhook**
   - Go to "Settings" → "Webhooks"
   - Click "Add New Webhook"
   - **Webhook URL:** `https://yourdomain.com/api/webhooks/razorpay`
   - **Secret:** Generate random string
   - **Events:** Select payment events you want to track

### **Step 4: Create Subscription Plans**

1. **Create Plans**
   - Go to "Subscriptions" → "Plans"
   - Click "Create Plan"
   - **Plan ID:** `basic_monthly`
   - **Amount:** 2999 (₹29.99)
   - **Billing Cycle:** Monthly
   - Create multiple plans as needed

### **Environment Variables to Save:**
```bash
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"
```

---

## 🔗 **6. Pabbly Connect Setup (Recommended Integration Platform)**

### **Step 1: Create Pabbly Connect Account**

1. **Sign Up**
   - Visit: https://www.pabbly.com/connect/
   - Click "Start Free Trial"
   - **Email:** Your business email
   - **Password:** Create strong password
   - Verify email address

2. **Choose Plan**
   - Start with free plan (100 tasks/month)
   - Upgrade as needed for higher volume

### **Step 2: Create Facebook Lead Ads Workflow**

1. **Create New Workflow**
   - Click "Create Workflow"
   - **Workflow Name:** "Facebook Leads to CRM"

2. **Set Up Trigger**
   - **Trigger App:** Facebook Lead Ads
   - **Trigger Event:** New Lead
   - Connect your Facebook account
   - Select your Facebook page and lead form

3. **Set Up Action**
   - **Action App:** Webhooks
   - **Action Event:** POST
   - **Webhook URL:** `https://yourdomain.com/api/webhooks/pabbly`
   - **Method:** POST
   - **Headers:** `Content-Type: application/json`

4. **Map Data**
   - Map Facebook lead fields to your CRM format:
   ```json
   {
     "source": "meta_ads",
     "clientId": "your_client_id",
     "leadData": {
       "name": "{{full_name}}",
       "email": "{{email}}",
       "phone": "{{phone_number}}",
       "form_id": "{{form_id}}",
       "ad_id": "{{ad_id}}"
     },
     "timestamp": "{{created_time}}"
   }
   ```

5. **Test and Activate**
   - Test the workflow with sample data
   - Activate the workflow

### **Step 3: Create Google Ads Workflow**

1. **Create New Workflow**
   - **Workflow Name:** "Google Ads Leads to CRM"
   - **Trigger App:** Google Ads (if available) or Google Sheets
   - **Action App:** Webhooks to your CRM

2. **Configure Similar to Facebook**
   - Follow same pattern as Facebook workflow
   - Map Google Ads fields to your CRM format

### **Step 4: Create LinkedIn Workflow**

1. **Create New Workflow**
   - **Workflow Name:** "LinkedIn Leads to CRM"
   - **Trigger App:** LinkedIn Lead Gen Forms
   - **Action App:** Webhooks to your CRM

### **Step 5: Add WhatsApp Automation**

1. **Enhance Workflows**
   - Add WhatsApp action to each workflow
   - **Action App:** WhatsApp Business
   - **Action Event:** Send Template Message
   - Configure template and recipient mapping

### **Environment Variables to Save:**
```bash
PABBLY_WEBHOOK_URL="https://connect.pabbly.com/workflow/sendwebhookdata/..."
```

---

## 🔧 **7. Environment Configuration**

### **Create .env File**

Create a `.env` file in your project root with all the API keys:

```bash
# Database
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Facebook/Instagram
FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"
FACEBOOK_VERIFY_TOKEN="fb_verify_token_123"
FACEBOOK_ACCESS_TOKEN="your_long_lived_access_token"

# Google Ads
GOOGLE_ADS_CLIENT_ID="your_oauth_client_id"
GOOGLE_ADS_CLIENT_SECRET="your_oauth_client_secret"
GOOGLE_ADS_DEVELOPER_TOKEN="your_developer_token"
GOOGLE_ADS_WEBHOOK_SECRET="your_webhook_secret"

# LinkedIn
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"

# WhatsApp Business
WHATSAPP_ACCESS_TOKEN="your_permanent_access_token"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id"
WHATSAPP_WABA_ID="your_business_account_id"
WHATSAPP_VERIFY_TOKEN="wa_verify_token_456"
WHATSAPP_API_VERSION="18.0"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Pabbly Connect
PABBLY_WEBHOOK_URL="https://connect.pabbly.com/workflow/sendwebhookdata/..."

# Application
NODE_ENV="development"
PORT="3000"
JWT_SECRET="your_jwt_secret_key"
```

---

## ⚠️ **Common Issues & Troubleshooting**

### **Facebook API Issues**
- **App Review Rejection:** Provide detailed use case and business verification
- **Webhook Verification Failed:** Check verify token matches exactly
- **Permission Denied:** Ensure all required permissions are approved

### **Google Ads API Issues**
- **Developer Token Pending:** Can take up to 2 weeks for approval
- **OAuth Errors:** Check redirect URIs match exactly
- **API Quota Exceeded:** Monitor usage and request quota increase

### **WhatsApp API Issues**
- **Template Rejected:** Follow WhatsApp's template guidelines strictly
- **Phone Number Verification Failed:** Use business phone number
- **Message Delivery Failed:** Check phone number format and template approval

### **Razorpay Issues**
- **KYC Pending:** Ensure all documents are clear and valid
- **Webhook Not Triggering:** Check webhook URL is accessible
- **Payment Failed:** Verify API keys and test with small amounts

### **Pabbly Connect Issues**
- **Workflow Not Triggering:** Check trigger app connection
- **Data Mapping Errors:** Verify field names match exactly
- **Rate Limits:** Upgrade plan if hitting task limits

---

## ✅ **Verification Checklist**

Before going live, verify each integration:

### **Facebook/Instagram**
- [ ] App approved and live
- [ ] Webhook receiving test data
- [ ] Lead data mapping correctly
- [ ] Access token is long-lived

### **Google Ads**
- [ ] Developer token approved
- [ ] Lead form extensions created
- [ ] Webhook configured and tested
- [ ] OAuth flow working

### **LinkedIn**
- [ ] Marketing API access approved
- [ ] Lead gen forms created
- [ ] Data capture working
- [ ] OAuth integration tested

### **WhatsApp**
- [ ] Business account verified
- [ ] Templates approved
- [ ] Message sending working
- [ ] Webhook receiving status updates

### **Razorpay**
- [ ] KYC completed
- [ ] Test payments working
- [ ] Webhook receiving events
- [ ] Subscription plans created

### **Pabbly Connect**
- [ ] All workflows active
- [ ] Data mapping verified
- [ ] Error handling configured
- [ ] Rate limits sufficient

---

## 🚀 **Next Steps**

After completing all API setups:

1. **Test Each Integration**
   - Create test leads in each platform
   - Verify data reaches your CRM
   - Test WhatsApp automation

2. **Set Up Monitoring**
   - Monitor webhook delivery rates
   - Set up error notifications
   - Track API usage and limits

3. **Go Live**
   - Switch to production API keys
   - Update webhook URLs to production
   - Monitor system performance

4. **Scale Up**
   - Increase API quotas as needed
   - Upgrade Pabbly Connect plan
   - Add more automation rules

This comprehensive setup will give you a fully functional CRM with automated lead capture from all major platforms and WhatsApp automation capabilities. 