import React, { useState } from 'react';
import { 
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Settings,
  Send,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter
} from 'lucide-react';

interface WhatsAppTemplate {
  id: string;
  name: string;
  category: 'marketing' | 'utility' | 'authentication';
  language: string;
  status: 'pending' | 'approved' | 'rejected';
  bodyText: string;
  footerText?: string;
  isActive: boolean;
}

interface AutomationRule {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  triggerType: 'new_lead' | 'inactivity' | 'status_change';
  delayMinutes: number;
  clientId?: string;
  clientName?: string;
  isActive: boolean;
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

const AdminWhatsApp = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'automation' | 'config'>('templates');
  const [loading, setLoading] = useState(false);
  
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([
    {
      id: '1',
      name: 'Welcome Message',
      category: 'utility',
      language: 'en',
      status: 'approved',
      bodyText: 'Hi {{1}}, thank you for your interest! We will contact you shortly.',
      footerText: 'Best regards, {{2}}',
      isActive: true
    },
    {
      id: '2',
      name: 'Follow Up',
      category: 'marketing',
      language: 'en',
      status: 'approved',
      bodyText: 'Hi {{1}}, we noticed you were interested in our services. Would you like to schedule a consultation?',
      footerText: 'Reply STOP to opt out',
      isActive: true
    },
    {
      id: '3',
      name: 'Appointment Reminder',
      category: 'utility',
      language: 'en',
      status: 'pending',
      bodyText: 'Hi {{1}}, this is a reminder about your appointment tomorrow at {{2}}.',
      footerText: 'See you soon!',
      isActive: false
    }
  ]);

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Welcome New Leads',
      templateId: '1',
      templateName: 'Welcome Message',
      triggerType: 'new_lead',
      delayMinutes: 5,
      clientId: '1',
      clientName: 'Bella Vista Restaurant',
      isActive: true
    },
    {
      id: '2',
      name: 'Follow Up Inactive Leads',
      templateId: '2',
      templateName: 'Follow Up',
      triggerType: 'inactivity',
      delayMinutes: 2880, // 48 hours
      isActive: true
    }
  ]);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplate | null>(null);
  const [selectedRule, setSelectedRule] = useState<AutomationRule | null>(null);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'badge badge-warning',
      approved: 'badge badge-success',
      rejected: 'badge badge-danger'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
        {status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
        {status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
        {status === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCategoryBadge = (category: string) => {
    const categoryStyles = {
      marketing: 'bg-blue-100 text-blue-800 border border-blue-200',
      utility: 'bg-gray-100 text-gray-800 border border-gray-200',
      authentication: 'bg-purple-100 text-purple-800 border border-purple-200'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryStyles[category as keyof typeof categoryStyles]}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
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
    const icons = {
      new_lead: '🆕',
      inactivity: '⏰',
      status_change: '🔄'
    };
    return icons[triggerType as keyof typeof icons] || '⚡';
  };

  const formatDelay = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours`;
    return `${Math.floor(minutes / 1440)} days`;
  };

  const toggleTemplateStatus = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId 
        ? { ...template, isActive: !template.isActive }
        : template
    ));
  };

  const toggleRuleStatus = (ruleId: string) => {
    setAutomationRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
  };

  // Calculate stats
  const totalTemplates = templates.length;
  const approvedTemplates = templates.filter(t => t.status === 'approved').length;
  const activeRules = automationRules.filter(rule => rule.isActive).length;
  const totalRules = automationRules.length;

  const tabs = [
    { id: 'templates', name: 'Templates', icon: <MessageSquare className="h-5 w-5" /> },
    { id: 'automation', name: 'Automation', icon: <Settings className="h-5 w-5" /> },
    { id: 'config', name: 'Configuration', icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <div className="dashboard-container">
      <div className="section-spacing">
        {/* Header Section */}
        <div className="section-gap">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title text-gray-900">WhatsApp Automation</h1>
              <p className="mobile-text text-gray-600 mt-2">Manage templates and automation rules</p>
            </div>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="btn-mobile-primary hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Total Templates"
              value={totalTemplates}
              icon={<MessageSquare className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              trend={{ value: 12, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Approved Templates"
              value={approvedTemplates}
              icon={<CheckCircle className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              trend={{ value: 8, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Active Rules"
              value={activeRules}
              icon={<Play className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              trend={{ value: 15, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Total Rules"
              value={totalRules}
              icon={<Settings className="h-6 w-6" />}
              iconColor="bg-emerald-100 text-emerald-600"
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
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <h3 className="content-title">WhatsApp Templates</h3>
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="btn-mobile-ghost text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Template
                  </button>
                </div>
              </div>
              
              <div className="content-body">
                {templates.length > 0 ? (
                  <div className="space-y-3">
                    {templates.map((template, index) => (
                      <div 
                        key={template.id} 
                        className="list-item animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="list-item-content">
                          <div className="list-item-avatar bg-green-100 text-green-600">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div className="list-item-details">
                            <div className="flex items-center justify-between mb-2">
                              <p className="list-item-title">{template.name}</p>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(template.status)}
                                {getCategoryBadge(template.category)}
                              </div>
                            </div>
                            <p className="list-item-subtitle mb-2 line-clamp-2">{template.bodyText}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Language: {template.language.toUpperCase()}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleTemplateStatus(template.id)}
                                  className={`action-btn-sm ${
                                    template.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  {template.isActive ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <button className="action-btn-primary">
                            <Send className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedTemplate(template);
                              setShowTemplateModal(true);
                            }}
                            className="action-btn-secondary"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="action-btn-danger">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No templates yet</h3>
                    <p className="text-gray-500 mb-6">Create your first WhatsApp template to get started.</p>
                    <button
                      onClick={() => setShowTemplateModal(true)}
                      className="btn-mobile-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Template
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <h3 className="content-title">Automation Rules</h3>
                  <button
                    onClick={() => setShowRuleModal(true)}
                    className="btn-mobile-ghost text-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule
                  </button>
                </div>
              </div>
              
              <div className="content-body">
                {automationRules.length > 0 ? (
                  <div className="space-y-3">
                    {automationRules.map((rule, index) => (
                      <div 
                        key={rule.id} 
                        className="list-item animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="list-item-content">
                          <div className="list-item-avatar bg-purple-100 text-purple-600">
                            <Settings className="h-5 w-5" />
                          </div>
                          <div className="list-item-details">
                            <div className="flex items-center justify-between mb-2">
                              <p className="list-item-title">{rule.name}</p>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                rule.isActive ? 'badge badge-success' : 'badge badge-secondary'
                              }`}>
                                {rule.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center">
                                <span className="mr-1">{getTriggerIcon(rule.triggerType)}</span>
                                {getTriggerLabel(rule.triggerType)}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDelay(rule.delayMinutes)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">Template: {rule.templateName}</span>
                              {rule.clientName && (
                                <span className="text-xs text-gray-500">{rule.clientName}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <button
                            onClick={() => toggleRuleStatus(rule.id)}
                            className={`action-btn-sm ${
                              rule.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {rule.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedRule(rule);
                              setShowRuleModal(true);
                            }}
                            className="action-btn-secondary"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="action-btn-danger">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No automation rules</h3>
                    <p className="text-gray-500 mb-6">Create automation rules to send messages automatically.</p>
                    <button
                      onClick={() => setShowRuleModal(true)}
                      className="btn-mobile-primary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Rule
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Tab */}
        {activeTab === 'config' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">WhatsApp Configuration</h3>
              </div>
              
              <div className="content-body">
                <div className="space-y-6">
                  {/* Connection Status */}
                  <div className="mobile-card">
                    <div className="mobile-card-body">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <p className="font-medium text-gray-900">WhatsApp Business API</p>
                            <p className="text-sm text-gray-500">Connected and active</p>
                          </div>
                        </div>
                        <button className="btn-mobile-ghost text-sm">
                          Test Connection
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* API Configuration */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number ID
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter Phone Number ID"
                        defaultValue="123456789"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp Business Account ID
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Enter WABA ID"
                        defaultValue="987654321"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Access Token
                      </label>
                      <input
                        type="password"
                        className="form-input"
                        placeholder="Enter Access Token"
                        defaultValue="••••••••••••••••"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button className="btn-mobile-primary">
                      Save Configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Action Buttons */}
        <div className="section-gap lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="btn-mobile-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Template
            </button>
            <button
              onClick={() => setShowRuleModal(true)}
              className="btn-mobile-secondary"
            >
              <Settings className="h-4 w-4 mr-2" />
              Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWhatsApp; 