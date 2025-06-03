import crypto from 'crypto';

// Verify Facebook webhook signature
const verifyFacebookSignature = (payload, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(`sha256=${expectedSignature}`),
    Buffer.from(signature)
  );
};

// Handle Facebook webhook verification
export const verifyFacebookWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  console.log('Facebook webhook verification:', { mode, token });
  
  if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    console.log('Facebook webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('Facebook webhook verification failed');
    res.sendStatus(403);
  }
};

// Handle Facebook webhook events
export const handleFacebookWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const payload = JSON.stringify(req.body);
    
    // Verify signature in production
    if (process.env.NODE_ENV === 'production' && !verifyFacebookSignature(payload, signature)) {
      console.error('Facebook webhook signature verification failed');
      return res.sendStatus(403);
    }
    
    const body = req.body;
    console.log('Facebook webhook received:', JSON.stringify(body, null, 2));
    
    if (body.object === 'page') {
      // Process each entry
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'leadgen') {
            await processFacebookLead(change.value);
          }
        }
      }
    }
    
    res.status(200).send('EVENT_RECEIVED');
  } catch (error) {
    console.error('Facebook webhook error:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
};

// Process Facebook lead
const processFacebookLead = async (leadData) => {
  try {
    const { leadgen_id, form_id, page_id, created_time } = leadData;
    
    console.log('Processing Facebook lead:', {
      leadgen_id,
      form_id,
      page_id,
      created_time
    });
    
    // Fetch detailed lead information from Facebook API
    const leadDetails = await fetchFacebookLeadDetails(leadgen_id);
    
    if (leadDetails) {
      // Save lead to database
      await saveFacebookLead({
        leadgen_id,
        form_id,
        page_id,
        created_time,
        ...leadDetails
      });
      
      // Trigger WhatsApp automation if phone number exists
      if (leadDetails.phone_number) {
        await triggerWhatsAppAutomation(leadDetails);
      }
    }
  } catch (error) {
    console.error('Error processing Facebook lead:', error);
  }
};

// Fetch lead details from Facebook API
const fetchFacebookLeadDetails = async (leadgenId) => {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${accessToken}`
    );
    
    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse field data
    const leadInfo = {};
    if (data.field_data) {
      data.field_data.forEach(field => {
        leadInfo[field.name] = field.values[0];
      });
    }
    
    return {
      id: data.id,
      created_time: data.created_time,
      ad_id: data.ad_id,
      ad_name: data.ad_name,
      adset_id: data.adset_id,
      adset_name: data.adset_name,
      campaign_id: data.campaign_id,
      campaign_name: data.campaign_name,
      form_id: data.form_id,
      form_name: data.form_name,
      is_organic: data.is_organic,
      platform: data.platform,
      ...leadInfo
    };
  } catch (error) {
    console.error('Error fetching Facebook lead details:', error);
    return null;
  }
};

// Save Facebook lead to database
const saveFacebookLead = async (leadData) => {
  try {
    // This would integrate with your Supabase database
    console.log('Saving Facebook lead to database:', leadData);
    
    // Example Supabase integration:
    /*
    const { data, error } = await supabase
      .from('leads')
      .insert({
        source: 'meta_ads',
        platform: leadData.platform || 'facebook',
        external_id: leadData.leadgen_id,
        name: leadData.full_name || leadData.first_name + ' ' + leadData.last_name,
        email: leadData.email,
        phone: leadData.phone_number,
        form_id: leadData.form_id,
        form_name: leadData.form_name,
        ad_id: leadData.ad_id,
        ad_name: leadData.ad_name,
        campaign_id: leadData.campaign_id,
        campaign_name: leadData.campaign_name,
        raw_data: leadData,
        created_at: leadData.created_time
      });
    
    if (error) throw error;
    return data;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error saving Facebook lead:', error);
    throw error;
  }
};

// Trigger WhatsApp automation
const triggerWhatsAppAutomation = async (leadData) => {
  try {
    console.log('Triggering WhatsApp automation for lead:', leadData.phone_number);
    
    // Send welcome message template
    const messageData = {
      messaging_product: "whatsapp",
      to: leadData.phone_number,
      type: "template",
      template: {
        name: "welcome_message",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: leadData.full_name || leadData.first_name || "there" }
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
    console.log('WhatsApp message sent:', result);
    
    return result;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}; 