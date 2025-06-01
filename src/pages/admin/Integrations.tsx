import React, { useState, useEffect } from 'react';
import { 
  LinkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  XMarkIcon,
  ChevronRightIcon,
  ClockIcon as TimeIcon,
  ExclamationTriangleIcon as DifficultyIcon
} from '@heroicons/react/24/outline';

interface ClientIntegration {
  clientId: string;
  clientName: string;
  businessName: string;
  businessType: string;
  integrations: {
    meta_ads: 'connected' | 'pending' | 'error' | 'not_started';
    google_ads: 'connected' | 'pending' | 'error' | 'not_started';
    linkedin: 'connected' | 'pending' | 'error' | 'not_started';
    whatsapp: 'connected' | 'pending' | 'error' | 'not_started';
  };
  lastUpdated: string;
  totalLeads: number;
}

interface IntegrationGuide {
  platform: string;
  title: string;
  description: string;
  steps: Array<{
    step: number;
    title: string;
    description: string;
    details: string;
  }>;
  requirements: string[];
  estimatedTime: string;
  difficultyLevel: 'easy' | 'medium' | 'hard';
}

const AdminIntegrations = () => {
  const [clientIntegrations, setClientIntegrations] = useState<ClientIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'connected' | 'pending' | 'error'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'meta_ads' | 'google_ads' | 'linkedin' | 'whatsapp'>('all');
  const [selectedClient, setSelectedClient] = useState<ClientIntegration | null>(null);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<IntegrationGuide | null>(null);

  const integrationGuides: IntegrationGuide[] = [
    {
      platform: 'meta_ads',
      title: 'Meta Ads Integration (Facebook & Instagram)',
      description: 'Connect your Facebook and Instagram ad accounts to automatically sync leads from both platforms under one unified Meta Ads integration.',
      steps: [
        {
          step: 1,
          title: 'Create Facebook App',
          description: 'Go to Facebook Developers and create a new app',
          details: 'Visit developers.facebook.com, click "Create App", select "Business" type, and provide your app details including name and contact email.'
        },
        {
          step: 2,
          title: 'Add Facebook Login Product',
          description: 'Add Facebook Login to your app and configure settings',
          details: 'In your app dashboard, click "Add Product" and select "Facebook Login". Configure Valid OAuth Redirect URIs to include your domain.'
        },
        {
          step: 3,
          title: 'Get App Credentials',
          description: 'Copy your App ID and App Secret',
          details: 'Go to Settings > Basic and copy your App ID and App Secret. Keep the App Secret secure and never expose it in client-side code.'
        },
        {
          step: 4,
          title: 'Request Permissions',
          description: 'Request necessary permissions for lead access',
          details: 'Request pages_read_engagement, pages_manage_ads, and leads_retrieval permissions through App Review process.'
        },
        {
          step: 5,
          title: 'Connect Pages',
          description: 'Connect your Facebook and Instagram business pages',
          details: 'Use our integration form to authenticate and select which Facebook and Instagram pages to sync leads from.'
        }
      ],
      requirements: ['Facebook Business Account', 'Instagram Business Account', 'Facebook Page', 'Active Ad Campaigns', 'Admin Access to Pages'],
      estimatedTime: '15-20 minutes',
      difficultyLevel: 'medium'
    },
    {
      platform: 'google_ads',
      title: 'Google Ads Integration',
      description: 'Connect your Google Ads account to sync leads from Google Ad campaigns and lead form extensions.',
      steps: [
        {
          step: 1,
          title: 'Enable Google Ads API',
          description: 'Enable Google Ads API in Google Cloud Console',
          details: 'Go to Google Cloud Console, create or select a project, navigate to APIs & Services, and enable the Google Ads API.'
        },
        {
          step: 2,
          title: 'Create OAuth Credentials',
          description: 'Create OAuth 2.0 credentials for your application',
          details: 'In Google Cloud Console, go to Credentials, create OAuth 2.0 Client ID, and add authorized redirect URIs.'
        },
        {
          step: 3,
          title: 'Get Developer Token',
          description: 'Apply for Google Ads API developer token',
          details: 'In your Google Ads account, go to Tools & Settings > API Center, and apply for a developer token.'
        },
        {
          step: 4,
          title: 'Set Up Lead Extensions',
          description: 'Configure lead form extensions in your campaigns',
          details: 'In Google Ads, create lead form extensions with custom questions and privacy policy links.'
        },
        {
          step: 5,
          title: 'Connect Account',
          description: 'Use our integration form to connect your Google Ads account',
          details: 'Enter your Customer ID and authenticate with OAuth to start syncing leads automatically.'
        }
      ],
      requirements: ['Google Ads Account', 'Google Cloud Project', 'Active Campaigns', 'Lead Form Extensions', 'API Access'],
      estimatedTime: '20-25 minutes',
      difficultyLevel: 'hard'
    },
    {
      platform: 'linkedin',
      title: 'LinkedIn Ads Integration',
      description: 'Connect LinkedIn Campaign Manager to sync leads from LinkedIn Lead Gen Forms.',
      steps: [
        {
          step: 1,
          title: 'Create LinkedIn App',
          description: 'Create a new application in LinkedIn Developer Portal',
          details: 'Go to developer.linkedin.com, create a new app, provide your company page and app details.'
        },
        {
          step: 2,
          title: 'Request API Access',
          description: 'Apply for Marketing Developer Platform access',
          details: 'Submit an application for Marketing Developer Platform to access Lead Gen Forms API.'
        },
        {
          step: 3,
          title: 'Configure OAuth',
          description: 'Set up OAuth 2.0 authentication',
          details: 'Add authorized redirect URLs and configure OAuth settings in your LinkedIn app.'
        },
        {
          step: 4,
          title: 'Create Lead Gen Forms',
          description: 'Set up Lead Gen Forms in Campaign Manager',
          details: 'In LinkedIn Campaign Manager, create Sponsored Content campaigns with Lead Gen Forms.'
        },
        {
          step: 5,
          title: 'Connect Integration',
          description: 'Use our form to authenticate and sync leads',
          details: 'Enter Client ID, Client Secret, and authenticate to start receiving leads from LinkedIn.'
        }
      ],
      requirements: ['LinkedIn Company Page', 'Campaign Manager Access', 'Marketing Developer Platform Access', 'Active Lead Gen Campaigns'],
      estimatedTime: '25-30 minutes',
      difficultyLevel: 'hard'
    },
    {
      platform: 'whatsapp',
      title: 'WhatsApp Business Integration',
      description: 'Connect WhatsApp Business API to send automated messages to leads.',
      steps: [
        {
          step: 1,
          title: 'Set Up WhatsApp Business Account',
          description: 'Create or verify your WhatsApp Business Account',
          details: 'Go to business.whatsapp.com, create a business account, verify your phone number and business details.'
        },
        {
          step: 2,
          title: 'Access Cloud API',
          description: 'Get access to WhatsApp Business Cloud API',
          details: 'In Meta for Developers, create an app, add WhatsApp product, and get a temporary access token.'
        },
        {
          step: 3,
          title: 'Get Permanent Token',
          description: 'Generate permanent access token for production',
          details: 'Create a system user, assign WhatsApp Business Management permission, and generate a permanent token.'
        },
        {
          step: 4,
          title: 'Create Message Templates',
          description: 'Create and get approval for message templates',
          details: 'In WhatsApp Manager, create message templates and submit them for approval (takes 24-48 hours).'
        },
        {
          step: 5,
          title: 'Configure Webhook',
          description: 'Set up webhook for message status updates',
          details: 'Configure webhook URL in your app settings to receive delivery status updates and message events.'
        }
      ],
      requirements: ['WhatsApp Business Account', 'Meta for Developers Account', 'Verified Phone Number', 'Business Verification', 'Message Templates'],
      estimatedTime: '30-45 minutes',
      difficultyLevel: 'medium'
    }
  ];

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: ClientIntegration[] = [
      {
        clientId: '1',
        clientName: 'Maria Garcia',
        businessName: 'Bella Vista Restaurant',
        businessType: 'Restaurant',
        integrations: {
          meta_ads: 'connected',
          google_ads: 'pending',
          linkedin: 'not_started',
          whatsapp: 'connected'
        },
        lastUpdated: new Date(Date.now() - 3600000).toISOString(),
        totalLeads: 45
      },
      {
        clientId: '2',
        clientName: 'John Smith',
        businessName: 'FitLife Gym',
        businessType: 'Fitness',
        integrations: {
          meta_ads: 'connected',
          google_ads: 'connected',
          linkedin: 'pending',
          whatsapp: 'not_started'
        },
        lastUpdated: new Date(Date.now() - 7200000).toISOString(),
        totalLeads: 23
      },
      {
        clientId: '3',
        clientName: 'Sarah Johnson',
        businessName: 'Style Studio Salon',
        businessType: 'Beauty',
        integrations: {
          meta_ads: 'pending',
          google_ads: 'not_started',
          linkedin: 'not_started',
          whatsapp: 'not_started'
        },
        lastUpdated: new Date(Date.now() - 86400000).toISOString(),
        totalLeads: 0
      }
    ];

    setTimeout(() => {
      setClientIntegrations(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      connected: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      error: 'bg-red-100 text-red-800 border-red-200',
      not_started: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      meta_ads: '🎯',
      google_ads: '🔍',
      linkedin: '💼',
      whatsapp: '💬'
    };
    return icons[platform as keyof typeof icons] || '🔗';
  };

  const getPlatformName = (platform: string) => {
    const names = {
      meta_ads: 'Meta Ads',
      google_ads: 'Google Ads',
      linkedin: 'LinkedIn',
      whatsapp: 'WhatsApp'
    };
    return names[platform as keyof typeof names] || platform;
  };

  const getOverallStatus = (integrations: ClientIntegration['integrations']) => {
    const statuses = Object.values(integrations);
    if (statuses.every(s => s === 'connected')) return 'fully_connected';
    if (statuses.some(s => s === 'error')) return 'has_errors';
    if (statuses.some(s => s === 'pending')) return 'in_progress';
    return 'not_started';
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredClients = clientIntegrations.filter(client => {
    const matchesSearch = 
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase());

    const overallStatus = getOverallStatus(client.integrations);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'connected' && overallStatus === 'fully_connected') ||
      (statusFilter === 'pending' && overallStatus === 'in_progress') ||
      (statusFilter === 'error' && overallStatus === 'has_errors');

    const matchesPlatform = platformFilter === 'all' || 
      client.integrations[platformFilter as keyof typeof client.integrations] === 'connected';

    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const handleIntegrateClick = (client: ClientIntegration, platform: string) => {
    setSelectedClient(client);
    setSelectedPlatform(platform);
    setShowIntegrationModal(true);
  };

  const handleShowGuide = (platform: string) => {
    const guide = integrationGuides.find(g => g.platform === platform);
    if (guide) {
      setSelectedGuide(guide);
      setShowGuideModal(true);
    }
  };

  const handleIntegrationComplete = (success: boolean, message: string) => {
    setShowIntegrationModal(false);
    
    if (success) {
      setClientIntegrations(prev => 
        prev.map(client => 
          client.clientId === selectedClient?.clientId
            ? {
                ...client,
                integrations: {
                  ...client.integrations,
                  [selectedPlatform]: 'connected'
                },
                lastUpdated: new Date().toISOString()
              }
            : client
        )
      );
      alert(`✅ ${getPlatformName(selectedPlatform)} integration successful for ${selectedClient?.businessName}!`);
    } else {
      setClientIntegrations(prev => 
        prev.map(client => 
          client.clientId === selectedClient?.clientId
            ? {
                ...client,
                integrations: {
                  ...client.integrations,
                  [selectedPlatform]: 'error'
                },
                lastUpdated: new Date().toISOString()
              }
            : client
        )
      );
      alert(`❌ ${getPlatformName(selectedPlatform)} integration failed: ${message}`);
    }
    
    setSelectedClient(null);
    setSelectedPlatform('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-gray-900">Client Platform Integrations</h1>
          <p className="text-gray-600 mt-1">Manage platform integrations for each client individually</p>
        </div>
        <button
          onClick={() => setShowGuideModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-soft"
        >
          <InformationCircleIcon className="h-5 w-5 mr-2" />
          Integration Guides
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white overflow-hidden shadow-soft rounded-2xl border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Fully Connected</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    {clientIntegrations.filter(c => getOverallStatus(c.integrations) === 'fully_connected').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-soft rounded-2xl border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    {clientIntegrations.filter(c => getOverallStatus(c.integrations) === 'in_progress').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-soft rounded-2xl border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Has Errors</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    {clientIntegrations.filter(c => getOverallStatus(c.integrations) === 'has_errors').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-soft rounded-2xl border border-gray-100">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">0</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Not Started</dt>
                  <dd className="text-lg font-bold text-gray-900">
                    {clientIntegrations.filter(c => getOverallStatus(c.integrations) === 'not_started').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-soft border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
            <option value="all">All Statuses</option>
            <option value="connected">Fully Connected</option>
            <option value="pending">In Progress</option>
            <option value="error">Has Errors</option>
          </select>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
          >
            <option value="all">All Platforms</option>
            <option value="meta_ads">Meta Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="linkedin">LinkedIn</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <div className="flex items-center text-sm text-gray-500">
            <FunnelIcon className="h-4 w-4 mr-1" />
            {filteredClients.length} of {clientIntegrations.length} clients
          </div>
        </div>
      </div>

      {/* Client Integration Table */}
      <div className="bg-white shadow-soft rounded-2xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Meta Ads
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Google Ads
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  LinkedIn
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Leads
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.clientId} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{client.clientName}</div>
                      <div className="text-sm text-gray-500">{client.businessName}</div>
                      <div className="text-xs text-gray-400">{client.businessType}</div>
                    </div>
                  </td>
                  
                  {(['meta_ads', 'google_ads', 'linkedin', 'whatsapp'] as const).map((platform) => (
                    <td key={platform} className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(client.integrations[platform])}
                        {client.integrations[platform] === 'not_started' || client.integrations[platform] === 'error' ? (
                          <div className="flex flex-col sm:flex-row gap-1">
                            <button
                              onClick={() => handleIntegrateClick(client, platform)}
                              className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                            >
                              {client.integrations[platform] === 'error' ? 'Retry' : 'Connect'}
                            </button>
                            <button
                              onClick={() => handleShowGuide(platform)}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                              title="View integration guide"
                            >
                              <InformationCircleIcon className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">
                            {client.integrations[platform] === 'connected' ? 'Active' : 'Connecting...'}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                  
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {client.totalLeads}
                  </td>
                  
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(client.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No clients found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Integration Guide Modal */}
      {showGuideModal && (
        <IntegrationGuideModal
          guides={integrationGuides}
          selectedGuide={selectedGuide}
          onSelectGuide={setSelectedGuide}
          onClose={() => {
            setShowGuideModal(false);
            setSelectedGuide(null);
          }}
        />
      )}

      {/* Integration Modal */}
      {showIntegrationModal && selectedClient && (
        <IntegrationModal
          client={selectedClient}
          platform={selectedPlatform}
          onComplete={handleIntegrationComplete}
          onClose={() => setShowIntegrationModal(false)}
        />
      )}
    </div>
  );
};

// Integration Guide Modal Component
const IntegrationGuideModal: React.FC<{
  guides: IntegrationGuide[];
  selectedGuide: IntegrationGuide | null;
  onSelectGuide: (guide: IntegrationGuide) => void;
  onClose: () => void;
}> = ({ guides, selectedGuide, onSelectGuide, onClose }) => {
  const getPlatformIcon = (platform: string) => {
    const icons = {
      meta_ads: '🎯',
      google_ads: '🔍',
      linkedin: '💼',
      whatsapp: '💬'
    };
    return icons[platform as keyof typeof icons] || '🔗';
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
      <div className="relative top-4 mx-auto max-w-4xl bg-white shadow-large rounded-3xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-heading font-bold text-gray-900">
            Platform Integration Guides
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[80vh]">
          {/* Platform List */}
          <div className="w-full lg:w-1/3 border-r border-gray-200 p-4 overflow-y-auto">
            <div className="space-y-2">
              {guides.map((guide) => (
                <button
                  key={guide.platform}
                  onClick={() => onSelectGuide(guide)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    selectedGuide?.platform === guide.platform
                      ? 'bg-indigo-50 border-2 border-indigo-200'
                      : 'bg-white border-2 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPlatformIcon(guide.platform)}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{guide.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(guide.difficultyLevel)}`}>
                          {guide.difficultyLevel}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center">
                          <TimeIcon className="h-3 w-3 mr-1" />
                          {guide.estimatedTime}
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Guide Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedGuide ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-3xl">{getPlatformIcon(selectedGuide.platform)}</span>
                    <h4 className="text-2xl font-heading font-bold text-gray-900">{selectedGuide.title}</h4>
                  </div>
                  <p className="text-gray-600 mb-4">{selectedGuide.description}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(selectedGuide.difficultyLevel)}`}>
                      <DifficultyIcon className="h-4 w-4 mr-1" />
                      {selectedGuide.difficultyLevel.charAt(0).toUpperCase() + selectedGuide.difficultyLevel.slice(1)}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-indigo-600 bg-indigo-100 border border-indigo-200">
                      <TimeIcon className="h-4 w-4 mr-1" />
                      {selectedGuide.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedGuide.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Steps */}
                <div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Guide</h5>
                  <div className="space-y-4">
                    {selectedGuide.steps.map((step, index) => (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {step.step}
                          </div>
                          <div className="flex-1">
                            <h6 className="font-semibold text-gray-900 mb-1">{step.title}</h6>
                            <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                            <p className="text-xs text-gray-500 bg-white p-2 rounded-lg border border-gray-200">
                              {step.details}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Select a Platform</h4>
                  <p className="text-gray-500">Choose a platform from the left to view its integration guide.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Integration Modal Component
const IntegrationModal: React.FC<{
  client: ClientIntegration;
  platform: string;
  onComplete: (success: boolean, message: string) => void;
  onClose: () => void;
}> = ({ client, platform, onComplete, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    appId: '',
    appSecret: '',
    accessToken: '',
    pageId: '',
    accountId: '',
    phoneId: '',
    wabaId: ''
  });

  const handleIntegrate = async () => {
    setLoading(true);
    
    // Simulate integration process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate success/failure (80% success rate)
    const success = Math.random() > 0.2;
    
    if (success) {
      onComplete(true, 'Integration completed successfully');
    } else {
      onComplete(false, 'Failed to authenticate with platform API');
    }
    
    setLoading(false);
  };

  const getPlatformConfig = () => {
    const configs = {
      meta_ads: {
        name: 'Meta Ads (Facebook & Instagram)',
        icon: '🎯',
        fields: [
          { key: 'appId', label: 'App ID', type: 'text' },
          { key: 'appSecret', label: 'App Secret', type: 'password' },
          { key: 'pageId', label: 'Page ID', type: 'text' }
        ]
      },
      google_ads: {
        name: 'Google Ads',
        icon: '🔍',
        fields: [
          { key: 'accountId', label: 'Customer ID', type: 'text' },
          { key: 'accessToken', label: 'Access Token', type: 'password' }
        ]
      },
      linkedin: {
        name: 'LinkedIn',
        icon: '💼',
        fields: [
          { key: 'appId', label: 'Client ID', type: 'text' },
          { key: 'appSecret', label: 'Client Secret', type: 'password' }
        ]
      },
      whatsapp: {
        name: 'WhatsApp Business',
        icon: '💬',
        fields: [
          { key: 'accessToken', label: 'Access Token', type: 'password' },
          { key: 'phoneId', label: 'Phone Number ID', type: 'text' },
          { key: 'wabaId', label: 'WABA ID', type: 'text' }
        ]
      }
    };
    
    return configs[platform as keyof typeof configs] || configs.meta_ads;
  };

  const config = getPlatformConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 p-4">
      <div className="relative top-20 mx-auto max-w-md bg-white shadow-large rounded-3xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <span className="text-3xl mr-3">{config.icon}</span>
            <h3 className="text-xl font-heading font-bold text-gray-900">
              Connect {config.name}
            </h3>
          </div>
          
          {!loading ? (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <p className="text-sm text-indigo-800">
                  <strong>Client:</strong> {client.clientName}<br />
                  <strong>Business:</strong> {client.businessName}<br />
                  <strong>Type:</strong> {client.businessType}
                </p>
              </div>

              {config.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={credentials[field.key as keyof typeof credentials]}
                    onChange={(e) => setCredentials({
                      ...credentials,
                      [field.key]: e.target.value
                    })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleIntegrate}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-soft"
                >
                  Connect {config.name}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-6 text-sm text-gray-600">
                Connecting to {config.name}...<br />
                This may take a few moments.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIntegrations; 