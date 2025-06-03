#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Setting up local testing environment for CRM...\n');

// Check if ngrok is installed
const checkNgrok = () => {
  return new Promise((resolve) => {
    exec('ngrok version', (error) => {
      resolve(!error);
    });
  });
};

// Install ngrok if not present
const installNgrok = () => {
  return new Promise((resolve, reject) => {
    console.log('📦 Installing ngrok...');
    const install = spawn('npm', ['install', '-g', 'ngrok'], { stdio: 'inherit' });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ ngrok installed successfully');
        resolve();
      } else {
        reject(new Error('Failed to install ngrok'));
      }
    });
  });
};

// Setup ngrok auth token
const setupNgrokAuth = async () => {
  const authToken = await question('Enter your ngrok auth token (get it from https://ngrok.com/): ');
  
  return new Promise((resolve, reject) => {
    exec(`ngrok config add-authtoken ${authToken}`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        console.log('✅ ngrok auth token configured');
        resolve();
      }
    });
  });
};

// Start ngrok tunnel
const startNgrokTunnel = () => {
  return new Promise((resolve) => {
    console.log('🌐 Starting ngrok tunnel on port 5173...');
    
    const ngrok = spawn('ngrok', ['http', '5173', '--log=stdout'], { 
      stdio: ['ignore', 'pipe', 'pipe'] 
    });
    
    let ngrokUrl = '';
    
    ngrok.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      // Extract ngrok URL
      const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok\.io/);
      if (urlMatch && !ngrokUrl) {
        ngrokUrl = urlMatch[0];
        console.log(`\n🎉 ngrok tunnel started: ${ngrokUrl}\n`);
        resolve(ngrokUrl);
      }
    });
    
    ngrok.stderr.on('data', (data) => {
      console.error('ngrok error:', data.toString());
    });
    
    // Fallback timeout
    setTimeout(() => {
      if (!ngrokUrl) {
        console.log('⚠️  Could not detect ngrok URL automatically');
        resolve('https://your-ngrok-url.ngrok.io');
      }
    }, 10000);
  });
};

// Create environment file
const createEnvFile = async (ngrokUrl) => {
  console.log('📝 Creating environment configuration...\n');
  
  // Collect API credentials
  const credentials = {};
  
  console.log('Please enter your API credentials (press Enter to skip):');
  
  credentials.VITE_SUPABASE_URL = await question('Supabase URL: ');
  credentials.VITE_SUPABASE_ANON_KEY = await question('Supabase Anon Key: ');
  credentials.SUPABASE_SERVICE_ROLE_KEY = await question('Supabase Service Role Key: ');
  
  console.log('\n--- Facebook/Instagram ---');
  credentials.VITE_FACEBOOK_APP_ID = await question('Facebook App ID: ');
  credentials.FACEBOOK_APP_SECRET = await question('Facebook App Secret: ');
  credentials.FACEBOOK_ACCESS_TOKEN = await question('Facebook Access Token: ');
  
  console.log('\n--- Google Ads ---');
  credentials.VITE_GOOGLE_ADS_CLIENT_ID = await question('Google Ads Client ID: ');
  credentials.GOOGLE_ADS_CLIENT_SECRET = await question('Google Ads Client Secret: ');
  credentials.GOOGLE_ADS_DEVELOPER_TOKEN = await question('Google Ads Developer Token: ');
  
  console.log('\n--- LinkedIn ---');
  credentials.VITE_LINKEDIN_CLIENT_ID = await question('LinkedIn Client ID: ');
  credentials.LINKEDIN_CLIENT_SECRET = await question('LinkedIn Client Secret: ');
  
  console.log('\n--- WhatsApp Business ---');
  credentials.WHATSAPP_ACCESS_TOKEN = await question('WhatsApp Access Token: ');
  credentials.WHATSAPP_PHONE_NUMBER_ID = await question('WhatsApp Phone Number ID: ');
  credentials.WHATSAPP_WABA_ID = await question('WhatsApp Business Account ID: ');
  
  console.log('\n--- Razorpay ---');
  credentials.VITE_RAZORPAY_KEY_ID = await question('Razorpay Key ID: ');
  credentials.RAZORPAY_KEY_SECRET = await question('Razorpay Key Secret: ');
  
  // Generate random secrets
  const generateSecret = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  
  const envContent = `# Local Development Environment
NODE_ENV=development
VITE_APP_ENV=local

# Base URLs
VITE_BASE_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5173/api
VITE_WEBHOOK_BASE_URL=${ngrokUrl}

# Database (Supabase)
VITE_SUPABASE_URL=${credentials.VITE_SUPABASE_URL || 'your_supabase_project_url'}
VITE_SUPABASE_ANON_KEY=${credentials.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key'}
SUPABASE_SERVICE_ROLE_KEY=${credentials.SUPABASE_SERVICE_ROLE_KEY || 'your_service_role_key'}

# Facebook/Instagram (Test App)
VITE_FACEBOOK_APP_ID=${credentials.VITE_FACEBOOK_APP_ID || 'your_test_facebook_app_id'}
FACEBOOK_APP_SECRET=${credentials.FACEBOOK_APP_SECRET || 'your_test_facebook_app_secret'}
FACEBOOK_VERIFY_TOKEN=fb_verify_token_local_${generateSecret()}
FACEBOOK_ACCESS_TOKEN=${credentials.FACEBOOK_ACCESS_TOKEN || 'your_test_access_token'}

# Google Ads (Test)
VITE_GOOGLE_ADS_CLIENT_ID=${credentials.VITE_GOOGLE_ADS_CLIENT_ID || 'your_test_oauth_client_id'}
GOOGLE_ADS_CLIENT_SECRET=${credentials.GOOGLE_ADS_CLIENT_SECRET || 'your_test_oauth_client_secret'}
GOOGLE_ADS_DEVELOPER_TOKEN=${credentials.GOOGLE_ADS_DEVELOPER_TOKEN || 'your_test_developer_token'}
GOOGLE_ADS_WEBHOOK_SECRET=google_webhook_secret_${generateSecret()}

# LinkedIn (Test)
VITE_LINKEDIN_CLIENT_ID=${credentials.VITE_LINKEDIN_CLIENT_ID || 'your_test_linkedin_client_id'}
LINKEDIN_CLIENT_SECRET=${credentials.LINKEDIN_CLIENT_SECRET || 'your_test_linkedin_client_secret'}

# WhatsApp Business (Test)
WHATSAPP_ACCESS_TOKEN=${credentials.WHATSAPP_ACCESS_TOKEN || 'your_test_whatsapp_token'}
WHATSAPP_PHONE_NUMBER_ID=${credentials.WHATSAPP_PHONE_NUMBER_ID || 'your_test_phone_number_id'}
WHATSAPP_WABA_ID=${credentials.WHATSAPP_WABA_ID || 'your_test_business_account_id'}
WHATSAPP_VERIFY_TOKEN=wa_verify_token_local_${generateSecret()}
WHATSAPP_API_VERSION=18.0

# Razorpay (Test Mode)
VITE_RAZORPAY_KEY_ID=${credentials.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id'}
RAZORPAY_KEY_SECRET=${credentials.RAZORPAY_KEY_SECRET || 'your_test_razorpay_secret'}
RAZORPAY_WEBHOOK_SECRET=razorpay_webhook_secret_${generateSecret()}

# JWT & Security
JWT_SECRET=jwt_secret_${generateSecret()}_${generateSecret()}
ENCRYPTION_KEY=encryption_key_${generateSecret()}

# Ngrok
NGROK_URL=${ngrokUrl}
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Environment file created: .env.local');
};

// Create webhook URLs summary
const createWebhookSummary = (ngrokUrl) => {
  const webhookUrls = {
    facebook: `${ngrokUrl}/api/webhooks/facebook`,
    whatsapp: `${ngrokUrl}/api/webhooks/whatsapp`,
    google_ads: `${ngrokUrl}/api/webhooks/google-ads`,
    razorpay: `${ngrokUrl}/api/webhooks/razorpay`
  };
  
  const oauthUrls = {
    facebook: `http://localhost:5173/auth/facebook/callback`,
    google: `http://localhost:5173/auth/google/callback`,
    linkedin: `http://localhost:5173/auth/linkedin/callback`
  };
  
  const summary = `# 🔗 Webhook & OAuth URLs for Platform Configuration

## 📡 Webhook URLs (Use these in platform settings)

### Facebook/Instagram
- **Webhook URL:** ${webhookUrls.facebook}
- **Verify Token:** Check your .env.local file for FACEBOOK_VERIFY_TOKEN

### WhatsApp Business
- **Webhook URL:** ${webhookUrls.whatsapp}
- **Verify Token:** Check your .env.local file for WHATSAPP_VERIFY_TOKEN

### Google Ads
- **Webhook URL:** ${webhookUrls.google_ads}
- **Secret:** Check your .env.local file for GOOGLE_ADS_WEBHOOK_SECRET

### Razorpay
- **Webhook URL:** ${webhookUrls.razorpay}
- **Secret:** Check your .env.local file for RAZORPAY_WEBHOOK_SECRET

## 🔐 OAuth Redirect URLs (Use these in platform settings)

### Facebook App Settings
- **App Domains:** localhost
- **Site URL:** http://localhost:5173
- **Valid OAuth Redirect URIs:** ${oauthUrls.facebook}

### Google Cloud Console
- **Authorized JavaScript origins:** http://localhost:5173
- **Authorized redirect URIs:** ${oauthUrls.google}

### LinkedIn Developer Console
- **Redirect URLs:** ${oauthUrls.linkedin}

## 🧪 Testing Instructions

1. **Start your development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Keep ngrok running** (this terminal window)

3. **Update platform settings** with the URLs above

4. **Test each integration** from the admin panel

## ⚠️ Important Notes

- **ngrok URL changes** every time you restart ngrok (unless you have a paid plan)
- **Update webhook URLs** in all platforms when ngrok URL changes
- **Use test/sandbox modes** for all platforms during development
- **Never commit .env.local** to version control

## 🔄 When ngrok URL changes:

1. Update .env.local with new VITE_WEBHOOK_BASE_URL
2. Update webhook URLs in all platform settings
3. Restart your development server

---
Generated on: ${new Date().toISOString()}
ngrok URL: ${ngrokUrl}
`;

  fs.writeFileSync('WEBHOOK_URLS.md', summary);
  console.log('✅ Webhook URLs summary created: WEBHOOK_URLS.md');
};

// Create package.json scripts
const updatePackageScripts = () => {
  const packagePath = 'package.json';
  
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      'dev:local': 'npm run dev',
      'ngrok': 'ngrok http 5173',
      'setup:local': 'node scripts/setup-local-testing.js',
      'webhook:test': 'node scripts/test-webhooks.js'
    };
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Package.json scripts updated');
  }
};

// Main setup function
const main = async () => {
  try {
    // Check if ngrok is installed
    const hasNgrok = await checkNgrok();
    
    if (!hasNgrok) {
      const shouldInstall = await question('ngrok is not installed. Install it now? (y/n): ');
      if (shouldInstall.toLowerCase() === 'y') {
        await installNgrok();
      } else {
        console.log('❌ ngrok is required for webhook testing. Please install it manually.');
        process.exit(1);
      }
    }
    
    // Setup ngrok auth token
    const hasAuth = await question('Do you have an ngrok auth token configured? (y/n): ');
    if (hasAuth.toLowerCase() === 'n') {
      await setupNgrokAuth();
    }
    
    // Start ngrok tunnel
    const ngrokUrl = await startNgrokTunnel();
    
    // Create environment file
    await createEnvFile(ngrokUrl);
    
    // Create webhook summary
    createWebhookSummary(ngrokUrl);
    
    // Update package.json
    updatePackageScripts();
    
    console.log('\n🎉 Local testing environment setup complete!\n');
    console.log('📋 Next steps:');
    console.log('1. Check WEBHOOK_URLS.md for platform configuration URLs');
    console.log('2. Update your platform settings with the webhook URLs');
    console.log('3. Run "npm run dev" in another terminal to start the development server');
    console.log('4. Test your integrations from the admin panel\n');
    console.log('⚠️  Keep this ngrok tunnel running during development');
    console.log('🔄 If ngrok restarts, run this script again to update URLs\n');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

// Handle script termination
process.on('SIGINT', () => {
  console.log('\n👋 Setup interrupted. You can run this script again anytime.');
  process.exit(0);
});

// Run the setup
main(); 