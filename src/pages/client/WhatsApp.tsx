import React, { useState, useEffect } from 'react';
import { 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BoltIcon,
  EyeIcon,
  CalendarIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface WhatsAppMessage {
  id: string;
  leadId: string;
  leadName: string;
  templateName: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

interface AutomationRule {
  id: string;
  name: string;
  templateName: string;
  triggerType: 'new_lead' | 'inactivity' | 'status_change';
  delayMinutes: number;
  isActive: boolean;
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

const ClientWhatsApp = () => {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'messages' | 'automation'>('messages');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockMessages: WhatsAppMessage[] = [
      {
        id: '1',
        leadId: '1',
        leadName: 'Alice Brown',
        templateName: 'Welcome Message',
        content: 'Hi Alice, thank you for your interest! We will contact you shortly.',
        status: 'read',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        deliveredAt: new Date(Date.now() - 3500000).toISOString(),
        readAt: new Date(Date.now() - 3000000).toISOString()
      },
      {
        id: '2',
        leadId: '2',
        leadName: 'Bob Davis',
        templateName: 'Follow Up',
        content: 'Hi Bob, we noticed you were interested in our services. Would you like to schedule a consultation?',
        status: 'delivered',
        sentAt: new Date(Date.now() - 1800000).toISOString(),
        deliveredAt: new Date(Date.now() - 1700000).toISOString()
      },
      {
        id: '3',
        leadId: '3',
        leadName: 'Carol White',
        templateName: 'Welcome Message',
        content: 'Hi Carol, thank you for your interest! We will contact you shortly.',
        status: 'sent',
        sentAt: new Date(Date.now() - 900000).toISOString()
      },
      {
        id: '4',
        leadId: '4',
        leadName: 'David Miller',
        templateName: 'Follow Up',
        content: 'Hi David, would you like to learn more about our anniversary dinner packages?',
        status: 'failed',
        sentAt: new Date(Date.now() - 600000).toISOString()
      }
    ];

    const mockRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Welcome New Leads',
        templateName: 'Welcome Message',
        triggerType: 'new_lead',
        delayMinutes: 5,
        isActive: true
      },
      {
        id: '2',
        name: 'Follow Up Inactive Leads',
        templateName: 'Follow Up',
        triggerType: 'inactivity',
        delayMinutes: 2880, // 48 hours
        isActive: true
      },
      {
        id: '3',
        name: 'Qualified Lead Follow Up',
        templateName: 'Consultation Offer',
        triggerType: 'status_change',
        delayMinutes: 60,
        isActive: false
      }
    ];

    setTimeout(() => {
      setMessages(mockMessages);
      setAutomationRules(mockRules);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'read':
        return <CheckCircleIcon className="h-4 w-4 text-purple-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      sent: 'badge badge-info',
      delivered: 'badge badge-success',
      read: 'bg-purple-100 text-purple-800',
      failed: 'badge badge-danger'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTriggerLabel = (triggerType: string) => {
    const labels = {
      new_lead: 'New Lead',
      inactivity: 'Inactivity',
      status_change: 'Status Change'
    };
    return labels[triggerType as keyof typeof labels] || triggerType;
  };

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'new_lead':
        return '🎯';
      case 'inactivity':
        return '⏰';
      case 'status_change':
        return '🔄';
      default:
        return '⚡';
    }
  };

  const formatDelay = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    return `${Math.floor(minutes / 1440)} days`;
  };

  const toggleAutomationRule = (ruleId: string) => {
    setAutomationRules(rules => 
      rules.map(rule => 
        rule.id === ruleId 
          ? { ...rule, isActive: !rule.isActive }
          : rule
      )
    );
  };

  const tabs = [
    { id: 'messages', name: 'Message History', icon: ChatBubbleLeftRightIcon },
    { id: 'automation', name: 'Automation Rules', icon: BoltIcon },
  ];

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
            <h1 className="mobile-title text-gray-900">WhatsApp Messages</h1>
            <p className="mobile-text text-gray-600 mt-2">View your WhatsApp automation and message history</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Total Messages"
              value={messages.length}
              icon={<ChatBubbleLeftRightIcon className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              isLoading={loading}
            />
            <StatCard
              title="Delivered"
              value={messages.filter(msg => msg.status === 'delivered' || msg.status === 'read').length}
              icon={<CheckCircleIcon className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              isLoading={loading}
            />
            <StatCard
              title="Read"
              value={messages.filter(msg => msg.status === 'read').length}
              icon={<EyeIcon className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              isLoading={loading}
            />
            <StatCard
              title="Active Rules"
              value={automationRules.filter(rule => rule.isActive).length}
              icon={<BoltIcon className="h-6 w-6" />}
              iconColor="bg-emerald-100 text-emerald-600"
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
          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="content-title">Message History</h3>
                </div>
              </div>
              
              <div className="content-body">
                {messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="list-item">
                        <div className="list-item-content">
                          <div className="list-item-avatar">
                            {message.leadName.charAt(0)}
                          </div>
                          <div className="list-item-details">
                            <div className="flex items-center justify-between mb-2">
                              <p className="list-item-title">{message.leadName}</p>
                              {getStatusBadge(message.status)}
                            </div>
                            <p className="text-sm font-medium text-gray-700 mb-1">{message.templateName}</p>
                            <p className="list-item-subtitle leading-relaxed mb-2">{message.content}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                Sent: {format(new Date(message.sentAt), 'MMM dd, HH:mm')}
                              </div>
                              {message.deliveredAt && (
                                <div className="flex items-center">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  Delivered: {format(new Date(message.deliveredAt), 'MMM dd, HH:mm')}
                                </div>
                              )}
                              {message.readAt && (
                                <div className="flex items-center">
                                  <EyeIcon className="h-3 w-3 mr-1" />
                                  Read: {format(new Date(message.readAt), 'MMM dd, HH:mm')}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          {getStatusIcon(message.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No messages sent yet</h3>
                    <p className="text-gray-500">WhatsApp messages will appear here when automation rules are triggered.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Automation Tab */}
          {activeTab === 'automation' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <BoltIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="content-title">Automation Rules</h3>
                </div>
              </div>
              
              <div className="content-body">
                {automationRules.length > 0 ? (
                  <div className="space-y-4">
                    {automationRules.map((rule) => (
                      <div key={rule.id} className="list-item">
                        <div className="list-item-content">
                          <div className="flex items-center">
                            <div className="stat-card-icon bg-indigo-100 text-indigo-600 mr-4">
                              <span className="text-lg">{getTriggerIcon(rule.triggerType)}</span>
                            </div>
                            <div className="list-item-details">
                              <div className="flex items-center justify-between mb-2">
                                <p className="list-item-title">{rule.name}</p>
                                <div className="flex items-center space-x-2">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    rule.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {rule.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="font-medium">Trigger:</span> {getTriggerLabel(rule.triggerType)}
                                </div>
                                <div>
                                  <span className="font-medium">Template:</span> {rule.templateName}
                                </div>
                                <div>
                                  <span className="font-medium">Delay:</span> {formatDelay(rule.delayMinutes)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <button
                            onClick={() => toggleAutomationRule(rule.id)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              rule.isActive
                                ? 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                            }`}
                            title={rule.isActive ? 'Pause rule' : 'Activate rule'}
                          >
                            {rule.isActive ? (
                              <PauseIcon className="h-5 w-5" />
                            ) : (
                              <PlayIcon className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BoltIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules</h3>
                    <p className="text-gray-500">Automation rules will be configured by your marketing agency.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* WhatsApp Status */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <h3 className="content-title">WhatsApp Connection Status</h3>
            </div>
            
            <div className="content-body">
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mr-4">
                    <ChatBubbleLeftRightIcon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">WhatsApp Business Connected</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your WhatsApp Business account is active and ready to send automated messages to your leads.
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Last message sent: {messages.length > 0 ? format(new Date(messages[0].sentAt), 'MMM dd, yyyy HH:mm') : 'Never'}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientWhatsApp; 