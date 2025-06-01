-- =====================================================
-- CRM SaaS Database Schema for Supabase
-- Marketing Agency Lead Management System
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- Admin users table
CREATE TABLE admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    business_logo TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client users table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT true,
    first_login BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEAD SOURCES & INTEGRATIONS
-- =====================================================

-- Lead sources configuration
CREATE TABLE lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'facebook', 'instagram', 'google', 'linkedin', 'whatsapp'
    display_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    config JSONB, -- Store API keys, tokens, etc.
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'syncing', 'success', 'error'
    sync_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEADS MANAGEMENT
-- =====================================================

-- Main leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES lead_sources(id) ON DELETE CASCADE,
    external_id VARCHAR(255), -- ID from external platform
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
    lead_data JSONB, -- Store additional lead information from platforms
    notes TEXT,
    assigned_to UUID REFERENCES clients(id),
    lead_score INTEGER DEFAULT 0,
    source_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead activities/interactions
CREATE TABLE lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID, -- Can be admin or client
    user_type VARCHAR(20) NOT NULL, -- 'admin' or 'client'
    activity_type VARCHAR(50) NOT NULL, -- 'note_added', 'status_changed', 'whatsapp_sent', 'email_sent'
    description TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WHATSAPP AUTOMATION
-- =====================================================

-- WhatsApp configuration
CREATE TABLE whatsapp_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    phone_number_id VARCHAR(255) NOT NULL,
    waba_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    webhook_verify_token VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp message templates
CREATE TABLE whatsapp_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    template_id VARCHAR(255) NOT NULL, -- WhatsApp template ID
    category VARCHAR(100) NOT NULL, -- 'marketing', 'utility', 'authentication'
    language VARCHAR(10) DEFAULT 'en',
    header_type VARCHAR(20), -- 'text', 'image', 'video', 'document'
    header_content TEXT,
    body_text TEXT NOT NULL,
    footer_text TEXT,
    buttons JSONB, -- Store button configurations
    variables JSONB, -- Store template variables
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp automation rules
CREATE TABLE whatsapp_automation_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE, -- NULL for global rules
    template_id UUID NOT NULL REFERENCES whatsapp_templates(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL, -- 'new_lead', 'inactivity', 'status_change'
    trigger_conditions JSONB, -- Store trigger conditions
    delay_minutes INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp message logs
CREATE TABLE whatsapp_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    template_id UUID REFERENCES whatsapp_templates(id),
    automation_rule_id UUID REFERENCES whatsapp_automation_rules(id),
    phone_number VARCHAR(20) NOT NULL,
    message_content TEXT NOT NULL,
    whatsapp_message_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'read', 'failed'
    error_message TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BILLING & PAYMENTS
-- =====================================================

-- Subscription plans
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL, -- 'monthly', 'quarterly', 'yearly'
    features JSONB, -- Store plan features
    max_leads INTEGER,
    max_clients INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Client subscriptions
CREATE TABLE client_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'pending'
    start_date DATE NOT NULL,
    end_date DATE,
    auto_renew BOOLEAN DEFAULT true,
    split_payment BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID NOT NULL REFERENCES client_subscriptions(id) ON DELETE CASCADE,
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    payment_method VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SYSTEM LOGS & AUDIT
-- =====================================================

-- User login logs
CREATE TABLE login_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL, -- 'admin' or 'client'
    ip_address INET,
    user_agent TEXT,
    login_status VARCHAR(20) NOT NULL, -- 'success', 'failed'
    failure_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System activity logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_type VARCHAR(20), -- 'admin', 'client', 'system'
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50), -- 'lead', 'client', 'template', etc.
    resource_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Notification settings
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL, -- 'admin' or 'client'
    notification_type VARCHAR(50) NOT NULL, -- 'email', 'whatsapp', 'in_app'
    event_type VARCHAR(50) NOT NULL, -- 'new_lead', 'payment_due', 'sync_failed'
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications queue
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    user_type VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'info', 'success', 'warning', 'error'
    channel VARCHAR(20) NOT NULL, -- 'email', 'whatsapp', 'in_app'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
    read_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Leads indexes
CREATE INDEX idx_leads_admin_id ON leads(admin_id);
CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_source_id ON leads(source_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_phone ON leads(phone);
CREATE INDEX idx_leads_email ON leads(email);

-- Lead activities indexes
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at);

-- WhatsApp messages indexes
CREATE INDEX idx_whatsapp_messages_lead_id ON whatsapp_messages(lead_id);
CREATE INDEX idx_whatsapp_messages_status ON whatsapp_messages(status);
CREATE INDEX idx_whatsapp_messages_created_at ON whatsapp_messages(created_at);

-- Login logs indexes
CREATE INDEX idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX idx_login_logs_created_at ON login_logs(created_at);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_resource_type ON activity_logs(resource_type);

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample admin
INSERT INTO admins (id, email, password_hash, full_name, business_name, phone) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@marketingagency.com', crypt('admin123', gen_salt('bf')), 'John Smith', 'Digital Marketing Pro', '+1234567890');

-- Insert sample lead sources
INSERT INTO lead_sources (id, admin_id, name, display_name, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'facebook', 'Facebook', true),
('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'instagram', 'Instagram', true),
('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 'google', 'Google Ads', true),
('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 'linkedin', 'LinkedIn', true),
('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 'whatsapp', 'WhatsApp', true);

-- Insert sample clients
INSERT INTO clients (id, admin_id, email, password_hash, username, full_name, business_name, business_type, phone) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440000', 'client1@restaurant.com', crypt('client123', gen_salt('bf')), 'restaurant_client', 'Maria Garcia', 'Bella Vista Restaurant', 'Restaurant', '+1234567891'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440000', 'client2@salon.com', crypt('client123', gen_salt('bf')), 'salon_client', 'Sarah Johnson', 'Glamour Hair Salon', 'Beauty Salon', '+1234567892'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440000', 'client3@gym.com', crypt('client123', gen_salt('bf')), 'gym_client', 'Mike Wilson', 'FitLife Gym', 'Fitness Center', '+1234567893');

-- Insert sample subscription plans
INSERT INTO subscription_plans (id, admin_id, name, description, price, billing_cycle, max_leads, max_clients) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440000', 'Basic Plan', 'Perfect for small businesses', 99.00, 'monthly', 500, 5),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440000', 'Pro Plan', 'For growing businesses', 199.00, 'monthly', 2000, 15),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440000', 'Enterprise Plan', 'For large organizations', 499.00, 'monthly', 10000, 50);

-- Insert sample client subscriptions
INSERT INTO client_subscriptions (client_id, plan_id, status, start_date, end_date) VALUES
('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440020', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440021', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440020', 'active', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 month');

-- Insert sample leads
INSERT INTO leads (id, admin_id, client_id, source_id, full_name, email, phone, status, notes) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Alice Brown', 'alice@email.com', '+1234567894', 'new', 'Interested in dinner reservations'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Bob Davis', 'bob@email.com', '+1234567895', 'contacted', 'Called about catering services'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'Carol White', 'carol@email.com', '+1234567896', 'new', 'Looking for hair styling'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'David Miller', 'david@email.com', '+1234567897', 'qualified', 'Booked appointment for next week'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 'Eva Green', 'eva@email.com', '+1234567898', 'new', 'Interested in gym membership'),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440003', 'Frank Taylor', 'frank@email.com', '+1234567899', 'converted', 'Signed up for annual membership');

-- Insert sample WhatsApp templates
INSERT INTO whatsapp_templates (id, admin_id, name, template_id, category, body_text, footer_text, status) VALUES
('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440000', 'Welcome Message', 'welcome_new_lead', 'utility', 'Hi {{1}}, thank you for your interest! We will contact you shortly.', 'Best regards, {{2}}', 'approved'),
('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440000', 'Follow Up', 'follow_up_inactive', 'marketing', 'Hi {{1}}, we noticed you were interested in our services. Would you like to schedule a consultation?', 'Reply STOP to opt out', 'approved');

-- Insert sample automation rules
INSERT INTO whatsapp_automation_rules (admin_id, client_id, template_id, trigger_type, delay_minutes) VALUES
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440040', 'new_lead', 5),
('550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440040', 'new_lead', 10),
('550e8400-e29b-41d4-a716-446655440000', NULL, '550e8400-e29b-41d4-a716-446655440041', 'inactivity', 2880); -- 48 hours

-- Insert sample lead activities
INSERT INTO lead_activities (lead_id, user_id, user_type, activity_type, description) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440000', 'admin', 'note_added', 'Lead imported from Facebook'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440010', 'client', 'status_changed', 'Status changed from new to contacted'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440000', 'admin', 'whatsapp_sent', 'Welcome message sent via WhatsApp'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440011', 'client', 'note_added', 'Customer called and scheduled appointment');

-- Insert sample notification settings
INSERT INTO notification_settings (user_id, user_type, notification_type, event_type, is_enabled) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin', 'email', 'new_lead', true),
('550e8400-e29b-41d4-a716-446655440000', 'admin', 'email', 'sync_failed', true),
('550e8400-e29b-41d4-a716-446655440010', 'client', 'email', 'new_lead', true),
('550e8400-e29b-41d4-a716-446655440011', 'client', 'email', 'new_lead', true),
('550e8400-e29b-41d4-a716-446655440012', 'client', 'email', 'new_lead', true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_sources_updated_at BEFORE UPDATE ON lead_sources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_config_updated_at BEFORE UPDATE ON whatsapp_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_templates_updated_at BEFORE UPDATE ON whatsapp_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_automation_rules_updated_at BEFORE UPDATE ON whatsapp_automation_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_subscriptions_updated_at BEFORE UPDATE ON client_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_settings_updated_at BEFORE UPDATE ON notification_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log lead activities automatically
CREATE OR REPLACE FUNCTION log_lead_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Log status changes
        IF OLD.status != NEW.status THEN
            INSERT INTO lead_activities (lead_id, user_id, user_type, activity_type, description)
            VALUES (NEW.id, NEW.updated_by, 'system', 'status_changed', 
                   'Status changed from ' || OLD.status || ' to ' || NEW.status);
        END IF;
        
        -- Log notes changes
        IF OLD.notes != NEW.notes AND NEW.notes IS NOT NULL THEN
            INSERT INTO lead_activities (lead_id, user_id, user_type, activity_type, description)
            VALUES (NEW.id, NEW.updated_by, 'system', 'note_added', 'Notes updated');
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for lead statistics by client
CREATE VIEW client_lead_stats AS
SELECT 
    c.id as client_id,
    c.business_name,
    COUNT(l.id) as total_leads,
    COUNT(CASE WHEN l.created_at >= CURRENT_DATE THEN 1 END) as leads_today,
    COUNT(CASE WHEN l.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as leads_this_week,
    COUNT(CASE WHEN l.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as leads_this_month,
    COUNT(CASE WHEN l.status = 'converted' THEN 1 END) as converted_leads
FROM clients c
LEFT JOIN leads l ON c.id = l.client_id
GROUP BY c.id, c.business_name;

-- View for admin dashboard statistics
CREATE VIEW admin_dashboard_stats AS
SELECT 
    a.id as admin_id,
    COUNT(DISTINCT c.id) as total_clients,
    COUNT(DISTINCT l.id) as total_leads,
    COUNT(CASE WHEN l.created_at >= CURRENT_DATE THEN 1 END) as leads_today,
    COUNT(CASE WHEN l.created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as leads_this_week,
    COUNT(CASE WHEN wm.status = 'sent' AND wm.created_at >= CURRENT_DATE THEN 1 END) as whatsapp_sent_today
FROM admins a
LEFT JOIN clients c ON a.id = c.admin_id AND c.is_active = true
LEFT JOIN leads l ON a.id = l.admin_id
LEFT JOIN whatsapp_messages wm ON l.id = wm.lead_id
GROUP BY a.id;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Insert completion log
INSERT INTO activity_logs (user_type, action, resource_type, details) VALUES
('system', 'database_initialized', 'schema', '{"message": "CRM database schema created successfully with sample data"}');

-- Display success message
SELECT 'CRM Database Schema Created Successfully!' as status,
       'Sample admin login: admin@marketingagency.com / admin123' as admin_credentials,
       'Sample client login: client1@restaurant.com / client123' as client_credentials; 