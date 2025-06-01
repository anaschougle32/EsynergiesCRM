// WhatsApp Business API Service
import axios, { AxiosInstance } from 'axios';

// =====================================================
// WHATSAPP API CONFIGURATION
// =====================================================

interface WhatsAppConfig {
  phoneNumberId: string;
  accessToken: string;
  wabaId: string;
  apiVersion: string;
}

interface WhatsAppTemplate {
  name: string;
  language: string;
  components: Array<{
    type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
    format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
    text?: string;
    parameters?: Array<{
      type: 'text' | 'currency' | 'date_time';
      text?: string;
    }>;
    buttons?: Array<{
      type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
      text: string;
      url?: string;
      phone_number?: string;
    }>;
  }>;
}

interface WhatsAppMessage {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template' | 'text' | 'image' | 'document';
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters?: Array<{
        type: string;
        text: string;
      }>;
    }>;
  };
  text?: {
    body: string;
  };
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
        }>;
        statuses?: Array<{
          id: string;
          status: 'sent' | 'delivered' | 'read' | 'failed';
          timestamp: string;
          recipient_id: string;
          errors?: Array<{
            code: number;
            title: string;
            message: string;
          }>;
        }>;
      };
      field: string;
    }>;
  }>;
}

// =====================================================
// WHATSAPP BUSINESS API SERVICE
// =====================================================

export class WhatsAppService {
  private config: WhatsAppConfig;
  private apiClient: AxiosInstance;

  constructor(config: WhatsAppConfig) {
    this.config = config;
    this.apiClient = axios.create({
      baseURL: `https://graph.facebook.com/v${config.apiVersion}`,
      timeout: 30000,
      headers: {
        'Authorization': `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // =====================================================
  // MESSAGE SENDING
  // =====================================================

  // Send template message
  async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    languageCode: string = 'en',
    parameters?: Record<string, string>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Clean phone number (remove any non-digit characters except +)
      const cleanPhone = this.cleanPhoneNumber(phoneNumber);
      
      if (!cleanPhone) {
        throw new Error('Invalid phone number format');
      }

      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
          name: templateName,
          language: {
            code: languageCode
          }
        }
      };

      // Add parameters if provided
      if (parameters && Object.keys(parameters).length > 0) {
        message.template!.components = [
          {
            type: 'body',
            parameters: Object.values(parameters).map(value => ({
              type: 'text',
              text: value
            }))
          }
        ];
      }

      const response = await this.apiClient.post(
        `/${this.config.phoneNumberId}/messages`,
        message
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error: any) {
      console.error('Error sending WhatsApp template message:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Send text message (for customer service, not marketing)
  async sendTextMessage(
    phoneNumber: string,
    text: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const cleanPhone = this.cleanPhoneNumber(phoneNumber);
      
      if (!cleanPhone) {
        throw new Error('Invalid phone number format');
      }

      const message: WhatsAppMessage = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'text',
        text: {
          body: text
        }
      };

      const response = await this.apiClient.post(
        `/${this.config.phoneNumberId}/messages`,
        message
      );

      return {
        success: true,
        messageId: response.data.messages[0].id
      };
    } catch (error: any) {
      console.error('Error sending WhatsApp text message:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // =====================================================
  // TEMPLATE MANAGEMENT
  // =====================================================

  // Create message template
  async createTemplate(
    templateData: {
      name: string;
      category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION';
      language: string;
      components: Array<{
        type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS';
        format?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT';
        text?: string;
        buttons?: Array<{
          type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
          text: string;
          url?: string;
          phone_number?: string;
        }>;
      }>;
    }
  ): Promise<{ success: boolean; templateId?: string; error?: string }> {
    try {
      const response = await this.apiClient.post(
        `/${this.config.wabaId}/message_templates`,
        templateData
      );

      return {
        success: true,
        templateId: response.data.id
      };
    } catch (error: any) {
      console.error('Error creating WhatsApp template:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Get template status
  async getTemplateStatus(templateId: string): Promise<{
    success: boolean;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get(`/${templateId}`);
      
      return {
        success: true,
        status: response.data.status
      };
    } catch (error: any) {
      console.error('Error getting template status:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // List all templates
  async listTemplates(): Promise<{
    success: boolean;
    templates?: Array<any>;
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get(
        `/${this.config.wabaId}/message_templates`
      );

      return {
        success: true,
        templates: response.data.data
      };
    } catch (error: any) {
      console.error('Error listing templates:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Delete template
  async deleteTemplate(templateName: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      await this.apiClient.delete(
        `/${this.config.wabaId}/message_templates`,
        {
          data: { name: templateName }
        }
      );

      return { success: true };
    } catch (error: any) {
      console.error('Error deleting template:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // =====================================================
  // WEBHOOK HANDLING
  // =====================================================

  // Process incoming webhook
  static processWebhook(payload: WhatsAppWebhookPayload): {
    messageStatuses: Array<{
      messageId: string;
      status: string;
      timestamp: string;
      recipientId: string;
      error?: any;
    }>;
    incomingMessages: Array<{
      from: string;
      messageId: string;
      text?: string;
      timestamp: string;
    }>;
  } {
    const messageStatuses: any[] = [];
    const incomingMessages: any[] = [];

    try {
      for (const entry of payload.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            const value = change.value;

            // Process message status updates
            if (value.statuses) {
              for (const status of value.statuses) {
                messageStatuses.push({
                  messageId: status.id,
                  status: status.status,
                  timestamp: status.timestamp,
                  recipientId: status.recipient_id,
                  error: status.errors?.[0]
                });
              }
            }

            // Process incoming messages
            if (value.messages) {
              for (const message of value.messages) {
                incomingMessages.push({
                  from: message.from,
                  messageId: message.id,
                  text: message.text?.body,
                  timestamp: message.timestamp
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing WhatsApp webhook:', error);
    }

    return { messageStatuses, incomingMessages };
  }

  // Verify webhook signature
  static verifyWebhook(
    payload: string,
    signature: string,
    verifyToken: string
  ): boolean {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', verifyToken)
        .update(payload)
        .digest('hex');

      return signature === `sha256=${expectedSignature}`;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }

  // =====================================================
  // UTILITY METHODS
  // =====================================================

  // Clean and validate phone number
  private cleanPhoneNumber(phoneNumber: string): string | null {
    try {
      // Remove all non-digit characters except +
      let cleaned = phoneNumber.replace(/[^\d+]/g, '');
      
      // Remove leading + if present
      if (cleaned.startsWith('+')) {
        cleaned = cleaned.substring(1);
      }
      
      // Validate length (should be between 10-15 digits)
      if (cleaned.length < 10 || cleaned.length > 15) {
        return null;
      }
      
      // Return with country code (assuming international format)
      return cleaned;
    } catch (error) {
      console.error('Error cleaning phone number:', error);
      return null;
    }
  }

  // Test connection
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.apiClient.get(`/${this.config.phoneNumberId}`);
      
      if (response.data.verified_name) {
        return { success: true };
      } else {
        return { success: false, error: 'Phone number not verified' };
      }
    } catch (error: any) {
      console.error('Error testing WhatsApp connection:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  // Get account info
  async getAccountInfo(): Promise<{
    success: boolean;
    info?: {
      verifiedName: string;
      displayPhoneNumber: string;
      qualityRating: string;
    };
    error?: string;
  }> {
    try {
      const response = await this.apiClient.get(`/${this.config.phoneNumberId}`);
      
      return {
        success: true,
        info: {
          verifiedName: response.data.verified_name,
          displayPhoneNumber: response.data.display_phone_number,
          qualityRating: response.data.quality_rating
        }
      };
    } catch (error: any) {
      console.error('Error getting account info:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
}

// =====================================================
// WHATSAPP AUTOMATION SERVICE
// =====================================================

export class WhatsAppAutomationService {
  private whatsappService: WhatsAppService;

  constructor(config: WhatsAppConfig) {
    this.whatsappService = new WhatsAppService(config);
  }

  // Send welcome message to new lead
  async sendWelcomeMessage(
    phoneNumber: string,
    leadName: string,
    businessName: string,
    templateName: string = 'welcome_message'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return await this.whatsappService.sendTemplateMessage(
      phoneNumber,
      templateName,
      'en',
      {
        name: leadName,
        business_name: businessName
      }
    );
  }

  // Send follow-up message
  async sendFollowUpMessage(
    phoneNumber: string,
    leadName: string,
    businessName: string,
    templateName: string = 'follow_up'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return await this.whatsappService.sendTemplateMessage(
      phoneNumber,
      templateName,
      'en',
      {
        name: leadName,
        business_name: businessName
      }
    );
  }

  // Send appointment reminder
  async sendAppointmentReminder(
    phoneNumber: string,
    leadName: string,
    appointmentTime: string,
    templateName: string = 'appointment_reminder'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    return await this.whatsappService.sendTemplateMessage(
      phoneNumber,
      templateName,
      'en',
      {
        name: leadName,
        appointment_time: appointmentTime
      }
    );
  }

  // Process automation rules
  async processAutomationRules(
    leadId: string,
    triggerType: 'new_lead' | 'inactivity' | 'status_change',
    leadData: {
      phoneNumber: string;
      name: string;
      clientId: string;
    }
  ): Promise<void> {
    try {
      // This would fetch automation rules from the database
      // For now, we'll use mock rules
      const mockRules = [
        {
          id: '1',
          triggerType: 'new_lead',
          templateName: 'welcome_message',
          delayMinutes: 5,
          isActive: true
        },
        {
          id: '2',
          triggerType: 'inactivity',
          templateName: 'follow_up',
          delayMinutes: 2880, // 48 hours
          isActive: true
        }
      ];

      const applicableRules = mockRules.filter(rule => 
        rule.triggerType === triggerType && rule.isActive
      );

      for (const rule of applicableRules) {
        if (rule.delayMinutes > 0) {
          // Schedule message for later
          setTimeout(async () => {
            await this.sendTemplateMessage(
              leadData.phoneNumber,
              leadData.name,
              rule.templateName
            );
          }, rule.delayMinutes * 60 * 1000);
        } else {
          // Send immediately
          await this.sendTemplateMessage(
            leadData.phoneNumber,
            leadData.name,
            rule.templateName
          );
        }
      }
    } catch (error) {
      console.error('Error processing automation rules:', error);
    }
  }

  private async sendTemplateMessage(
    phoneNumber: string,
    leadName: string,
    templateName: string
  ): Promise<void> {
    try {
      const result = await this.whatsappService.sendTemplateMessage(
        phoneNumber,
        templateName,
        'en',
        { name: leadName }
      );

      if (result.success) {
        console.log(`WhatsApp message sent successfully: ${result.messageId}`);
        // Here you would update the database with the message status
      } else {
        console.error(`Failed to send WhatsApp message: ${result.error}`);
      }
    } catch (error) {
      console.error('Error in sendTemplateMessage:', error);
    }
  }
}

// =====================================================
// FACTORY FUNCTION
// =====================================================

export function createWhatsAppService(config: {
  phoneNumberId: string;
  accessToken: string;
  wabaId: string;
  apiVersion?: string;
}): WhatsAppService {
  return new WhatsAppService({
    ...config,
    apiVersion: config.apiVersion || '18.0'
  });
}

export function createWhatsAppAutomationService(config: {
  phoneNumberId: string;
  accessToken: string;
  wabaId: string;
  apiVersion?: string;
}): WhatsAppAutomationService {
  return new WhatsAppAutomationService({
    ...config,
    apiVersion: config.apiVersion || '18.0'
  });
}

// =====================================================
// COMMON TEMPLATES
// =====================================================

export const commonTemplates = {
  welcome_message: {
    name: 'welcome_message',
    category: 'UTILITY' as const,
    language: 'en',
    components: [
      {
        type: 'BODY' as const,
        text: 'Hi {{1}}, thank you for your interest! We will contact you shortly.'
      },
      {
        type: 'FOOTER' as const,
        text: 'Best regards, {{2}}'
      }
    ]
  },
  
  follow_up: {
    name: 'follow_up',
    category: 'MARKETING' as const,
    language: 'en',
    components: [
      {
        type: 'BODY' as const,
        text: 'Hi {{1}}, we noticed you were interested in our services. Would you like to schedule a consultation?'
      },
      {
        type: 'FOOTER' as const,
        text: 'Reply STOP to opt out'
      }
    ]
  },
  
  appointment_reminder: {
    name: 'appointment_reminder',
    category: 'UTILITY' as const,
    language: 'en',
    components: [
      {
        type: 'BODY' as const,
        text: 'Hi {{1}}, this is a reminder about your appointment tomorrow at {{2}}.'
      },
      {
        type: 'FOOTER' as const,
        text: 'See you soon!'
      }
    ]
  }
};

export default WhatsAppService; 