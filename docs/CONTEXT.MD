# CRM SaaS for Marketing Agency

A comprehensive Customer Relationship Management system designed specifically for marketing agencies to manage multiple business clients and integrate various advertising and lead generation platforms.

## 👤 User Roles

### Admin
The marketing agency that manages multiple business clients and integrates all ad/lead platforms.

### Client
A business (e.g., restaurant, salon, gym) added by the Admin. They log in to view their leads.

## 🔐 Authentication System

| Role | Features |
|------|----------|
| **Admin** | Login, Forgot Password, Logout |
| **Client** | Login with credentials provided by Admin |

## 🧑‍💼 Admin Features

### 📊 Dashboard
- **KPI Cards**: Total leads, leads today, active clients, last sync, WhatsApp status
- **Charts**: Leads by source (Facebook, Instagram, Google, etc.)
- **Activity Feed**: Latest logins, new leads, sync failures

### 👥 Client Management
- ➕ **Add New Client**: Name, email, phone, business type with auto-generated credentials
- 📝 **Edit Client**: Update contact information and status
- 🗑️ **Delete Client**: Remove client accounts
- 👁️ **View Access Logs**: Monitor client login activity (IP, browser, time)

### 🔗 Lead Sources Integration
- **Facebook/Instagram**: OAuth login, select pages/forms
- **Google Ads**: OAuth login, select campaigns/extensions
- **LinkedIn**: Developer app tokens or OAuth
- **WhatsApp**: Cloud API setup (Phone ID, WABA ID, Access Token)

### 📈 Lead Management
- View comprehensive table of all leads
- **Filter Options**: Date, Platform, Client
- **Lead Status**: Mark as new, contacted, converted
- **Export**: CSV export functionality
- **Sync Status**: Monitor integration sync status

### 💬 WhatsApp Automation
- **Template Management**: Upload and manage WhatsApp templates
- **Automation Rules**:
  - On New Lead: send template A
  - On Inactivity (2 days): send template B
- **Per-Client Assignment**: Assign specific templates to clients
- **Message Logs**: View delivery status and history
- **Manual Testing**: Test templates before deployment

### 💳 Billing & Payments (Razorpay)
- **Payment Gateway**: Add Razorpay Key/Secret
- **Plan Management**: Create Monthly/Quarterly plans
- **Client Assignment**: Assign plans to specific clients
- **Split Payment**: Toggle payment sharing with clients
- **Billing Status**: Monitor client payment status
- **Auto-Reminders**: Automated payment due notifications

### 📋 Logs & Access Control
- **Client Login Logs**: Track client access patterns
- **Lead Viewing Logs**: Monitor lead interaction history
- **Action History**: Complete audit trail

### 🔔 Notifications
- **WhatsApp/Email Alerts**: Failed syncs, payment dues, login attempts
- **Real-time Updates**: Instant notifications for critical events

### ⚙️ Settings
- **Business Configuration**: Name, email, logo
- **API Management**: Store and manage API keys
- **Admin Security**: Password management

## 🧑 Client Features

### 📊 Dashboard
- **Overview Cards**: Leads today, this week, total leads
- **Source Breakdown**: Facebook, Google, Instagram analytics
- **Recent Activity**: Top 5 newest leads

### 📋 Leads Management
- **Comprehensive Table**: Name, Phone, Platform, Date, Status
- **Advanced Filtering**: Search and filter capabilities
- **Lead Details**: Click-through to detailed lead information

### 📄 Lead Detail Page
- **Complete Information**: Platform, phone, name, creation date
- **Notes Section**: Editable notes for lead management
- **WhatsApp History**: View sent messages and delivery status
- **Status Management**: Mark leads as converted

### 💬 WhatsApp History
- **Message Tracking**: View all sent templates
- **Delivery Status**: Monitor message delivery
- **Timeline**: Chronological message history
- **View-Only Access**: Clients cannot trigger new messages

### ⚙️ Settings
- **Password Management**: Update login credentials
- **Contact Information**: View business details
- **Support Access**: Request account assistance

### 💳 Billing (Optional)
- **Plan Overview**: View assigned plan details
- **Invoice History**: Access billing records
- **Payment Integration**: Razorpay payment links when applicable

## 🧭 Detailed User Flows

### 🧑‍💼 Admin Workflow

#### 🔹 1. Authentication
- **Login**: Email + password authentication
- **Password Recovery**: Email-based forgot password
- **Dashboard Redirect**: Automatic redirection post-login

#### 🔹 2. Dashboard Overview
- **KPI Monitoring**: Real-time metrics display
- **Visual Analytics**: Chart-based lead source analysis
- **Activity Monitoring**: Live feed of system activities

#### 🔹 3. Client Management
- **Client Onboarding**: Streamlined client addition process
- **Account Management**: Comprehensive client profile editing
- **Access Control**: Monitor and manage client access
- **Account Lifecycle**: Complete client account management

#### 🔹 4. Platform Integration Setup
- **OAuth Flows**: Secure platform authentication
- **Data Mapping**: Configure lead data synchronization
- **API Management**: Secure token and key management
- **Sync Configuration**: Set up automated data pulls

#### 🔹 5. Lead Processing
- **Centralized View**: All leads in unified interface
- **Advanced Filtering**: Multi-criteria lead filtering
- **Status Management**: Lead lifecycle tracking
- **Data Export**: Flexible export options

#### 🔹 6. WhatsApp Automation
- **Template Creation**: Design message templates
- **Rule Configuration**: Set up automation triggers
- **Client Assignment**: Customize per-client automation
- **Performance Monitoring**: Track message delivery and engagement

#### 🔹 7. Financial Management
- **Payment Setup**: Configure Razorpay integration
- **Plan Creation**: Design subscription models
- **Client Billing**: Manage client payment assignments
- **Revenue Tracking**: Monitor payment status and history

### 👤 Client Workflow

#### 🔹 1. Account Access
- **Credential Login**: Use admin-provided credentials
- **First-Time Setup**: Optional password update
- **Dashboard Access**: Immediate lead overview

#### 🔹 2. Lead Monitoring
- **Real-Time Updates**: Live lead notifications
- **Source Analytics**: Understand lead origins
- **Quick Access**: Rapid lead review capabilities

#### 🔹 3. Lead Management
- **Detailed Review**: Comprehensive lead information
- **Note Management**: Add and edit lead notes
- **Status Updates**: Track lead progression
- **Communication History**: Review all interactions

#### 🔹 4. Communication Tracking
- **WhatsApp Monitoring**: View automated message history
- **Delivery Confirmation**: Track message success rates
- **Timeline View**: Chronological communication log

#### 🔹 5. Account Management
- **Security**: Password and account settings
- **Information Access**: View business profile
- **Support**: Access help and assistance

#### 🔹 6. Billing Overview
- **Plan Details**: View subscription information
- **Payment History**: Access invoice records
- **Payment Processing**: Handle outstanding payments

## 🛠️ Technical Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **React Hook Form** with Yup validation

### Backend Integration
- **Supabase** for database and authentication
- **RESTful API** design
- **Real-time subscriptions** for live updates

### External Integrations
- **Facebook/Instagram Graph API**
- **Google Ads API**
- **LinkedIn Marketing API**
- **WhatsApp Business Cloud API**
- **Razorpay Payment Gateway**

### Security Features
- **JWT Authentication**
- **Role-based Access Control**
- **API Key Management**
- **Audit Logging**
- **Data Encryption**

## 📋 Development Roadmap

### Phase 1: Core Foundation
- [ ] Authentication system
- [ ] Basic dashboard
- [ ] Client management
- [ ] Lead display

### Phase 2: Integrations
- [ ] Facebook/Instagram API
- [ ] Google Ads API
- [ ] WhatsApp Business API
- [ ] LinkedIn API

### Phase 3: Automation
- [ ] WhatsApp automation
- [ ] Lead scoring
- [ ] Notification system
- [ ] Reporting

### Phase 4: Advanced Features
- [ ] Payment processing
- [ ] Advanced analytics
- [ ] Mobile responsiveness
- [ ] Performance optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- API keys for integrations

### Installation
```bash
npm install
npm run dev
```

### Environment Setup
Create `.env` file with required API keys and database configuration.

### Database Setup
Run the provided SQL schema in Supabase to set up the database structure.

---

*This documentation serves as the complete specification for the Marketing Agency CRM SaaS application.*
