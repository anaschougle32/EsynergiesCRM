// Webhook Service for handling incoming leads from various platforms
import { leadAPI, whatsappAPI, WebhookPayload } from './api';

// =====================================================
// WEBHOOK PAYLOAD INTERFACES
// =====================================================

export interface FacebookWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    time: number;
    changes: Array<{
      field: string;
      value: {
        leadgen_id: string;
        page_id: string;
        form_id: string;
        adgroup_id: string;
        ad_id: string;
        created_time: number;
      };
    }>;
  }>;
}

export interface GoogleAdsWebhookPayload {
  lead_id: string;
  customer_id: string;
  campaign_id: string;
  ad_group_id: string;
  form_id: string;
  lead_data: {
    name?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  created_time: string;
}

export interface LinkedInWebhookPayload {
  leadId: string;
  formId: string;
  campaignId: string;
  leadData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  submittedAt: string;
}

export interface PabblyWebhookPayload {
  source: 'meta_ads' | 'google_ads' | 'linkedin' | 'whatsapp';
  clientId: string;
  leadData: {
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    source_url?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    [key: string]: any;
  };
  timestamp: string;
  externalId?: string;
}

// =====================================================
// WEBHOOK HANDLERS
// =====================================================

export class WebhookService {
  
  // Facebook/Instagram Lead Ads Webhook Handler
  static async handleFacebookWebhook(payload: FacebookWebhookPayload, clientId: string): Promise<void> {
    try {
      console.log('Processing Facebook webhook:', payload);

      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'leadgen') {
            const leadgenId = change.value.leadgen_id;
            
            // Fetch lead data from Facebook Graph API
            const leadData = await this.fetchFacebookLeadData(leadgenId);
            
            if (leadData) {
              await this.createLeadFromWebhook({
                source: 'meta_ads',
                clientId,
                leadData: {
                  ...leadData,
                  page_id: change.value.page_id,
                  form_id: change.value.form_id,
                  ad_id: change.value.ad_id,
                  adgroup_id: change.value.adgroup_id
                },
                timestamp: new Date(change.value.created_time * 1000).toISOString(),
                externalId: leadgenId
              });
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing Facebook webhook:', error);
      throw error;
    }
  }

  // Google Ads Lead Form Webhook Handler
  static async handleGoogleAdsWebhook(payload: GoogleAdsWebhookPayload, clientId: string): Promise<void> {
    try {
      console.log('Processing Google Ads webhook:', payload);

      await this.createLeadFromWebhook({
        source: 'google_ads',
        clientId,
        leadData: {
          ...payload.lead_data,
          customer_id: payload.customer_id,
          campaign_id: payload.campaign_id,
          ad_group_id: payload.ad_group_id,
          form_id: payload.form_id
        },
        timestamp: payload.created_time,
        externalId: payload.lead_id
      });
    } catch (error) {
      console.error('Error processing Google Ads webhook:', error);
      throw error;
    }
  }

  // LinkedIn Lead Gen Forms Webhook Handler
  static async handleLinkedInWebhook(payload: LinkedInWebhookPayload, clientId: string): Promise<void> {
    try {
      console.log('Processing LinkedIn webhook:', payload);

      const fullName = payload.leadData.firstName && payload.leadData.lastName 
        ? `${payload.leadData.firstName} ${payload.leadData.lastName}`
        : payload.leadData.firstName || payload.leadData.lastName || 'Unknown';

      await this.createLeadFromWebhook({
        source: 'linkedin',
        clientId,
        leadData: {
          ...payload.leadData,
          name: fullName,
          form_id: payload.formId,
          campaign_id: payload.campaignId
        },
        timestamp: payload.submittedAt,
        externalId: payload.leadId
      });
    } catch (error) {
      console.error('Error processing LinkedIn webhook:', error);
      throw error;
    }
  }

  // Pabbly Connect Unified Webhook Handler
  static async handlePabblyWebhook(payload: PabblyWebhookPayload): Promise<void> {
    try {
      console.log('Processing Pabbly webhook:', payload);

      await this.createLeadFromWebhook(payload);
    } catch (error) {
      console.error('Error processing Pabbly webhook:', error);
      throw error;
    }
  }

  // Zapier Unified Webhook Handler
  static async handleZapierWebhook(payload: PabblyWebhookPayload): Promise<void> {
    try {
      console.log('Processing Zapier webhook:', payload);

      await this.createLeadFromWebhook(payload);
    } catch (error) {
      console.error('Error processing Zapier webhook:', error);
      throw error;
    }
  }

  // =====================================================
  // HELPER METHODS
  // =====================================================

  // Create lead from webhook data
  private static async createLeadFromWebhook(payload: WebhookPayload): Promise<void> {
    try {
      // Normalize lead data
      const leadData = this.normalizeLead(payload);

      // Create lead in database
      const createdLead = await leadAPI.createLead(leadData);
      console.log('Lead created:', createdLead);

      // Trigger WhatsApp automation
      await this.triggerWhatsAppAutomation(createdLead);

    } catch (error) {
      console.error('Error creating lead from webhook:', error);
      throw error;
    }
  }

  // Normalize lead data from different sources
  private static normalizeLead(payload: WebhookPayload): any {
    const { leadData, source, clientId, externalId } = payload;

    // Extract name
    let fullName = leadData.name || leadData.full_name;
    if (!fullName && leadData.firstName && leadData.lastName) {
      fullName = `${leadData.firstName} ${leadData.lastName}`;
    }
    if (!fullName && leadData.first_name && leadData.last_name) {
      fullName = `${leadData.first_name} ${leadData.last_name}`;
    }
    if (!fullName) {
      fullName = leadData.firstName || leadData.first_name || 'Unknown';
    }

    // Extract phone (normalize format)
    let phone = leadData.phone || leadData.phone_number || leadData.mobile;
    if (phone) {
      // Remove any non-digit characters except +
      phone = phone.replace(/[^\d+]/g, '');
      // Ensure it starts with + if it's an international number
      if (!phone.startsWith('+') && phone.length > 10) {
        phone = '+' + phone;
      }
    }

    // Extract email
    const email = leadData.email || leadData.email_address;

    return {
      fullName,
      email,
      phone,
      source,
      status: 'new',
      clientId,
      externalId,
      leadData: leadData,
      sourceUrl: leadData.source_url,
      utmSource: leadData.utm_source,
      utmMedium: leadData.utm_medium,
      utmCampaign: leadData.utm_campaign,
      notes: this.generateInitialNotes(source, leadData)
    };
  }

  // Generate initial notes based on source and data
  private static generateInitialNotes(source: string, leadData: any): string {
    const notes = [`Lead captured from ${source.replace('_', ' ').toUpperCase()}`];

    if (leadData.campaign_id) {
      notes.push(`Campaign ID: ${leadData.campaign_id}`);
    }
    if (leadData.ad_id) {
      notes.push(`Ad ID: ${leadData.ad_id}`);
    }
    if (leadData.form_id) {
      notes.push(`Form ID: ${leadData.form_id}`);
    }

    // Add any custom fields
    const customFields = Object.keys(leadData).filter(key => 
      !['name', 'firstName', 'lastName', 'email', 'phone', 'campaign_id', 'ad_id', 'form_id'].includes(key)
    );

    if (customFields.length > 0) {
      notes.push('Additional info:');
      customFields.forEach(field => {
        if (leadData[field] && typeof leadData[field] === 'string') {
          notes.push(`${field}: ${leadData[field]}`);
        }
      });
    }

    return notes.join('\n');
  }

  // Trigger WhatsApp automation for new lead
  private static async triggerWhatsAppAutomation(lead: any): Promise<void> {
    try {
      if (!lead.phone) {
        console.log('No phone number available for WhatsApp automation');
        return;
      }

      // Get automation rules for new leads
      const automationRules = await whatsappAPI.getAutomationRules();
      const newLeadRules = automationRules.filter(rule => 
        rule.triggerType === 'new_lead' && 
        rule.isActive &&
        (!rule.clientId || rule.clientId === lead.clientId)
      );

      for (const rule of newLeadRules) {
        // Apply delay if specified
        if (rule.delayMinutes > 0) {
          setTimeout(async () => {
            await this.sendWhatsAppMessage(lead, rule);
          }, rule.delayMinutes * 60 * 1000);
        } else {
          await this.sendWhatsAppMessage(lead, rule);
        }
      }
    } catch (error) {
      console.error('Error triggering WhatsApp automation:', error);
    }
  }

  // Send WhatsApp message
  private static async sendWhatsAppMessage(lead: any, rule: any): Promise<void> {
    try {
      await whatsappAPI.sendMessage({
        leadId: lead.id,
        templateId: rule.templateId,
        phoneNumber: lead.phone,
        variables: {
          name: lead.fullName,
          business_name: 'Your Business' // This should come from client settings
        }
      });

      console.log(`WhatsApp message sent to ${lead.phone} using template ${rule.templateId}`);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
    }
  }

  // Fetch lead data from Facebook Graph API
  private static async fetchFacebookLeadData(leadgenId: string): Promise<any> {
    try {
      // This would make an actual API call to Facebook Graph API
      // For now, return mock data
      return {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890'
      };
    } catch (error) {
      console.error('Error fetching Facebook lead data:', error);
      return null;
    }
  }

  // Webhook verification for Facebook
  static verifyFacebookWebhook(mode: string, token: string, challenge: string): string | null {
    const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN || 'your_verify_token';
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Facebook webhook verified');
      return challenge;
    } else {
      console.error('Facebook webhook verification failed');
      return null;
    }
  }

  // Webhook verification for Google Ads
  static verifyGoogleAdsWebhook(signature: string, payload: string): boolean {
    const SECRET = process.env.GOOGLE_ADS_WEBHOOK_SECRET || 'your_secret';
    
    // Implement signature verification logic
    // This is a simplified version
    return signature === SECRET;
  }
}

// =====================================================
// WEBHOOK ROUTE HANDLERS (for Express.js backend)
// =====================================================

export const webhookRoutes = {
  // Facebook webhook endpoint
  facebook: async (req: any, res: any) => {
    try {
      // Verify webhook (GET request)
      if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        const verification = WebhookService.verifyFacebookWebhook(mode, token, challenge);
        if (verification) {
          res.status(200).send(challenge);
        } else {
          res.status(403).send('Forbidden');
        }
        return;
      }

      // Process webhook (POST request)
      const clientId = req.headers['x-client-id'] || req.query.clientId;
      if (!clientId) {
        res.status(400).json({ error: 'Client ID required' });
        return;
      }

      await WebhookService.handleFacebookWebhook(req.body, clientId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Facebook webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Google Ads webhook endpoint
  googleAds: async (req: any, res: any) => {
    try {
      const signature = req.headers['x-google-signature'];
      const isValid = WebhookService.verifyGoogleAdsWebhook(signature, JSON.stringify(req.body));
      
      if (!isValid) {
        res.status(403).json({ error: 'Invalid signature' });
        return;
      }

      const clientId = req.headers['x-client-id'] || req.query.clientId;
      if (!clientId) {
        res.status(400).json({ error: 'Client ID required' });
        return;
      }

      await WebhookService.handleGoogleAdsWebhook(req.body, clientId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Google Ads webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // LinkedIn webhook endpoint
  linkedin: async (req: any, res: any) => {
    try {
      const clientId = req.headers['x-client-id'] || req.query.clientId;
      if (!clientId) {
        res.status(400).json({ error: 'Client ID required' });
        return;
      }

      await WebhookService.handleLinkedInWebhook(req.body, clientId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('LinkedIn webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Pabbly Connect webhook endpoint
  pabbly: async (req: any, res: any) => {
    try {
      await WebhookService.handlePabblyWebhook(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Pabbly webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Zapier webhook endpoint
  zapier: async (req: any, res: any) => {
    try {
      await WebhookService.handleZapierWebhook(req.body);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Zapier webhook error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export default WebhookService; 