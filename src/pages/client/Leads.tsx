import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChartBarIcon,
  PlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { hapticFeedback } from '../../utils/mobile';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  notes?: string;
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
              <div className="loading-skeleton h-8 w-16 mt-2"></div>
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

const ClientLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const mockLeads: Lead[] = [
      {
        id: '1',
        fullName: 'Alice Brown',
        email: 'alice@email.com',
        phone: '+1234567894',
        source: 'Meta Ads',
        status: 'new',
        createdAt: new Date().toISOString(),
        notes: 'Interested in dinner reservations'
      },
      {
        id: '2',
        fullName: 'Bob Davis',
        email: 'bob@email.com',
        phone: '+1234567895',
        source: 'Meta Ads',
        status: 'contacted',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        notes: 'Called about catering services'
      },
      {
        id: '3',
        fullName: 'Carol White',
        email: 'carol@email.com',
        phone: '+1234567896',
        source: 'Google Ads',
        status: 'qualified',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        notes: 'Interested in weekly meal plans'
      },
      {
        id: '4',
        fullName: 'David Miller',
        email: 'david@email.com',
        phone: '+1234567897',
        source: 'Meta Ads',
        status: 'converted',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        notes: 'Booked table for anniversary dinner'
      },
      {
        id: '5',
        fullName: 'Emma Wilson',
        email: 'emma@email.com',
        phone: '+1234567898',
        source: 'LinkedIn',
        status: 'new',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        notes: 'Corporate event inquiry'
      },
      {
        id: '6',
        fullName: 'Frank Johnson',
        email: 'frank@email.com',
        phone: '+1234567899',
        source: 'WhatsApp',
        status: 'contacted',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        notes: 'Birthday party booking'
      }
    ];

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
    setLoading(false);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    
    try {
      await loadLeads();
      hapticFeedback.success();
    } catch (error) {
      hapticFeedback.error();
    } finally {
      setRefreshing(false);
    }
  };

  // Filter leads based on search and filters
  useEffect(() => {
    let filtered = leads;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.source === sourceFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      if (dateFilter !== 'all') {
        filtered = filtered.filter(lead => new Date(lead.createdAt) >= filterDate);
      }
    }

    setFilteredLeads(filtered);
  }, [leads, searchTerm, statusFilter, sourceFilter, dateFilter]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'badge badge-info',
      contacted: 'badge badge-warning',
      qualified: 'bg-purple-100 text-purple-800 border border-purple-200',
      converted: 'badge badge-success',
      lost: 'badge badge-danger'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      'Meta Ads': '🎯',
      'Google Ads': '🔍',
      'LinkedIn': '💼',
      'WhatsApp': '💬'
    };
    return icons[source as keyof typeof icons] || '🔗';
  };

  const getSourceBadge = (source: string) => {
    const sourceStyles = {
      'Meta Ads': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Google Ads': 'bg-red-100 text-red-800 border border-red-200',
      'LinkedIn': 'bg-indigo-100 text-indigo-800 border border-indigo-200',
      'WhatsApp': 'bg-green-100 text-green-800 border border-green-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceStyles[source as keyof typeof sourceStyles] || 'bg-gray-100 text-gray-800 border border-gray-200'}`}>
        <span className="mr-1">{getSourceIcon(source)}</span>
        {source}
      </span>
    );
  };

  const handleLeadAction = (action: string, leadId: string) => {
    hapticFeedback.light();
    // Handle lead actions
    console.log(`${action} action for lead ${leadId}`);
  };

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
              <h1 className="mobile-title text-gray-900">My Leads</h1>
              <p className="mobile-text text-gray-600 mt-2">View and manage all your leads from connected platforms</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-mobile-secondary"
            >
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Total Leads"
              value={leads.length}
              icon={<UserGroupIcon className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              isLoading={loading}
            />
            <StatCard
              title="New Leads"
              value={leads.filter(lead => lead.status === 'new').length}
              icon={<SparklesIcon className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              isLoading={loading}
            />
            <StatCard
              title="Converted"
              value={leads.filter(lead => lead.status === 'converted').length}
              icon={<CheckCircleIcon className="h-6 w-6" />}
              iconColor="bg-emerald-100 text-emerald-600"
              isLoading={loading}
            />
            <StatCard
              title="Conversion Rate"
              value={`${leads.length > 0 ? Math.round((leads.filter(lead => lead.status === 'converted').length / leads.length) * 100) : 0}%`}
              icon={<ChartBarIcon className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              isLoading={loading}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <div className="flex items-center">
                <FunnelIcon className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="content-title">Filters</h3>
              </div>
            </div>
            
            <div className="content-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search leads..."
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
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {/* Source Filter */}
                <div>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">All Sources</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>
              
              {/* Filter Summary */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredLeads.length} of {leads.length} leads
                </div>
                {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || dateFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setSourceFilter('all');
                      setDateFilter('all');
                      hapticFeedback.light();
                    }}
                    className="btn-mobile-ghost text-sm"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <h3 className="content-title">All Leads</h3>
            </div>
            
            <div className="content-body">
              {filteredLeads.length > 0 ? (
                <div className="space-y-3">
                  {filteredLeads.map((lead, index) => (
                    <div 
                      key={lead.id} 
                      className="list-item animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="list-item-content">
                        <div className="list-item-avatar">
                          {lead.fullName.charAt(0)}
                        </div>
                        <div className="list-item-details">
                          <div className="flex items-center justify-between mb-2">
                            <p className="list-item-title">{lead.fullName}</p>
                            {getStatusBadge(lead.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-1">
                            <span className="flex items-center">
                              <span className="mr-1">📧</span>
                              {lead.email}
                            </span>
                            <span className="flex items-center">
                              <span className="mr-1">📱</span>
                              {lead.phone}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            {getSourceBadge(lead.source)}
                            <span className="text-xs text-gray-400">
                              {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          {lead.notes && (
                            <p className="list-item-subtitle mt-2 truncate max-w-xs">{lead.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="list-item-actions">
                        <Link
                          to={`/client/leads/${lead.id}`}
                          className="action-btn-primary"
                          onClick={() => hapticFeedback.light()}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button 
                          className="action-btn-success"
                          onClick={() => handleLeadAction('message', lead.id)}
                        >
                          <ChatBubbleLeftRightIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <UserGroupIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || dateFilter !== 'all'
                        ? 'Try adjusting your search criteria or filters.'
                        : 'Leads from your connected platforms will appear here.'}
                    </p>
                    {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || dateFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setSourceFilter('all');
                          setDateFilter('all');
                          hapticFeedback.light();
                        }}
                        className="btn-mobile-primary"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Table View (Hidden on Desktop) */}
        <div className="section-gap lg:hidden">
          <div className="content-section">
            <div className="content-header">
              <h3 className="content-title">Quick View</h3>
            </div>
            
            <div className="content-body">
              <div className="overflow-x-auto">
                <table className="responsive-table">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Source</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.slice(0, 5).map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="list-item-avatar text-sm">
                              {lead.fullName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{lead.fullName}</p>
                              <p className="text-xs text-gray-500">{lead.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          {getSourceBadge(lead.source)}
                        </td>
                        <td>
                          {getStatusBadge(lead.status)}
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/client/leads/${lead.id}`}
                              className="action-btn-primary"
                              onClick={() => hapticFeedback.light()}
                            >
                              <EyeIcon className="h-3 w-3" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLeads; 