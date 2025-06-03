import crypto from 'crypto';

// Verify WhatsApp webhook signature
const verifyWhatsAppSignature = (payload, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.WHATSAPP_WEBHOOK_SECRET || 'your_webhook_secret')
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expectedSignature}`),
    Buffer.from(signature)
  );
};

// Handle WhatsApp webhook verification
export const verifyWhatsAppWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log('WhatsApp webhook verification:', { mode, token });
  
  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('WhatsApp webhook verification failed');
    res.sendStatus(403);
  }
};

// Handle WhatsApp webhook events
export const handleWhatsAppWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    
    // Verify signature in production
    if (process.env.NODE_ENV === 'production' && signature && !verifyWhatsAppSignature(payload, signature)) {
      console.error('WhatsApp webhook signature verification failed');
      return res.sendStatus(403);
    }
    
    const body = req.body;
    console.log('WhatsApp webhook received:', JSON.stringify(body, null, 2));
    
    if (body.entry) {
      // Process each entry
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages') {
            await processWhatsAppMessages(change.value);
          }
        }
      }
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
};

// Process WhatsApp messages and status updates
const processWhatsAppMessages = async (messageData) => {
  try {
    const { messages, statuses, contacts, metadata } = messageData;
    
    // Process incoming messages
    if (messages) {
      for (const message of messages) {
        await processIncomingMessage(message, contacts, metadata);
      }
    }
    
    // Process message status updates
    if (statuses) {
      for (const status of statuses) {
        await processMessageStatus(status);
      }
    }
  } catch (error) {
    console.error('Error processing WhatsApp messages:', error);
  }
};

// Process incoming WhatsApp message
const processIncomingMessage = async (message, contacts, metadata) => {
  try {
    console.log('Processing incoming WhatsApp message:', {
      id: message.id,
      from: message.from,
      type: message.type,
      timestamp: message.timestamp
    });
    
    const contact = contacts?.find(c => c.wa_id === message.from);
    const contactName = contact?.profile?.name || 'Unknown';
    
    // Extract message content based on type
    let messageContent = '';
    switch (message.type) {
      case 'text':
        messageContent = message.text.body;
        break;
      case 'image':
        messageContent = `[Image] ${message.image.caption || ''}`;
        break;
      case 'document':
        messageContent = `[Document] ${message.document.filename || ''}`;
        break;
      case 'audio':
        messageContent = '[Audio Message]';
        break;
      case 'video':
        messageContent = `[Video] ${message.video.caption || ''}`;
        break;
      case 'location':
        messageContent = `[Location] ${message.location.name || 'Shared location'}`;
        break;
      default:
        messageContent = `[${message.type}]`;
    }
    
    // Save incoming message to database
    await saveIncomingMessage({
      message_id: message.id,
      from_number: message.from,
      contact_name: contactName,
      message_type: message.type,
      content: messageContent,
      timestamp: new Date(parseInt(message.timestamp) * 1000),
      raw_data: message,
      business_phone_id: metadata?.phone_number_id
    });
    
    // Auto-reply logic (if needed)
    await handleAutoReply(message, contactName);
    
  } catch (error) {
    console.error('Error processing incoming message:', error);
  }
};

// Process message status updates
const processMessageStatus = async (status) => {
  try {
    console.log('Processing WhatsApp message status:', {
      id: status.id,
      status: status.status,
      timestamp: status.timestamp,
      recipient_id: status.recipient_id
    });
    
    // Update message status in database
    await updateMessageStatus({
      message_id: status.id,
      status: status.status,
      timestamp: new Date(parseInt(status.timestamp) * 1000),
      recipient_id: status.recipient_id,
      pricing: status.pricing,
      conversation: status.conversation,
      errors: status.errors
    });
    
  } catch (error) {
    console.error('Error processing message status:', error);
  }
};

// Save incoming message to database
const saveIncomingMessage = async (messageData) => {
  try {
    console.log('Saving incoming WhatsApp message:', messageData);
    
    // Example Supabase integration:
    /*
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .insert({
        message_id: messageData.message_id,
        direction: 'incoming',
        from_number: messageData.from_number,
        to_number: messageData.business_phone_id,
        contact_name: messageData.contact_name,
        message_type: messageData.message_type,
        content: messageData.content,
        status: 'received',
        timestamp: messageData.timestamp,
        raw_data: messageData.raw_data
      });
    
    if (error) throw error;
    return data;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error saving incoming message:', error);
    throw error;
  }
};

// Update message status in database
const updateMessageStatus = async (statusData) => {
  try {
    console.log('Updating WhatsApp message status:', statusData);
    
    // Example Supabase integration:
    /*
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .update({
        status: statusData.status,
        delivered_at: statusData.status === 'delivered' ? statusData.timestamp : null,
        read_at: statusData.status === 'read' ? statusData.timestamp : null,
        failed_at: statusData.status === 'failed' ? statusData.timestamp : null,
        error_details: statusData.errors,
        pricing_info: statusData.pricing,
        conversation_info: statusData.conversation
      })
      .eq('message_id', statusData.message_id);
    
    if (error) throw error;
    return data;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

// Handle auto-reply logic
const handleAutoReply = async (message, contactName) => {
  try {
    // Simple auto-reply logic
    const messageText = message.text?.body?.toLowerCase() || '';
    
    // Don't auto-reply to certain message types
    if (message.type !== 'text') {
      return;
    }
    
    // Check if this is a business hours inquiry
    const isBusinessHours = checkBusinessHours();
    
    let replyTemplate = null;
    
    // Auto-reply based on keywords
    if (messageText.includes('hello') || messageText.includes('hi')) {
      replyTemplate = 'greeting_reply';
    } else if (messageText.includes('price') || messageText.includes('cost')) {
      replyTemplate = 'pricing_info';
    } else if (messageText.includes('hours') || messageText.includes('open')) {
      replyTemplate = 'business_hours';
    } else if (!isBusinessHours) {
      replyTemplate = 'after_hours_reply';
    }
    
    if (replyTemplate) {
      await sendAutoReply(message.from, replyTemplate, contactName);
    }
    
  } catch (error) {
    console.error('Error handling auto-reply:', error);
  }
};

// Send auto-reply message
const sendAutoReply = async (toNumber, templateName, contactName) => {
  try {
    const messageData = {
      messaging_product: "whatsapp",
      to: toNumber,
      type: "template",
      template: {
        name: templateName,
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: contactName }
            ]
          }
        ]
      }
    };
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      }
    );
    
    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Auto-reply sent:', result);
    
    // Save outgoing message to database
    await saveOutgoingMessage({
      message_id: result.messages[0].id,
      to_number: toNumber,
      template_name: templateName,
      status: 'sent',
      timestamp: new Date()
    });
    
    return result;
  } catch (error) {
    console.error('Error sending auto-reply:', error);
  }
};

// Save outgoing message to database
const saveOutgoingMessage = async (messageData) => {
  try {
    console.log('Saving outgoing WhatsApp message:', messageData);
    
    // Example Supabase integration:
    /*
    const { data, error } = await supabase
      .from('whatsapp_messages')
      .insert({
        message_id: messageData.message_id,
        direction: 'outgoing',
        from_number: process.env.WHATSAPP_PHONE_NUMBER_ID,
        to_number: messageData.to_number,
        message_type: 'template',
        template_name: messageData.template_name,
        status: messageData.status,
        timestamp: messageData.timestamp
      });
    
    if (error) throw error;
    return data;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error saving outgoing message:', error);
    throw error;
  }
};

// Check if current time is within business hours
const checkBusinessHours = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // Business hours: Monday-Friday 9 AM - 6 PM
  const isWeekday = day >= 1 && day <= 5;
  const isBusinessHour = hour >= 9 && hour < 18;
  
  return isWeekday && isBusinessHour;
}; 