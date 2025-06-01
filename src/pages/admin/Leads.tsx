import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Calendar,
  MessageSquare,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  source: string;
  client: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  notes?: string;
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

const AdminLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLeads: Lead[] = [
      {
        id: '1',
        fullName: 'Alice Brown',
        email: 'alice@email.com',
        phone: '+1234567894',
        source: 'Facebook',
        client: 'Bella Vista Restaurant',
        status: 'new',
        createdAt: new Date().toISOString(),
        notes: 'Interested in dinner reservations'
      },
      {
        id: '2',
        fullName: 'Bob Davis',
        email: 'bob@email.com',
        phone: '+1234567895',
        source: 'Instagram',
        client: 'Bella Vista Restaurant',
        status: 'contacted',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        notes: 'Called about catering services'
      },
      {
        id: '3',
        fullName: 'Carol White',
        email: 'carol@email.com',
        phone: '+1234567896',
        source: 'Facebook',
        client: 'Glamour Hair Salon',
        status: 'new',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        notes: 'Looking for hair styling'
      },
      {
        id: '4',
        fullName: 'David Miller',
        email: 'david@email.com',
        phone: '+1234567897',
        source: 'Google Ads',
        client: 'Glamour Hair Salon',
        status: 'qualified',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        notes: 'Booked appointment for next week'
      },
      {
        id: '5',
        fullName: 'Eva Green',
        email: 'eva@email.com',
        phone: '+1234567898',
        source: 'Facebook',
        client: 'FitLife Gym',
        status: 'new',
        createdAt: new Date(Date.now() - 345600000).toISOString(),
        notes: 'Interested in gym membership'
      },
      {
        id: '6',
        fullName: 'Frank Taylor',
        email: 'frank@email.com',
        phone: '+1234567899',
        source: 'Google Ads',
        client: 'FitLife Gym',
        status: 'converted',
        createdAt: new Date(Date.now() - 432000000).toISOString(),
        notes: 'Signed up for annual membership'
      }
    ];

    setTimeout(() => {
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setLoading(false);
    }, 1000);
  }, []);

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

    // Client filter
    if (clientFilter !== 'all') {
      filtered = filtered.filter(lead => lead.client === clientFilter);
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
  }, [leads, searchTerm, statusFilter, sourceFilter, clientFilter, dateFilter]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'badge badge-info',
      contacted: 'badge badge-warning',
      qualified: 'bg-purple-100 text-purple-800 border border-purple-200',
      converted: 'badge badge-success',
      lost: 'badge badge-danger'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      'Facebook': '📘',
      'Instagram': '📷',
      'Google Ads': '🔍',
      'LinkedIn': '💼',
      'WhatsApp': '💬'
    };
    return icons[source as keyof typeof icons] || '🔗';
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Source', 'Client', 'Status', 'Created At', 'Notes'],
      ...filteredLeads.map(lead => [
        lead.fullName,
        lead.email,
        lead.phone,
        lead.source,
        lead.client,
        lead.status,
        format(new Date(lead.createdAt), 'yyyy-MM-dd HH:mm'),
        lead.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leads.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleStatusChange = (leadId: string, newStatus: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, status: newStatus as any } : lead
    ));
  };

  // Calculate stats
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'new').length;
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

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
              <h1 className="mobile-title text-gray-900">Leads Management</h1>
              <p className="mobile-text text-gray-600 mt-2">Track and manage leads from all platforms</p>
            </div>
            <button
              onClick={handleExport}
              className="btn-mobile-primary hidden sm:flex"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Total Leads"
              value={totalLeads}
              icon={<Users className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              trend={{ value: 12, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="New Leads"
              value={newLeads}
              icon={<Plus className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              trend={{ value: 8, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Converted"
              value={convertedLeads}
              icon={<TrendingUp className="h-6 w-6" />}
              iconColor="bg-emerald-100 text-emerald-600"
              trend={{ value: 15, positive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              icon={<Calendar className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              trend={{ value: 3, positive: true }}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="content-title">Filters</h3>
              </div>
            </div>
            
            <div className="content-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
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
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>

                {/* Client Filter */}
                <div>
                  <select
                    value={clientFilter}
                    onChange={(e) => setClientFilter(e.target.value)}
                    className="form-select"
                  >
                    <option value="all">All Clients</option>
                    <option value="Bella Vista Restaurant">Bella Vista Restaurant</option>
                    <option value="Glamour Hair Salon">Glamour Hair Salon</option>
                    <option value="FitLife Gym">FitLife Gym</option>
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
                {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setSourceFilter('all');
                      setClientFilter('all');
                      setDateFilter('all');
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
                            <div className="flex items-center space-x-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <span className="mr-1">{getSourceIcon(lead.source)}</span>
                                {lead.source}
                              </span>
                              <span className="text-xs text-gray-500">{lead.client}</span>
                            </div>
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
                        <button className="action-btn-primary">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="action-btn-secondary">
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
                  <div className="flex flex-col items-center">
                    <Users className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all'
                        ? 'Try adjusting your search criteria or filters.'
                        : 'Leads from connected platforms will appear here.'}
                    </p>
                    {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || clientFilter !== 'all' || dateFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setSourceFilter('all');
                          setClientFilter('all');
                          setDateFilter('all');
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

        {/* Mobile Export Button */}
        <div className="section-gap lg:hidden">
          <button
            onClick={handleExport}
            className="btn-mobile-primary w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLeads; 