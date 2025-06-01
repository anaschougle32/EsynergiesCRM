import React, { useState, useEffect } from 'react';
import { 
  CreditCard,
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Search,
  Filter,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  Settings,
  Eye,
  MoreHorizontal
} from 'lucide-react';
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
  clientId: string;
  clientName: string;
  businessName: string;
  businessType: string;
  planId: string;
  planName: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  amount: number;
  splitPayment: boolean;
  autoRenew: boolean;
  lastPayment?: string;
  nextPayment: string;
}

interface Payment {
  id: string;
  clientId: string;
  clientName: string;
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
  trend?: {
    value: number;
    positive: boolean;
  };
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  trend,
  isLoading = false,
}) => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-header">
          <div className="flex-1">
            <p className="stat-card-label">{title}</p>
            {isLoading ? (
              <div className="loading-skeleton h-8 w-16 mt-2"></div>
            ) : (
              <p className="stat-card-value">{value}</p>
            )}
            {trend && !isLoading && (
              <div className={`stat-card-change ${
                trend.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 ${trend.positive ? '' : 'rotate-180'}`} />
                <span className="ml-1">{Math.abs(trend.value)}%</span>
              </div>
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

const AdminBilling = () => {
  const [activeTab, setActiveTab] = useState<'clients' | 'plans' | 'payments'>('clients');
  const [clientSubscriptions, setClientSubscriptions] = useState<ClientSubscription[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'expired'>('all');
  const [showAssignPlanModal, setShowAssignPlanModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientSubscription | null>(null);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockPlans: SubscriptionPlan[] = [
      {
        id: '1',
        name: 'Starter Plan',
        description: 'Perfect for small businesses',
        price: 99.00,
        billingCycle: 'monthly',
        maxLeads: 500,
        maxClients: 1,
        features: ['Lead Management', 'Basic Analytics', 'Email Support', 'WhatsApp Integration'],
        isActive: true
      },
      {
        id: '2',
        name: 'Professional Plan',
        description: 'For growing businesses',
        price: 199.00,
        billingCycle: 'monthly',
        maxLeads: 2000,
        maxClients: 1,
        features: ['Everything in Starter', 'Advanced Analytics', 'Priority Support', 'Custom Integrations', 'API Access'],
        isActive: true
      },
      {
        id: '3',
        name: 'Enterprise Plan',
        description: 'For large businesses',
        price: 499.00,
        billingCycle: 'monthly',
        maxLeads: 10000,
        maxClients: 1,
        features: ['Everything in Professional', 'White Label', 'Dedicated Support', 'Custom Features', 'SLA'],
        isActive: true
      }
    ];

    const mockClientSubscriptions: ClientSubscription[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Maria Garcia',
        businessName: 'Bella Vista Restaurant',
        businessType: 'Restaurant',
        planId: '1',
        planName: 'Starter Plan',
        status: 'active',
        startDate: '2024-01-01',
        endDate: '2024-02-01',
        amount: 99.00,
        splitPayment: false,
        autoRenew: true,
        lastPayment: '2024-01-01',
        nextPayment: '2024-02-01'
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'John Smith',
        businessName: 'FitLife Gym',
        businessType: 'Fitness',
        planId: '2',
        planName: 'Professional Plan',
        status: 'active',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        amount: 199.00,
        splitPayment: true,
        autoRenew: true,
        lastPayment: '2024-01-15',
        nextPayment: '2024-02-15'
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Sarah Johnson',
        businessName: 'Style Studio Salon',
        businessType: 'Beauty',
        planId: '1',
        planName: 'Starter Plan',
        status: 'pending',
        startDate: '2024-01-20',
        endDate: '2024-02-20',
        amount: 99.00,
        splitPayment: false,
        autoRenew: false,
        nextPayment: '2024-02-20'
      }
    ];

    const mockPayments: Payment[] = [
      {
        id: '1',
        clientId: '1',
        clientName: 'Maria Garcia',
        subscriptionId: '1',
        amount: 99.00,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'Credit Card',
        paidAt: '2024-01-01T10:00:00Z',
        createdAt: '2024-01-01T09:55:00Z'
      },
      {
        id: '2',
        clientId: '2',
        clientName: 'John Smith',
        subscriptionId: '2',
        amount: 199.00,
        currency: 'USD',
        status: 'completed',
        paymentMethod: 'Credit Card',
        paidAt: '2024-01-15T10:00:00Z',
        createdAt: '2024-01-15T09:55:00Z'
      },
      {
        id: '3',
        clientId: '3',
        clientName: 'Sarah Johnson',
        subscriptionId: '3',
        amount: 99.00,
        currency: 'USD',
        status: 'pending',
        paymentMethod: 'Credit Card',
        createdAt: '2024-01-20T09:55:00Z'
      }
    ];

    setTimeout(() => {
      setClientSubscriptions(mockClientSubscriptions);
      setSubscriptionPlans(mockPlans);
      setPayments(mockPayments);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'badge badge-success',
      pending: 'badge badge-warning',
      expired: 'badge badge-danger',
      cancelled: 'badge badge-secondary',
      completed: 'badge badge-success',
      failed: 'badge badge-danger',
      refunded: 'badge badge-secondary'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
        {status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
        {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
        {(status === 'expired' || status === 'failed') && <AlertTriangle className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const handleAssignPlan = (client: ClientSubscription) => {
    setSelectedClient(client);
    setShowAssignPlanModal(true);
  };

  const handlePlanAssignment = (planId: string, splitPayment: boolean) => {
    // Implementation for plan assignment
    setShowAssignPlanModal(false);
    setSelectedClient(null);
  };

  // Filter subscriptions
  const filteredSubscriptions = clientSubscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.planName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const activeSubscriptions = clientSubscriptions.filter(s => s.status === 'active').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const totalClients = clientSubscriptions.length;

  const tabs = [
    { id: 'clients', name: 'Client Subscriptions', icon: <Users className="h-5 w-5" /> },
    { id: 'plans', name: 'Subscription Plans', icon: <CreditCard className="h-5 w-5" /> },
    { id: 'payments', name: 'Payment History', icon: <FileText className="h-5 w-5" /> }
  ];

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="section-spacing">
          {/* Loading Header */}
          <div className="section-gap">
            <div className="loading-skeleton h-8 w-48 mb-2"></div>
            <div className="loading-skeleton h-4 w-64"></div>
          </div>

          {/* Loading Stats */}
          <div className="stats-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="mobile-card">
                <div className="mobile-card-body">
                  <div className="loading-skeleton h-20 w-full"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Loading Content */}
          <div className="mobile-card">
            <div className="mobile-card-body">
              <div className="loading-skeleton h-64 w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="section-spacing">
        {/* Header Section */}
        <div className="section-gap">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title text-gray-900">Billing & Payments</h1>
              <p className="mobile-text text-gray-600 mt-2">Manage subscriptions and payment processing</p>
            </div>
            <button
              onClick={() => setShowAssignPlanModal(true)}
              className="btn-mobile-primary hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Assign Plan
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              icon={<DollarSign className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              trend={{ value: 12, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Active Subscriptions"
              value={activeSubscriptions}
              icon={<CheckCircle className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              trend={{ value: 8, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Pending Payments"
              value={pendingPayments}
              icon={<Clock className="h-6 w-6" />}
              iconColor="bg-yellow-100 text-yellow-600"
              trend={{ value: 15, positive: false }}
              isLoading={loading}
            />
            <StatCard
              title="Total Clients"
              value={totalClients}
              icon={<Users className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              trend={{ value: 3, positive: true }}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.name}</span>
                    <span className="sm:hidden">{tab.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Client Subscriptions Tab */}
        {activeTab === 'clients' && (
          <>
            {/* Filters */}
            <div className="section-gap">
              <div className="content-section">
                <div className="content-header">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="content-title">Filters</h3>
                  </div>
                </div>
                
                <div className="content-body">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                      <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search clients..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="form-input pl-10"
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="form-select"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="expired">Expired</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Filter Summary */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {filteredSubscriptions.length} of {clientSubscriptions.length} subscriptions
                    </div>
                    {(searchTerm || statusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                        className="btn-mobile-ghost text-sm"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subscriptions List */}
            <div className="section-gap">
              <div className="content-section">
                <div className="content-header">
                  <h3 className="content-title">Client Subscriptions</h3>
                </div>
                
                <div className="content-body">
                  {filteredSubscriptions.length > 0 ? (
                    <div className="space-y-3">
                      {filteredSubscriptions.map((subscription, index) => (
                        <div 
                          key={subscription.id} 
                          className="list-item animate-slide-up"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="list-item-content">
                            <div className="list-item-avatar">
                              {subscription.businessName.charAt(0)}
                            </div>
                            <div className="list-item-details">
                              <div className="flex items-center justify-between mb-2">
                                <p className="list-item-title">{subscription.businessName}</p>
                                {getStatusBadge(subscription.status)}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-1">
                                <span className="flex items-center">
                                  <Users className="h-3 w-3 mr-1" />
                                  {subscription.clientName}
                                </span>
                                <span className="flex items-center">
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  {subscription.planName}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(subscription.amount)}
                                  </span>
                                  {subscription.splitPayment && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      Split Payment
                                    </span>
                                  )}
                                  {subscription.autoRenew && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      Auto Renew
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-400">
                                  Next: {format(new Date(subscription.nextPayment), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="list-item-actions">
                            <button className="action-btn-primary">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleAssignPlan(subscription)}
                              className="action-btn-secondary"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="action-btn-secondary">
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions found</h3>
                      <p className="text-gray-500 mb-6">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Try adjusting your search criteria or filters.'
                          : 'Start by assigning subscription plans to your clients.'}
                      </p>
                      {!searchTerm && statusFilter === 'all' && (
                        <button
                          onClick={() => setShowAssignPlanModal(true)}
                          className="btn-mobile-primary"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Assign Plan
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Subscription Plans Tab */}
        {activeTab === 'plans' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <h3 className="content-title">Subscription Plans</h3>
                  <button className="btn-mobile-ghost text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Plan
                  </button>
                </div>
              </div>
              
              <div className="content-body">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan, index) => (
                    <div 
                      key={plan.id} 
                      className="mobile-card animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="mobile-card-body">
                        <div className="text-center mb-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                          <p className="text-gray-500 mb-4">{plan.description}</p>
                          <div className="text-3xl font-bold text-gray-900">
                            {formatCurrency(plan.price)}
                            <span className="text-sm font-normal text-gray-500">/{plan.billingCycle}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Max Leads</span>
                            <span className="font-medium text-gray-900">{plan.maxLeads.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Max Clients</span>
                            <span className="font-medium text-gray-900">{plan.maxClients}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-6">
                          {plan.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            plan.isActive ? 'badge badge-success' : 'badge badge-secondary'
                          }`}>
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button className="btn-mobile-ghost text-sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Payment History</h3>
              </div>
              
              <div className="content-body">
                {payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment, index) => (
                      <div 
                        key={payment.id} 
                        className="list-item animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="list-item-content">
                          <div className="list-item-avatar bg-green-100 text-green-600">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div className="list-item-details">
                            <div className="flex items-center justify-between mb-2">
                              <p className="list-item-title">{payment.clientName}</p>
                              {getStatusBadge(payment.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-1">
                              <span className="flex items-center">
                                <CreditCard className="h-3 w-3 mr-1" />
                                {payment.paymentMethod}
                              </span>
                              <span className="text-lg font-semibold text-gray-900">
                                {formatCurrency(payment.amount, payment.currency)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Created: {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                              </span>
                              {payment.paidAt && (
                                <span className="text-xs text-gray-500">
                                  Paid: {format(new Date(payment.paidAt), 'MMM dd, yyyy HH:mm')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <button className="action-btn-primary">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="action-btn-secondary">
                            <FileText className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-500">Payment history will appear here once clients start paying.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Action Buttons */}
        <div className="section-gap lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowAssignPlanModal(true)}
              className="btn-mobile-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Assign Plan
            </button>
            <button className="btn-mobile-secondary">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling; 