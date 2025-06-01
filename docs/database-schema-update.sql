-- Updated Database Schema for CRM SaaS
-- This script contains only new changes and modifications
-- Run this after the initial schema has been created

-- Update lead_sources table to include Meta Ads (Facebook + Instagram combined)
ALTER TABLE lead_sources DROP CONSTRAINT IF EXISTS lead_sources_platform_check;
ALTER TABLE lead_sources ADD CONSTRAINT lead_sources_platform_check 
CHECK (platform IN ('meta_ads', 'google_ads', 'linkedin', 'whatsapp', 'manual'));

-- Update leads table to reflect Meta Ads
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE leads ADD CONSTRAINT leads_source_check 
CHECK (source IN ('meta_ads', 'google_ads', 'linkedin', 'whatsapp', 'manual'));

-- Add integration guides table
CREATE TABLE IF NOT EXISTS integration_guides (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    estimated_time VARCHAR(50) NOT NULL,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'medium', 'hard')) NOT NULL,
    requirements JSONB NOT NULL,
    steps JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert integration guides data
INSERT INTO integration_guides (platform, title, description, estimated_time, difficulty_level, requirements, steps) VALUES
('meta_ads', 'Meta Ads Integration (Facebook & Instagram)', 'Connect your Facebook and Instagram ad accounts to automatically sync leads from both platforms under one unified Meta Ads integration.', '15-20 minutes', 'medium', 
'["Facebook Business Account", "Instagram Business Account", "Facebook Page", "Active Ad Campaigns", "Admin Access to Pages"]',
'[
  {
    "step": 1,
    "title": "Create Facebook App",
    "description": "Go to Facebook Developers and create a new app",
    "details": "Visit developers.facebook.com, click \"Create App\", select \"Business\" type, and provide your app details including name and contact email."
  },
  {
    "step": 2,
    "title": "Add Facebook Login Product",
    "description": "Add Facebook Login to your app and configure settings",
    "details": "In your app dashboard, click \"Add Product\" and select \"Facebook Login\". Configure Valid OAuth Redirect URIs to include your domain."
  },
  {
    "step": 3,
    "title": "Get App Credentials",
    "description": "Copy your App ID and App Secret",
    "details": "Go to Settings > Basic and copy your App ID and App Secret. Keep the App Secret secure and never expose it in client-side code."
  },
  {
    "step": 4,
    "title": "Request Permissions",
    "description": "Request necessary permissions for lead access",
    "details": "Request pages_read_engagement, pages_manage_ads, and leads_retrieval permissions through App Review process."
  },
  {
    "step": 5,
    "title": "Connect Pages",
    "description": "Connect your Facebook and Instagram business pages",
    "details": "Use our integration form to authenticate and select which Facebook and Instagram pages to sync leads from."
  }
]'),

('google_ads', 'Google Ads Integration', 'Connect your Google Ads account to sync leads from Google Ad campaigns and lead form extensions.', '20-25 minutes', 'hard',
'["Google Ads Account", "Google Cloud Project", "Active Campaigns", "Lead Form Extensions", "API Access"]',
'[
  {
    "step": 1,
    "title": "Enable Google Ads API",
    "description": "Enable Google Ads API in Google Cloud Console",
    "details": "Go to Google Cloud Console, create or select a project, navigate to APIs & Services, and enable the Google Ads API."
  },
  {
    "step": 2,
    "title": "Create OAuth Credentials",
    "description": "Create OAuth 2.0 credentials for your application",
    "details": "In Google Cloud Console, go to Credentials, create OAuth 2.0 Client ID, and add authorized redirect URIs."
  },
  {
    "step": 3,
    "title": "Get Developer Token",
    "description": "Apply for Google Ads API developer token",
    "details": "In your Google Ads account, go to Tools & Settings > API Center, and apply for a developer token."
  },
  {
    "step": 4,
    "title": "Set Up Lead Extensions",
    "description": "Configure lead form extensions in your campaigns",
    "details": "In Google Ads, create lead form extensions with custom questions and privacy policy links."
  },
  {
    "step": 5,
    "title": "Connect Account",
    "description": "Use our integration form to connect your Google Ads account",
    "details": "Enter your Customer ID and authenticate with OAuth to start syncing leads automatically."
  }
]'),

('linkedin', 'LinkedIn Ads Integration', 'Connect LinkedIn Campaign Manager to sync leads from LinkedIn Lead Gen Forms.', '25-30 minutes', 'hard',
'["LinkedIn Company Page", "Campaign Manager Access", "Marketing Developer Platform Access", "Active Lead Gen Campaigns"]',
'[
  {
    "step": 1,
    "title": "Create LinkedIn App",
    "description": "Create a new application in LinkedIn Developer Portal",
    "details": "Go to developer.linkedin.com, create a new app, provide your company page and app details."
  },
  {
    "step": 2,
    "title": "Request API Access",
    "description": "Apply for Marketing Developer Platform access",
    "details": "Submit an application for Marketing Developer Platform to access Lead Gen Forms API."
  },
  {
    "step": 3,
    "title": "Configure OAuth",
    "description": "Set up OAuth 2.0 authentication",
    "details": "Add authorized redirect URLs and configure OAuth settings in your LinkedIn app."
  },
  {
    "step": 4,
    "title": "Create Lead Gen Forms",
    "description": "Set up Lead Gen Forms in Campaign Manager",
    "details": "In LinkedIn Campaign Manager, create Sponsored Content campaigns with Lead Gen Forms."
  },
  {
    "step": 5,
    "title": "Connect Integration",
    "description": "Use our form to authenticate and sync leads",
    "details": "Enter Client ID, Client Secret, and authenticate to start receiving leads from LinkedIn."
  }
]'),

('whatsapp', 'WhatsApp Business Integration', 'Connect WhatsApp Business API to send automated messages to leads.', '30-45 minutes', 'medium',
'["WhatsApp Business Account", "Meta for Developers Account", "Verified Phone Number", "Business Verification", "Message Templates"]',
'[
  {
    "step": 1,
    "title": "Set Up WhatsApp Business Account",
    "description": "Create or verify your WhatsApp Business Account",
    "details": "Go to business.whatsapp.com, create a business account, verify your phone number and business details."
  },
  {
    "step": 2,
    "title": "Access Cloud API",
    "description": "Get access to WhatsApp Business Cloud API",
    "details": "In Meta for Developers, create an app, add WhatsApp product, and get a temporary access token."
  },
  {
    "step": 3,
    "title": "Get Permanent Token",
    "description": "Generate permanent access token for production",
    "details": "Create a system user, assign WhatsApp Business Management permission, and generate a permanent token."
  },
  {
    "step": 4,
    "title": "Create Message Templates",
    "description": "Create and get approval for message templates",
    "details": "In WhatsApp Manager, create message templates and submit them for approval (takes 24-48 hours)."
  },
  {
    "step": 5,
    "title": "Configure Webhook",
    "description": "Set up webhook for message status updates",
    "details": "Configure webhook URL in your app settings to receive delivery status updates and message events."
  }
]');

-- Update existing data to use meta_ads instead of facebook/instagram
UPDATE lead_sources SET platform = 'meta_ads' WHERE platform IN ('facebook', 'instagram');
UPDATE leads SET source = 'meta_ads' WHERE source IN ('facebook', 'instagram');
UPDATE whatsapp_automation_rules SET trigger_source = 'meta_ads' WHERE trigger_source IN ('facebook', 'instagram');

-- Update sample data
UPDATE leads SET source = 'google_ads' WHERE source = 'google';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_lead_sources_platform ON lead_sources(platform);
CREATE INDEX IF NOT EXISTS idx_integration_guides_platform ON integration_guides(platform);

-- Update trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for integration_guides
DROP TRIGGER IF EXISTS update_integration_guides_updated_at ON integration_guides;
CREATE TRIGGER update_integration_guides_updated_at
    BEFORE UPDATE ON integration_guides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 