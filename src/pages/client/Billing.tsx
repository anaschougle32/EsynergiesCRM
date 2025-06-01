import React, { useState, useEffect } from 'react';
import { 
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  ClockIcon,
  ArrowPathIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface SubscriptionPlan {
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

interface ClientSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  splitPayment: boolean;
  autoRenew: boolean;
}

interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  paidAt?: string;
  createdAt: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  isLoading = false,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-header">
          <div className="flex-1">
            <p className="stat-card-label">{title}</p>
            {isLoading ? (
              <div className="h-8 w-16 animate-pulse rounded bg-gray-200 mt-2"></div>
            ) : (
              <p className="stat-card-value">{value}</p>
            )}
          </div>
          <div className={`stat-card-icon ${iconColor}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientBilling = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'payments'>('overview');
  const [subscription, setSubscription] = useState<ClientSubscription | null>(null);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockSubscription: ClientSubscription = {
      id: '1',
      planId: '1',
      planName: 'Professional Plan',
      status: 'active',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      amount: 149.00,
      splitPayment: false,
      autoRenew: true
    };

    const mockPlan: SubscriptionPlan = {
      id: '1',
      name: 'Professional Plan',
      description: 'Perfect for growing businesses',
      price: 149.00,
      billingCycle: 'monthly',
      maxLeads: 1000,
      maxClients: 10,
      features: [
        'Advanced Lead Management', 
        'Real-time Analytics', 
        'Priority Support', 
        'WhatsApp Automation',
        'Custom Integrations',
        'Advanced Reporting'
      ],
      isActive: true
    };

    const mockPayments: Payment[] = [
      {
        id: '1',
        subscriptionId: '1',
        amount: 149.00,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'Credit Card',
        paidAt: '2024-01-01T10:00:00Z',
        createdAt: '2024-01-01T09:55:00Z'
      },
      {
        id: '2',
        subscriptionId: '1',
        amount: 149.00,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'Credit Card',
        paidAt: '2023-12-01T10:00:00Z',
        createdAt: '2023-12-01T09:55:00Z'
      },
      {
        id: '3',
        subscriptionId: '1',
        amount: 149.00,
        currency: 'USD',
        status: 'pending',
        paymentMethod: 'Credit Card',
        createdAt: '2024-02-01T09:55:00Z'
      }
    ];

    setTimeout(() => {
      setSubscription(mockSubscription);
      setCurrentPlan(mockPlan);
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'badge badge-success',
      pending: 'badge badge-warning',
      cancelled: 'badge badge-danger',
      expired: 'badge badge-secondary',
      completed: 'badge badge-success',
      failed: 'badge badge-danger',
      refunded: 'badge badge-secondary'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
      case 'expired':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: DocumentTextIcon },
    { id: 'plan', name: 'Plan Details', icon: CreditCardIcon },
    { id: 'payments', name: 'Payment History', icon: BanknotesIcon },
  ];

  const nextBillingDate = subscription ? new Date(subscription.endDate) : null;
  const daysUntilBilling = nextBillingDate ? Math.ceil((nextBillingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="section-spacing">
        {/* Header Section */}
        <div className="section-gap">
          <div>
            <h1 className="mobile-title text-gray-900">Billing & Subscription</h1>
            <p className="mobile-text text-gray-600 mt-2">Manage your subscription and view payment history</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Current Plan"
              value={subscription?.planName || 'No Plan'}
              icon={<CreditCardIcon className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              isLoading={loading}
            />
            <StatCard
              title="Monthly Cost"
              value={`$${subscription?.amount || 0}`}
              icon={<BanknotesIcon className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              isLoading={loading}
            />
            <StatCard
              title="Status"
              value={subscription?.status || 'Inactive'}
              icon={<CheckCircleIcon className="h-6 w-6" />}
              iconColor="bg-emerald-100 text-emerald-600"
              isLoading={loading}
            />
            <StatCard
              title="Next Billing"
              value={daysUntilBilling > 0 ? `${daysUntilBilling} days` : 'Overdue'}
              icon={<CalendarIcon className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              isLoading={loading}
            />
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-body">
              <nav className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-indigo-600 shadow-soft'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="section-gap">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Current Subscription */}
              <div className="content-section">
                <div className="content-header">
                  <div className="flex items-center">
                    <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="content-title">Current Subscription</h3>
                  </div>
                </div>
                
                <div className="content-body">
                  {subscription ? (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{subscription.planName}</h4>
                          <p className="text-gray-600">${subscription.amount}/month</p>
                        </div>
                        {getStatusBadge(subscription.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Start Date:</span>
                          <span className="ml-2 text-gray-600">{format(new Date(subscription.startDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Next Billing:</span>
                          <span className="ml-2 text-gray-600">{format(new Date(subscription.endDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Auto Renew:</span>
                          <span className="ml-2 text-gray-600">{subscription.autoRenew ? 'Enabled' : 'Disabled'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Split Payment:</span>
                          <span className="ml-2 text-gray-600">{subscription.splitPayment ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h4>
                      <p className="text-gray-500">Contact your marketing agency to set up a subscription plan.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Payments */}
              <div className="content-section">
                <div className="content-header">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="content-title">Recent Payments</h3>
                    </div>
                    <button
                      onClick={() => setActiveTab('payments')}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      View all
                    </button>
                  </div>
                </div>
                
                <div className="content-body">
                  {payments.length > 0 ? (
                    <div className="space-y-3">
                      {payments.slice(0, 3).map((payment) => (
                        <div key={payment.id} className="list-item">
                          <div className="list-item-content">
                            <div className="stat-card-icon bg-green-100 text-green-600">
                              {getStatusIcon(payment.status)}
                            </div>
                            <div className="list-item-details">
                              <div className="flex items-center justify-between mb-1">
                                <p className="list-item-title">${payment.amount} {payment.currency}</p>
                                {getStatusBadge(payment.status)}
                              </div>
                              <p className="list-item-subtitle">{payment.paymentMethod}</p>
                              <p className="list-item-meta">
                                {payment.paidAt 
                                  ? `Paid on ${format(new Date(payment.paidAt), 'MMM dd, yyyy')}`
                                  : `Created on ${format(new Date(payment.createdAt), 'MMM dd, yyyy')}`
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Payments</h4>
                      <p className="text-gray-500">Payment history will appear here once you have an active subscription.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Plan Details Tab */}
          {activeTab === 'plan' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="content-title">Plan Details</h3>
                </div>
              </div>
              
              <div className="content-body">
                {currentPlan ? (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-2xl font-bold text-gray-900">{currentPlan.name}</h4>
                          <p className="text-gray-600 mt-1">{currentPlan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-indigo-600">${currentPlan.price}</div>
                          <div className="text-sm text-gray-500">per {currentPlan.billingCycle.replace('ly', '')}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center">
                            <ReceiptPercentIcon className="h-8 w-8 text-blue-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Max Leads</p>
                              <p className="text-lg font-semibold text-gray-900">{currentPlan.maxLeads.toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-8 w-8 text-green-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-500">Max Clients</p>
                              <p className="text-lg font-semibold text-gray-900">{currentPlan.maxClients}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="text-lg font-medium text-gray-900 mb-4">Plan Features</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {currentPlan.features.map((feature, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <h6 className="text-sm font-medium text-amber-800">Plan Changes</h6>
                          <p className="text-sm text-amber-700 mt-1">
                            To upgrade or downgrade your plan, please contact your marketing agency. 
                            Plan changes will take effect on your next billing cycle.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Plan Details</h4>
                    <p className="text-gray-500">Plan information will appear here once you have an active subscription.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="content-title">Payment History</h3>
                </div>
              </div>
              
              <div className="content-body">
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="list-item">
                        <div className="list-item-content">
                          <div className="stat-card-icon bg-blue-100 text-blue-600">
                            {getStatusIcon(payment.status)}
                          </div>
                          <div className="list-item-details">
                            <div className="flex items-center justify-between mb-2">
                              <p className="list-item-title">Payment #{payment.id}</p>
                              {getStatusBadge(payment.status)}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Amount:</span> ${payment.amount} {payment.currency}
                              </div>
                              <div>
                                <span className="font-medium">Method:</span> {payment.paymentMethod}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {
                                  payment.paidAt 
                                    ? format(new Date(payment.paidAt), 'MMM dd, yyyy')
                                    : format(new Date(payment.createdAt), 'MMM dd, yyyy')
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors duration-200">
                            <DocumentTextIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h4>
                    <p className="text-gray-500">Payment records will appear here once you start making payments.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Billing Actions */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <h3 className="content-title">Billing Actions</h3>
            </div>
            
            <div className="content-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <ArrowPathIcon className="h-6 w-6 text-blue-600 mr-3" />
                    <h4 className="font-medium text-blue-900">Auto-Renewal</h4>
                  </div>
                  <p className="text-blue-700 text-sm mb-3">
                    {subscription?.autoRenew 
                      ? 'Your subscription will automatically renew on the next billing date.'
                      : 'Auto-renewal is disabled. You will need to manually renew your subscription.'
                    }
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {subscription?.autoRenew ? 'Disable Auto-Renewal' : 'Enable Auto-Renewal'}
                  </button>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center mb-3">
                    <DocumentTextIcon className="h-6 w-6 text-green-600 mr-3" />
                    <h4 className="font-medium text-green-900">Download Invoices</h4>
                  </div>
                  <p className="text-green-700 text-sm mb-3">
                    Download your payment receipts and invoices for accounting purposes.
                  </p>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                    Download Latest Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientBilling; 