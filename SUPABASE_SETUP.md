# Supabase Setup Guide for Marketing Agency CRM

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: Marketing Agency CRM
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (something like `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 3. Set Up Environment Variables

1. Create a `.env` file in the root of your project:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: For development
VITE_APP_ENV=development
```

2. Replace the placeholder values with your actual Supabase credentials

## 4. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content from `docs/database-schema.sql`
3. Paste it into the SQL Editor
4. Click "Run" to execute the schema

This will create all the necessary tables, indexes, and sample data.

## 5. Test the Connection

1. Start your development server:
```bash
npm run dev
```

2. Try logging in with the sample credentials:

**Admin Login:**
- Email: `admin@marketingagency.com`
- Password: `admin123`

**Client Login:**
- Email: `client1@restaurant.com`
- Password: `client123`

## 6. Verify Database Setup

After running the schema, you should see these tables in your Supabase dashboard:

- `admins` - Admin user accounts
- `clients` - Client user accounts  
- `lead_sources` - Integration configurations
- `leads` - Lead data from various sources
- `lead_activities` - Lead interaction history
- `whatsapp_config` - WhatsApp API configuration
- `whatsapp_templates` - Message templates
- `whatsapp_automation_rules` - Automation rules
- `whatsapp_messages` - Message history
- `subscription_plans` - Billing plans
- `client_subscriptions` - Client subscriptions
- `payments` - Payment transactions
- `login_logs` - User login history
- `activity_logs` - System activity logs
- `notification_settings` - User notification preferences
- `notifications` - Notification queue

## 7. Row Level Security (RLS)

The schema includes Row Level Security policies to ensure:
- Admins can only access their own data and their clients' data
- Clients can only access their own data
- Proper data isolation between different admin accounts

## 8. Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env` file is in the root directory
   - Verify the variable names match exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Restart your development server after adding the `.env` file

2. **"Invalid credentials" error**
   - Ensure you've run the database schema from `docs/database-schema.sql`
   - Check that the sample data was inserted correctly
   - Verify the email and password are exactly as shown above

3. **Database connection errors**
   - Verify your Supabase project is active
   - Check that your project URL and anon key are correct
   - Ensure your internet connection is stable

4. **RLS policy errors**
   - The schema includes RLS policies that may need to be adjusted based on your specific needs
   - Check the Supabase logs for detailed error messages

## 9. Next Steps

Once Supabase is connected:

1. **Customize the schema** - Modify tables and fields as needed for your specific use case
2. **Set up integrations** - Configure Facebook, Google Ads, LinkedIn, and WhatsApp APIs
3. **Configure email** - Set up email templates and SMTP settings
4. **Set up payments** - Configure Razorpay for billing functionality
5. **Deploy** - Deploy your application to production

## 10. Production Considerations

For production deployment:

1. **Environment Variables**: Set up production environment variables
2. **Database Backups**: Enable automatic backups in Supabase
3. **SSL**: Ensure all connections use HTTPS
4. **Monitoring**: Set up monitoring and alerting
5. **Rate Limiting**: Configure rate limiting for API endpoints
6. **Security**: Review and test all RLS policies

---

**Need Help?**

If you encounter any issues during setup, please check:
1. Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
2. The project's GitHub issues
3. Contact support for assistance 