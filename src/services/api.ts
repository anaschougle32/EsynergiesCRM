// API Service for CRM Lead Capture and Automation
import axios, { AxiosInstance } from 'axios';

// Base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =====================================================
// LEAD CAPTURE APIs
// =====================================================

export interface Lead {
  id?: string;
  fullName: string;
  email?: string;
  phone: string;
  source: 'meta_ads' | 'google_ads' | 'linkedin' | 'whatsapp' | 'manual';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  clientId: string;
  externalId?: string;
  leadData?: Record<string, any>;
  notes?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt?: string;
}

export interface WebhookPayload {
  source: string;
  clientId: string;
  leadData: any;
  timestamp: string;
}

// Lead Management API
export const leadAPI = {
  // Create new lead (from webhook or manual)
  createLead: async (leadData: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> => {
    const response = await apiClient.post('/leads', leadData);
    return response.data;
  },

  // Get leads for client
  getLeads: async (clientId: string, filters?: any): Promise<Lead[]> => {
    const response = await apiClient.get(`/leads/client/${clientId}`, { params: filters });
    return response.data;
  },

  // Get all leads (admin)
  getAllLeads: async (filters?: any): Promise<Lead[]> => {
    const response = await apiClient.get('/leads', { params: filters });
    return response.data;
  },

  // Update lead
  updateLead: async (leadId: string, updates: Partial<Lead>): Promise<Lead> => {
    const response = await apiClient.patch(`/leads/${leadId}`, updates);
    return response.data;
  },

  // Delete lead
  deleteLead: async (leadId: string): Promise<void> => {
    await apiClient.delete(`/leads/${leadId}`);
  },

  // Get lead by ID
  getLeadById: async (leadId: string): Promise<Lead> => {
    const response = await apiClient.get(`/leads/${leadId}`);
    return response.data;
  }
};

// =====================================================
// WEBHOOK APIs (for receiving leads from platforms)
// =====================================================

export const webhookAPI = {
  // Facebook/Instagram webhook handler
  handleFacebookWebhook: async (payload: any): Promise<void> => {
    await apiClient.post('/webhooks/facebook', payload);
  },

  // Google Ads webhook handler
  handleGoogleAdsWebhook: async (payload: any): Promise<void> => {
    await apiClient.post('/webhooks/google-ads', payload);
  },

  // LinkedIn webhook handler
  handleLinkedInWebhook: async (payload: any): Promise<void> => {
    await apiClient.post('/webhooks/linkedin', payload);
  },

  // Pabbly Connect webhook handler (unified)
  handlePabblyWebhook: async (payload: WebhookPayload): Promise<void> => {
    await apiClient.post('/webhooks/pabbly', payload);
  },

  // Zapier webhook handler (unified)
  handleZapierWebhook: async (payload: WebhookPayload): Promise<void> => {
    await apiClient.post('/webhooks/zapier', payload);
  }
};

// =====================================================
// INTEGRATION MANAGEMENT APIs
// =====================================================

export interface Integration {
  id: string;
  clientId: string;
  platform: 'meta_ads' | 'google_ads' | 'linkedin' | 'whatsapp';
  status: 'connected' | 'pending' | 'error' | 'not_started';
  config: Record<string, any>;
  lastSync?: string;
  syncStatus?: 'success' | 'error' | 'syncing';
  errorMessage?: string;
}

export const integrationAPI = {
  // Get client integrations
  getClientIntegrations: async (clientId: string): Promise<Integration[]> => {
    const response = await apiClient.get(`/integrations/client/${clientId}`);
    return response.data;
  },

  // Get all integrations (admin)
  getAllIntegrations: async (): Promise<Integration[]> => {
    const response = await apiClient.get('/integrations');
    return response.data;
  },

  // Create/Update integration
  saveIntegration: async (integration: Omit<Integration, 'id'>): Promise<Integration> => {
    const response = await apiClient.post('/integrations', integration);
    return response.data;
  },

  // Test integration connection
  testIntegration: async (integrationId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/integrations/${integrationId}/test`);
    return response.data;
  },

  // Delete integration
  deleteIntegration: async (integrationId: string): Promise<void> => {
    await apiClient.delete(`/integrations/${integrationId}`);
  },

  // Trigger manual sync
  syncIntegration: async (integrationId: string): Promise<void> => {
    await apiClient.post(`/integrations/${integrationId}/sync`);
  }
};

// =====================================================
// WHATSAPP BUSINESS APIs
// =====================================================

export interface WhatsAppTemplate {
  id: string;
  name: string;
  templateId: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'pending' | 'approved' | 'rejected';
  bodyText: string;
  footerText?: string;
  headerType?: 'text' | 'image' | 'video' | 'document';
  headerContent?: string;
  buttons?: any[];
  variables?: string[];
  isActive: boolean;
}

export interface WhatsAppMessage {
  id: string;
  leadId: string;
  templateId?: string;
  phoneNumber: string;
  messageContent: string;
  whatsappMessageId?: string;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  errorMessage?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  templateId: string;
  triggerType: 'new_lead' | 'inactivity' | 'status_change';
  triggerConditions?: Record<string, any>;
  delayMinutes: number;
  clientId?: string;
  isActive: boolean;
}

export const whatsappAPI = {
  // Template Management
  getTemplates: async (): Promise<WhatsAppTemplate[]> => {
    const response = await apiClient.get('/whatsapp/templates');
    return response.data;
  },

  createTemplate: async (template: Omit<WhatsAppTemplate, 'id'>): Promise<WhatsAppTemplate> => {
    const response = await apiClient.post('/whatsapp/templates', template);
    return response.data;
  },

  updateTemplate: async (templateId: string, updates: Partial<WhatsAppTemplate>): Promise<WhatsAppTemplate> => {
    const response = await apiClient.patch(`/whatsapp/templates/${templateId}`, updates);
    return response.data;
  },

  deleteTemplate: async (templateId: string): Promise<void> => {
    await apiClient.delete(`/whatsapp/templates/${templateId}`);
  },

  // Message Management
  sendMessage: async (message: {
    leadId: string;
    templateId: string;
    phoneNumber: string;
    variables?: Record<string, string>;
  }): Promise<WhatsAppMessage> => {
    const response = await apiClient.post('/whatsapp/send', message);
    return response.data;
  },

  getMessages: async (leadId?: string): Promise<WhatsAppMessage[]> => {
    const params = leadId ? { leadId } : {};
    const response = await apiClient.get('/whatsapp/messages', { params });
    return response.data;
  },

  // Automation Rules
  getAutomationRules: async (): Promise<AutomationRule[]> => {
    const response = await apiClient.get('/whatsapp/automation-rules');
    return response.data;
  },

  createAutomationRule: async (rule: Omit<AutomationRule, 'id'>): Promise<AutomationRule> => {
    const response = await apiClient.post('/whatsapp/automation-rules', rule);
    return response.data;
  },

  updateAutomationRule: async (ruleId: string, updates: Partial<AutomationRule>): Promise<AutomationRule> => {
    const response = await apiClient.patch(`/whatsapp/automation-rules/${ruleId}`, updates);
    return response.data;
  },

  deleteAutomationRule: async (ruleId: string): Promise<void> => {
    await apiClient.delete(`/whatsapp/automation-rules/${ruleId}`);
  },

  // Configuration
  getConfig: async (): Promise<any> => {
    const response = await apiClient.get('/whatsapp/config');
    return response.data;
  },

  updateConfig: async (config: any): Promise<any> => {
    const response = await apiClient.post('/whatsapp/config', config);
    return response.data;
  },

  testConnection: async (): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post('/whatsapp/test-connection');
    return response.data;
  }
};

// =====================================================
// PAYMENT & BILLING APIs (Razorpay)
// =====================================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  maxLeads: number;
  maxClients: number;
  features: string[];
  isActive: boolean;
}

export interface ClientSubscription {
  id: string;
  clientId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  splitPayment: boolean;
  autoRenew: boolean;
  nextPayment: string;
}

export interface Payment {
  id: string;
  clientId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  createdAt: string;
}

export const billingAPI = {
  // Subscription Plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await apiClient.get('/billing/plans');
    return response.data;
  },

  createPlan: async (plan: Omit<SubscriptionPlan, 'id'>): Promise<SubscriptionPlan> => {
    const response = await apiClient.post('/billing/plans', plan);
    return response.data;
  },

  updatePlan: async (planId: string, updates: Partial<SubscriptionPlan>): Promise<SubscriptionPlan> => {
    const response = await apiClient.patch(`/billing/plans/${planId}`, updates);
    return response.data;
  },

  // Client Subscriptions
  getClientSubscriptions: async (clientId?: string): Promise<ClientSubscription[]> => {
    const params = clientId ? { clientId } : {};
    const response = await apiClient.get('/billing/subscriptions', { params });
    return response.data;
  },

  assignPlan: async (subscription: Omit<ClientSubscription, 'id'>): Promise<ClientSubscription> => {
    const response = await apiClient.post('/billing/subscriptions', subscription);
    return response.data;
  },

  updateSubscription: async (subscriptionId: string, updates: Partial<ClientSubscription>): Promise<ClientSubscription> => {
    const response = await apiClient.patch(`/billing/subscriptions/${subscriptionId}`, updates);
    return response.data;
  },

  // Payments
  getPayments: async (clientId?: string): Promise<Payment[]> => {
    const params = clientId ? { clientId } : {};
    const response = await apiClient.get('/billing/payments', { params });
    return response.data;
  },

  createPaymentLink: async (subscriptionId: string): Promise<{ paymentLink: string }> => {
    const response = await apiClient.post(`/billing/payments/create-link/${subscriptionId}`);
    return response.data;
  },

  verifyPayment: async (paymentId: string, razorpaySignature: string): Promise<Payment> => {
    const response = await apiClient.post('/billing/payments/verify', {
      paymentId,
      razorpaySignature
    });
    return response.data;
  },

  // Razorpay webhook handler
  handleRazorpayWebhook: async (payload: any): Promise<void> => {
    await apiClient.post('/billing/webhooks/razorpay', payload);
  }
};

// =====================================================
// ANALYTICS & REPORTING APIs
// =====================================================

export interface DashboardStats {
  totalLeads: number;
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  conversionRate: number;
  activeClients: number;
  whatsappSent: number;
  whatsappDelivered: number;
  lastSync: string;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<string, number>;
  revenueThisMonth: number;
  activeSubscriptions: number;
}

export const analyticsAPI = {
  // Dashboard stats
  getDashboardStats: async (clientId?: string): Promise<DashboardStats> => {
    const params = clientId ? { clientId } : {};
    const response = await apiClient.get('/analytics/dashboard', { params });
    return response.data;
  },

  // Lead analytics
  getLeadAnalytics: async (filters: {
    clientId?: string;
    startDate?: string;
    endDate?: string;
    source?: string;
  }): Promise<any> => {
    const response = await apiClient.get('/analytics/leads', { params: filters });
    return response.data;
  },

  // WhatsApp analytics
  getWhatsAppAnalytics: async (filters: {
    clientId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    const response = await apiClient.get('/analytics/whatsapp', { params: filters });
    return response.data;
  },

  // Revenue analytics
  getRevenueAnalytics: async (filters: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> => {
    const response = await apiClient.get('/analytics/revenue', { params: filters });
    return response.data;
  }
};

// =====================================================
// CLIENT MANAGEMENT APIs
// =====================================================

export interface Client {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  businessName: string;
  businessType: string;
  status: 'active' | 'inactive' | 'suspended';
  loginCredentials: {
    email: string;
    password: string;
  };
  createdAt: string;
  lastLoginAt?: string;
}

export const clientAPI = {
  // Get all clients (admin)
  getClients: async (): Promise<Client[]> => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  // Create new client
  createClient: async (client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> => {
    const response = await apiClient.post('/clients', client);
    return response.data;
  },

  // Update client
  updateClient: async (clientId: string, updates: Partial<Client>): Promise<Client> => {
    const response = await apiClient.patch(`/clients/${clientId}`, updates);
    return response.data;
  },

  // Delete client
  deleteClient: async (clientId: string): Promise<void> => {
    await apiClient.delete(`/clients/${clientId}`);
  },

  // Get client by ID
  getClientById: async (clientId: string): Promise<Client> => {
    const response = await apiClient.get(`/clients/${clientId}`);
    return response.data;
  }
};

// =====================================================
// NOTIFICATION APIs
// =====================================================

export interface NotificationSettings {
  emailNewLead: boolean;
  emailSyncFailed: boolean;
  emailPaymentDue: boolean;
  emailLoginAttempts: boolean;
  whatsappNewLead: boolean;
  whatsappSyncFailed: boolean;
  whatsappPaymentDue: boolean;
}

export const notificationAPI = {
  getSettings: async (): Promise<NotificationSettings> => {
    const response = await apiClient.get('/notifications/settings');
    return response.data;
  },

  updateSettings: async (settings: NotificationSettings): Promise<NotificationSettings> => {
    const response = await apiClient.post('/notifications/settings', settings);
    return response.data;
  },

  sendTestNotification: async (type: 'email' | 'whatsapp', message: string): Promise<{ success: boolean }> => {
    const response = await apiClient.post('/notifications/test', { type, message });
    return response.data;
  }
};

// Export the main API client for custom requests
export default apiClient; 