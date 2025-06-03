import crypto from 'crypto';

// Verify Razorpay webhook signature
const verifyRazorpaySignature = (payload, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signature)
  );
};

// Handle Razorpay webhook events
export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const payload = JSON.stringify(req.body);
    
    // Verify signature
    if (!verifyRazorpaySignature(payload, signature)) {
      console.error('Razorpay webhook signature verification failed');
      return res.sendStatus(403);
    }
    
    const body = req.body;
    console.log('Razorpay webhook received:', JSON.stringify(body, null, 2));
    
    const { event, payload: eventPayload } = body;
    
    // Process different event types
    switch (event) {
      case 'payment.authorized':
        await handlePaymentAuthorized(eventPayload.payment.entity);
        break;
      case 'payment.captured':
        await handlePaymentCaptured(eventPayload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(eventPayload.payment.entity);
        break;
      case 'subscription.activated':
        await handleSubscriptionActivated(eventPayload.subscription.entity);
        break;
      case 'subscription.charged':
        await handleSubscriptionCharged(eventPayload.subscription.entity, eventPayload.payment.entity);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(eventPayload.subscription.entity);
        break;
      case 'subscription.completed':
        await handleSubscriptionCompleted(eventPayload.subscription.entity);
        break;
      case 'invoice.paid':
        await handleInvoicePaid(eventPayload.invoice.entity);
        break;
      case 'invoice.partially_paid':
        await handleInvoicePartiallyPaid(eventPayload.invoice.entity);
        break;
      case 'invoice.expired':
        await handleInvoiceExpired(eventPayload.invoice.entity);
        break;
      default:
        console.log('Unhandled Razorpay event:', event);
    }
    
    res.status(200).json({ status: 'success' });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    res.status(500).json({ error: 'Error processing webhook' });
  }
};

// Handle payment authorized event
const handlePaymentAuthorized = async (payment) => {
  try {
    console.log('Payment authorized:', payment.id);
    
    await updatePaymentStatus({
      payment_id: payment.id,
      status: 'authorized',
      amount: payment.amount / 100, // Convert from paise to rupees
      currency: payment.currency,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      fee: payment.fee / 100,
      tax: payment.tax / 100,
      authorized_at: new Date(payment.created_at * 1000)
    });
    
  } catch (error) {
    console.error('Error handling payment authorized:', error);
  }
};

// Handle payment captured event
const handlePaymentCaptured = async (payment) => {
  try {
    console.log('Payment captured:', payment.id);
    
    await updatePaymentStatus({
      payment_id: payment.id,
      status: 'captured',
      amount: payment.amount / 100,
      currency: payment.currency,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      fee: payment.fee / 100,
      tax: payment.tax / 100,
      captured_at: new Date(payment.created_at * 1000)
    });
    
    // Activate client subscription if this is a subscription payment
    if (payment.notes && payment.notes.client_id) {
      await activateClientSubscription(payment.notes.client_id, payment);
    }
    
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

// Handle payment failed event
const handlePaymentFailed = async (payment) => {
  try {
    console.log('Payment failed:', payment.id);
    
    await updatePaymentStatus({
      payment_id: payment.id,
      status: 'failed',
      amount: payment.amount / 100,
      currency: payment.currency,
      method: payment.method,
      email: payment.email,
      contact: payment.contact,
      error_code: payment.error_code,
      error_description: payment.error_description,
      failed_at: new Date(payment.created_at * 1000)
    });
    
    // Send payment failure notification
    if (payment.notes && payment.notes.client_id) {
      await sendPaymentFailureNotification(payment.notes.client_id, payment);
    }
    
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

// Handle subscription activated event
const handleSubscriptionActivated = async (subscription) => {
  try {
    console.log('Subscription activated:', subscription.id);
    
    await updateSubscriptionStatus({
      subscription_id: subscription.id,
      status: 'active',
      plan_id: subscription.plan_id,
      customer_id: subscription.customer_id,
      total_count: subscription.total_count,
      paid_count: subscription.paid_count,
      remaining_count: subscription.remaining_count,
      current_start: new Date(subscription.current_start * 1000),
      current_end: new Date(subscription.current_end * 1000),
      activated_at: new Date(subscription.created_at * 1000)
    });
    
    // Activate client features
    if (subscription.notes && subscription.notes.client_id) {
      await activateClientFeatures(subscription.notes.client_id, subscription);
    }
    
  } catch (error) {
    console.error('Error handling subscription activated:', error);
  }
};

// Handle subscription charged event
const handleSubscriptionCharged = async (subscription, payment) => {
  try {
    console.log('Subscription charged:', subscription.id, 'Payment:', payment.id);
    
    await updateSubscriptionStatus({
      subscription_id: subscription.id,
      status: subscription.status,
      paid_count: subscription.paid_count,
      remaining_count: subscription.remaining_count,
      current_start: new Date(subscription.current_start * 1000),
      current_end: new Date(subscription.current_end * 1000),
      last_payment_id: payment.id,
      last_charged_at: new Date(payment.created_at * 1000)
    });
    
    // Extend client subscription period
    if (subscription.notes && subscription.notes.client_id) {
      await extendClientSubscription(subscription.notes.client_id, subscription);
    }
    
  } catch (error) {
    console.error('Error handling subscription charged:', error);
  }
};

// Handle subscription cancelled event
const handleSubscriptionCancelled = async (subscription) => {
  try {
    console.log('Subscription cancelled:', subscription.id);
    
    await updateSubscriptionStatus({
      subscription_id: subscription.id,
      status: 'cancelled',
      cancelled_at: new Date(subscription.ended_at * 1000)
    });
    
    // Deactivate client features
    if (subscription.notes && subscription.notes.client_id) {
      await deactivateClientFeatures(subscription.notes.client_id, subscription);
    }
    
  } catch (error) {
    console.error('Error handling subscription cancelled:', error);
  }
};

// Handle subscription completed event
const handleSubscriptionCompleted = async (subscription) => {
  try {
    console.log('Subscription completed:', subscription.id);
    
    await updateSubscriptionStatus({
      subscription_id: subscription.id,
      status: 'completed',
      completed_at: new Date(subscription.ended_at * 1000)
    });
    
    // Send renewal reminder
    if (subscription.notes && subscription.notes.client_id) {
      await sendRenewalReminder(subscription.notes.client_id, subscription);
    }
    
  } catch (error) {
    console.error('Error handling subscription completed:', error);
  }
};

// Handle invoice paid event
const handleInvoicePaid = async (invoice) => {
  try {
    console.log('Invoice paid:', invoice.id);
    
    await updateInvoiceStatus({
      invoice_id: invoice.id,
      status: 'paid',
      amount: invoice.amount / 100,
      amount_paid: invoice.amount_paid / 100,
      currency: invoice.currency,
      paid_at: new Date(invoice.paid_at * 1000)
    });
    
  } catch (error) {
    console.error('Error handling invoice paid:', error);
  }
};

// Handle invoice partially paid event
const handleInvoicePartiallyPaid = async (invoice) => {
  try {
    console.log('Invoice partially paid:', invoice.id);
    
    await updateInvoiceStatus({
      invoice_id: invoice.id,
      status: 'partially_paid',
      amount: invoice.amount / 100,
      amount_paid: invoice.amount_paid / 100,
      currency: invoice.currency,
      partially_paid_at: new Date()
    });
    
  } catch (error) {
    console.error('Error handling invoice partially paid:', error);
  }
};

// Handle invoice expired event
const handleInvoiceExpired = async (invoice) => {
  try {
    console.log('Invoice expired:', invoice.id);
    
    await updateInvoiceStatus({
      invoice_id: invoice.id,
      status: 'expired',
      expired_at: new Date(invoice.expire_by * 1000)
    });
    
  } catch (error) {
    console.error('Error handling invoice expired:', error);
  }
};

// Update payment status in database
const updatePaymentStatus = async (paymentData) => {
  try {
    console.log('Updating payment status:', paymentData);
    
    // Example Supabase integration:
    /*
    const { data, error } = await supabase
      .from('payments')
      .upsert({
        payment_id: paymentData.payment_id,
        status: paymentData.status,
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.method,
        email: paymentData.email,
        contact: paymentData.contact,
        fee: paymentData.fee,
        tax: paymentData.tax,
        error_code: paymentData.error_code,
        error_description: paymentData.error_description,
        authorized_at: paymentData.authorized_at,
        captured_at: paymentData.captured_at,
        failed_at: paymentData.failed_at,
        updated_at: new Date()
      });
    
    if (error) throw error;
    return data;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
};

// Update subscription status in database
const updateSubscriptionStatus = async (subscriptionData) => {
  try {
    console.log('Updating subscription status:', subscriptionData);
    
    // Example Supabase integration:
    /*
    const { data, error } = await supabase
      .from('client_subscriptions')
      .upsert({
        subscription_id: subscriptionData.subscription_id,
        status: subscriptionData.status,
        plan_id: subscriptionData.plan_id,
        customer_id: subscriptionData.customer_id,
        total_count: subscriptionData.total_count,
        paid_count: subscriptionData.paid_count,
        remaining_count: subscriptionData.remaining_count,
        current_start: subscriptionData.current_start,
        current_end: subscriptionData.current_end,
        last_payment_id: subscriptionData.last_payment_id,
        activated_at: subscriptionData.activated_at,
        cancelled_at: subscriptionData.cancelled_at,
        completed_at: subscriptionData.completed_at,
        last_charged_at: subscriptionData.last_charged_at,
        updated_at: new Date()
      });
    
    if (error) throw error;
    return data;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
};

// Update invoice status in database
const updateInvoiceStatus = async (invoiceData) => {
  try {
    console.log('Updating invoice status:', invoiceData);
    
    // Example Supabase integration:
    /*
    const { data, error } = await supabase
      .from('invoices')
      .upsert({
        invoice_id: invoiceData.invoice_id,
        status: invoiceData.status,
        amount: invoiceData.amount,
        amount_paid: invoiceData.amount_paid,
        currency: invoiceData.currency,
        paid_at: invoiceData.paid_at,
        partially_paid_at: invoiceData.partially_paid_at,
        expired_at: invoiceData.expired_at,
        updated_at: new Date()
      });
    
    if (error) throw error;
    return data;
    */
    
    return { success: true };
  } catch (error) {
    console.error('Error updating invoice status:', error);
    throw error;
  }
};

// Activate client subscription
const activateClientSubscription = async (clientId, payment) => {
  try {
    console.log('Activating client subscription:', clientId);
    
    // Update client status and features
    // Send welcome email/WhatsApp message
    // Enable CRM features
    
    return { success: true };
  } catch (error) {
    console.error('Error activating client subscription:', error);
  }
};

// Activate client features
const activateClientFeatures = async (clientId, subscription) => {
  try {
    console.log('Activating client features:', clientId);
    
    // Enable specific features based on plan
    // Update client permissions
    // Send activation notification
    
    return { success: true };
  } catch (error) {
    console.error('Error activating client features:', error);
  }
};

// Extend client subscription
const extendClientSubscription = async (clientId, subscription) => {
  try {
    console.log('Extending client subscription:', clientId);
    
    // Update subscription end date
    // Send payment confirmation
    // Continue services
    
    return { success: true };
  } catch (error) {
    console.error('Error extending client subscription:', error);
  }
};

// Deactivate client features
const deactivateClientFeatures = async (clientId, subscription) => {
  try {
    console.log('Deactivating client features:', clientId);
    
    // Disable premium features
    // Send cancellation confirmation
    // Provide data export option
    
    return { success: true };
  } catch (error) {
    console.error('Error deactivating client features:', error);
  }
};

// Send payment failure notification
const sendPaymentFailureNotification = async (clientId, payment) => {
  try {
    console.log('Sending payment failure notification:', clientId);
    
    // Send email notification
    // Send WhatsApp notification
    // Create retry payment link
    
    return { success: true };
  } catch (error) {
    console.error('Error sending payment failure notification:', error);
  }
};

// Send renewal reminder
const sendRenewalReminder = async (clientId, subscription) => {
  try {
    console.log('Sending renewal reminder:', clientId);
    
    // Send renewal reminder email
    // Send WhatsApp reminder
    // Create renewal payment link
    
    return { success: true };
  } catch (error) {
    console.error('Error sending renewal reminder:', error);
  }
}; 