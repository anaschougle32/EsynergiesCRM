import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useLeadStore, Lead } from '../../stores/leadStore';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Calendar, ListFilter, MessageSquare, TrendingUp, ArrowUpRight, MoreHorizontal, Users, Plus, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';
import { 
  UserGroupIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
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
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
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

interface WhatsAppActivity {
  id: string;
  leadId: string;
  leadName: string;
  templateName: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

interface RealTimeStats {
  leadsToday: number;
  leadsThisWeek: number;
  totalLeads: number;
  conversionRate: number;
  whatsappSent: number;
  whatsappDelivered: number;
  lastSync: string;
}

interface ExtendedLead extends Lead {
  whatsappStatus?: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  automationTriggered?: boolean;
}

const ClientDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { leads, fetchLeads, isLoading } = useLeadStore();
  const [clientLeads, setClientLeads] = useState<Lead[]>([]);
  const [whatsappActivity, setWhatsappActivity] = useState<WhatsAppActivity[]>([]);
  const [stats, setStats] = useState<RealTimeStats>({
    leadsToday: 0,
    leadsThisWeek: 0,
    totalLeads: 0,
    conversionRate: 0,
    whatsappSent: 0,
    whatsappDelivered: 0,
    lastSync: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [newLeadAlert, setNewLeadAlert] = useState<ExtendedLead | null>(null);
  const [realtimeLeads, setRealtimeLeads] = useState<ExtendedLead[]>([]);
  const [chartData, setChartData] = useState({
    leadsBySource: {
      options: {
        chart: {
          id: 'leads-by-source',
          toolbar: {
            show: false,
          },
        },
        colors: ['#3B82F6', '#0EA5E9', '#8B5CF6', '#10B981'],
        labels: ['Meta Ads', 'Google Ads', 'LinkedIn', 'WhatsApp'],
        legend: {
          position: 'bottom' as const,
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 300
            },
            legend: {
              position: 'bottom' as const
            }
          }
        }]
      },
      series: [0, 0, 0, 0],
    },
  });

  // Debug logging
  console.log('ClientDashboard - User:', user);
  console.log('ClientDashboard - Loading:', loading);
  console.log('ClientDashboard - Leads:', leads);

  // Early return for debugging
  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="section-spacing">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Debug:</strong> No user found in auth store
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    console.log('ClientDashboard - useEffect fetchLeads called');
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (leads.length > 0 && user) {
      // Filter leads for the current client
      // For demo, we're using client ID '1' for 'The Coffee House'
      const clientId = '1'; 
      const filteredLeads = leads.filter((lead) => lead.clientId === clientId);
      setClientLeads(filteredLeads);

      // Calculate leads by source for the donut chart
      const sourceMap: Record<string, number> = {
        meta_ads: 0,
        google_ads: 0,
        linkedin: 0,
        whatsapp: 0,
      };

      filteredLeads.forEach((lead) => {
        // Convert legacy sources to meta_ads
        if (lead.source === 'facebook' || lead.source === 'instagram') {
          sourceMap.meta_ads++;
        } else if (lead.source === 'google') {
          sourceMap.google_ads++;
        } else if (sourceMap[lead.source] !== undefined) {
          sourceMap[lead.source]++;
        }
      });

      setChartData((prev) => ({
        ...prev,
        leadsBySource: {
          ...prev.leadsBySource,
          series: [
            sourceMap.meta_ads,
            sourceMap.google_ads,
            sourceMap.linkedin,
            sourceMap.whatsapp,
          ],
        },
      }));
    }
  }, [leads, user]);

  // Simulate real-time lead updates
  useEffect(() => {
    // Initial data load
    const mockLeads: ExtendedLead[] = [
      {
        id: '1',
        name: 'John Smith',
        phone: '+1234567890',
        email: 'john@example.com',
        source: 'meta_ads',
        status: 'new',
        clientId: '1',
        clientName: 'The Coffee House',
        createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        whatsappStatus: 'delivered',
        automationTriggered: true
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        phone: '+1234567891',
        email: 'sarah@example.com',
        source: 'google',
        status: 'contacted',
        clientId: '1',
        clientName: 'The Coffee House',
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        lastContactedAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        whatsappStatus: 'read',
        automationTriggered: true
      },
      {
        id: '3',
        name: 'Mike Wilson',
        phone: '+1234567892',
        source: 'linkedin',
        status: 'new',
        clientId: '1',
        clientName: 'The Coffee House',
        createdAt: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        whatsappStatus: 'sent',
        automationTriggered: true
      }
    ];

    const mockWhatsAppActivity: WhatsAppActivity[] = [
      {
        id: '1',
        leadId: '1',
        leadName: 'John Smith',
        templateName: 'Welcome Message',
        status: 'delivered',
        sentAt: new Date(Date.now() - 240000).toISOString(), // 4 minutes ago
        deliveredAt: new Date(Date.now() - 180000).toISOString() // 3 minutes ago
      },
      {
        id: '2',
        leadId: '2',
        leadName: 'Sarah Johnson',
        templateName: 'Welcome Message',
        status: 'read',
        sentAt: new Date(Date.now() - 1740000).toISOString(), // 29 minutes ago
        deliveredAt: new Date(Date.now() - 1680000).toISOString(), // 28 minutes ago
        readAt: new Date(Date.now() - 900000).toISOString() // 15 minutes ago
      },
      {
        id: '3',
        leadId: '3',
        leadName: 'Mike Wilson',
        templateName: 'Welcome Message',
        status: 'sent',
        sentAt: new Date(Date.now() - 540000).toISOString() // 9 minutes ago
      }
    ];

    setRealtimeLeads(mockLeads);
    setWhatsappActivity(mockWhatsAppActivity);
    
    // Calculate stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);

    const leadsToday = mockLeads.filter(lead => new Date(lead.createdAt) >= today).length;
    const leadsThisWeek = mockLeads.filter(lead => new Date(lead.createdAt) >= thisWeek).length;
    const convertedLeads = mockLeads.filter(lead => lead.status === 'converted').length;
    const whatsappSent = mockWhatsAppActivity.length;
    const whatsappDelivered = mockWhatsAppActivity.filter(activity => 
      activity.status === 'delivered' || activity.status === 'read'
    ).length;

    setStats({
      leadsToday,
      leadsThisWeek,
      totalLeads: mockLeads.length,
      conversionRate: mockLeads.length > 0 ? (convertedLeads / mockLeads.length) * 100 : 0,
      whatsappSent,
      whatsappDelivered,
      lastSync: new Date().toISOString()
    });

    setLoading(false);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate new lead every 2-5 minutes (for demo purposes, much faster)
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newLead: ExtendedLead = {
          id: Date.now().toString(),
          name: `New Lead ${Math.floor(Math.random() * 1000)}`,
          phone: `+123456${Math.floor(Math.random() * 10000)}`,
          email: `lead${Math.floor(Math.random() * 1000)}@example.com`,
          source: ['meta_ads', 'google', 'linkedin'][Math.floor(Math.random() * 3)] as any,
          status: 'new',
          clientId: '1',
          clientName: 'The Coffee House',
          createdAt: new Date().toISOString(),
          whatsappStatus: 'pending',
          automationTriggered: false
        };

        setRealtimeLeads(prev => [newLead, ...prev]);
        setNewLeadAlert(newLead);

        // Trigger WhatsApp automation after 5-10 seconds
        setTimeout(() => {
          const whatsappMessage: WhatsAppActivity = {
            id: Date.now().toString(),
            leadId: newLead.id,
            leadName: newLead.name,
            templateName: 'Welcome Message',
            status: 'sent',
            sentAt: new Date().toISOString()
          };

          setWhatsappActivity(prev => [whatsappMessage, ...prev]);
          
          // Update lead status
          setRealtimeLeads(prev => prev.map(lead => 
            lead.id === newLead.id 
              ? { ...lead, whatsappStatus: 'sent', automationTriggered: true }
              : lead
          ));

          // Simulate delivery after 2-5 seconds
          setTimeout(() => {
            setWhatsappActivity(prev => prev.map(activity => 
              activity.id === whatsappMessage.id
                ? { ...activity, status: 'delivered', deliveredAt: new Date().toISOString() }
                : activity
            ));

            setRealtimeLeads(prev => prev.map(lead => 
              lead.id === newLead.id 
                ? { ...lead, whatsappStatus: 'delivered' }
                : lead
            ));
          }, Math.random() * 3000 + 2000); // 2-5 seconds

        }, Math.random() * 5000 + 5000); // 5-10 seconds

        // Update stats
        setStats(prev => ({
          ...prev,
          leadsToday: prev.leadsToday + 1,
          leadsThisWeek: prev.leadsThisWeek + 1,
          totalLeads: prev.totalLeads + 1,
          lastSync: new Date().toISOString()
        }));

        // Clear alert after 5 seconds
        setTimeout(() => setNewLeadAlert(null), 5000);
      }

      // Update last sync time
      setStats(prev => ({ ...prev, lastSync: new Date().toISOString() }));
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  // Calculate stats
  const totalLeads = clientLeads.length;
  
  // Leads this week
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const leadsThisWeek = clientLeads.filter(
    (lead) => new Date(lead.createdAt) >= oneWeekAgo
  ).length;
  
  // Leads this month
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const leadsThisMonth = clientLeads.filter(
    (lead) => new Date(lead.createdAt) >= firstDayOfMonth
  ).length;

  // Get most recent leads
  const recentLeads = [...clientLeads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getSourceIcon = (source: string) => {
    const icons = {
      'meta_ads': '🎯',
      'google': '🔍',
      'google_ads': '🔍',
      'linkedin': '💼',
      'whatsapp': '💬',
      'facebook': '🎯', // Legacy support
      'instagram': '🎯' // Legacy support
    };
    return icons[source as keyof typeof icons] || '🔗';
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'badge badge-info',
      contacted: 'badge badge-warning',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'badge badge-success',
      sent: 'badge badge-info',
      delivered: 'badge badge-success',
      read: 'badge badge-success',
      failed: 'badge badge-danger',
      pending: 'badge badge-secondary'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getWhatsAppStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
      case 'read':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mobile-card">
                <div className="mobile-card-body">
                  <div className="loading-skeleton h-64 w-full"></div>
                </div>
              </div>
            </div>
            <div>
              <div className="mobile-card">
                <div className="mobile-card-body">
                  <div className="loading-skeleton h-64 w-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="section-spacing">
        {/* Real-time Alert */}
        {newLeadAlert && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white p-4 rounded-xl shadow-large animate-slide-up">
            <div className="flex items-center">
              <BellIcon className="h-5 w-5 mr-2" />
              <div>
                <p className="font-semibold">🎉 New Lead!</p>
                <p className="text-sm">{newLeadAlert.name} from {newLeadAlert.source}</p>
                <p className="text-xs">WhatsApp automation triggered</p>
              </div>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="section-gap">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title text-gray-900">Welcome back!</h1>
              <p className="mobile-text text-gray-600 mt-2">Here's what's happening with your leads today</p>
            </div>
            <Link
              to="/client/leads"
              className="btn-mobile-primary hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              View All Leads
            </Link>
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
              trend={{ value: 12, isPositive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Today"
              value={stats.leadsToday}
              icon={<Calendar className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              trend={{ value: 8, isPositive: true }}
              isLoading={loading}
            />
            <StatCard
              title="This Week"
              value={stats.leadsThisWeek}
              icon={<TrendingUp className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              trend={{ value: 15, isPositive: true }}
              isLoading={loading}
            />
            <StatCard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              icon={<CheckCircle className="h-6 w-6" />}
              iconColor="bg-emerald-100 text-emerald-600"
              trend={{ value: 3, isPositive: true }}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="section-gap">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <div className="lg:col-span-2">
              <div className="content-section">
                <div className="content-header">
                  <div className="flex items-center justify-between">
                    <h3 className="content-title">Recent Leads</h3>
                    <Link
                      to="/client/leads"
                      className="btn-mobile-ghost text-sm"
                    >
                      View all
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
                
                <div className="content-body">
                  {recentLeads.length > 0 ? (
                    <div className="space-y-3">
                      {recentLeads.map((lead, index) => (
                        <div 
                          key={lead.id} 
                          className="list-item animate-slide-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="list-item-content">
                            <div className="list-item-avatar">
                              {lead.name.charAt(0)}
                            </div>
                            <div className="list-item-details">
                              <div className="flex items-center justify-between mb-1">
                                <p className="list-item-title">{lead.name}</p>
                                {getStatusBadge(lead.status)}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <span className="mr-1">{getSourceIcon(lead.source)}</span>
                                  {lead.source}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(lead.createdAt), 'HH:mm')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="list-item-actions">
                            <Link
                              to={`/client/leads/${lead.id}`}
                              className="action-btn-primary"
                            >
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                      <p className="text-gray-500">Your leads will appear here once they start coming in.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions & Stats */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="content-section">
                <div className="content-header">
                  <h3 className="content-title">Quick Actions</h3>
                </div>
                
                <div className="content-body">
                  <div className="space-y-3">
                    <Link
                      to="/client/leads"
                      className="mobile-card-interactive w-full p-4 flex items-center space-x-3"
                    >
                      <div className="stat-card-icon bg-blue-100 text-blue-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">View All Leads</p>
                        <p className="text-sm text-gray-500">Manage your lead pipeline</p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-gray-400" />
                    </Link>

                    <Link
                      to="/client/whatsapp"
                      className="mobile-card-interactive w-full p-4 flex items-center space-x-3"
                    >
                      <div className="stat-card-icon bg-green-100 text-green-600">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">WhatsApp Messages</p>
                        <p className="text-sm text-gray-500">View message history</p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-gray-400" />
                    </Link>

                    <Link
                      to="/client/settings"
                      className="mobile-card-interactive w-full p-4 flex items-center space-x-3"
                    >
                      <div className="stat-card-icon bg-purple-100 text-purple-600">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Account Settings</p>
                        <p className="text-sm text-gray-500">Manage your profile</p>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Lead Sources */}
              <div className="content-section">
                <div className="content-header">
                  <h3 className="content-title">Lead Sources</h3>
                </div>
                
                <div className="content-body">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <p className="font-medium text-gray-900">Meta Ads</p>
                          <p className="text-sm text-gray-500">Facebook & Instagram</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">45%</p>
                        <p className="text-xs text-gray-500">of leads</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔍</span>
                        <div>
                          <p className="font-medium text-gray-900">Google Ads</p>
                          <p className="text-sm text-gray-500">Search & Display</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">32%</p>
                        <p className="text-xs text-gray-500">of leads</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-2xl">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💼</span>
                        <div>
                          <p className="font-medium text-gray-900">LinkedIn</p>
                          <p className="text-sm text-gray-500">Professional network</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">23%</p>
                        <p className="text-xs text-gray-500">of leads</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="section-gap lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/client/leads"
              className="btn-mobile-primary"
            >
              <Users className="h-4 w-4 mr-2" />
              View Leads
            </Link>
            <Link
              to="/client/whatsapp"
              className="btn-mobile-secondary"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;