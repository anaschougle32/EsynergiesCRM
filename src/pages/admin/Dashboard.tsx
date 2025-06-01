import React, { useEffect, useState } from 'react';
import { useClientStore } from '../../stores/clientStore';
import { useLeadStore } from '../../stores/leadStore';
import { format, startOfDay } from 'date-fns';
import {
  Users,
  UserPlus,
  MessageSquare,
  Activity,
  ArrowUpRight,
  ListFilter,
  Filter,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import Button from '../../components/ui/Button';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  change?: {
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
  change,
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
            {change && !isLoading && (
              <div className={`stat-card-change ${
                change.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`h-4 w-4 ${change.positive ? '' : 'rotate-180'}`} />
                <span className="ml-1">{Math.abs(change.value)}%</span>
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

const AdminDashboard: React.FC = () => {
  const { clients, fetchClients, isLoading: clientsLoading } = useClientStore();
  const { leads, fetchLeads, isLoading: leadsLoading } = useLeadStore();
  const [todayLeads, setTodayLeads] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    leadsBySource: {
      options: {
        chart: {
          id: 'leads-by-source',
          toolbar: {
            show: false,
          },
        },
        colors: ['#3B82F6', '#0EA5E9', '#8B5CF6', '#F59E0B', '#10B981'],
        labels: ['Facebook', 'Instagram', 'Google', 'WhatsApp', 'LinkedIn'],
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
      series: [0, 0, 0, 0, 0],
    },
    leadsOverTime: {
      options: {
        chart: {
          id: 'leads-over-time',
          type: 'area' as const,
          toolbar: {
            show: false,
          },
        },
        colors: ['#3B82F6'],
        xaxis: {
          categories: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return format(date, 'MMM dd');
          }),
          labels: {
            rotateAlways: false,
          },
        },
        yaxis: {
          labels: {
            formatter: (value: number) => Math.floor(value).toString(),
          },
        },
        stroke: {
          curve: 'smooth' as const,
          width: 3,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.2,
            stops: [0, 90, 100]
          }
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          x: {
            format: 'dd MMM',
          },
        },
      },
      series: [
        {
          name: 'Leads',
          data: [0, 0, 0, 0, 0, 0, 0],
        },
      ],
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchClients(), fetchLeads()]);
      setLoading(false);
    };
    loadData();
  }, [fetchClients, fetchLeads]);

  useEffect(() => {
    if (leads.length > 0) {
      // Calculate today's leads
      const today = startOfDay(new Date());
      const todayLeadsCount = leads.filter(
        (lead) => new Date(lead.createdAt) >= today
      ).length;
      setTodayLeads(todayLeadsCount);

      // Calculate leads by source for the pie chart
      const sourceMap: Record<string, number> = {
        facebook: 0,
        instagram: 0,
        google: 0,
        whatsapp: 0,
        linkedin: 0,
      };

      leads.forEach((lead) => {
        if (sourceMap[lead.source] !== undefined) {
          sourceMap[lead.source]++;
        }
      });

      setChartData((prev) => ({
        ...prev,
        leadsBySource: {
          ...prev.leadsBySource,
          series: [
            sourceMap.facebook,
            sourceMap.instagram,
            sourceMap.google,
            sourceMap.whatsapp,
            sourceMap.linkedin,
          ],
        },
        leadsOverTime: {
          ...prev.leadsOverTime,
          series: [
            {
              name: 'Leads',
              data: Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dayStart = startOfDay(date);
                const dayEnd = new Date(dayStart);
                dayEnd.setDate(dayEnd.getDate() + 1);
                
                return leads.filter(
                  (lead) => {
                    const leadDate = new Date(lead.createdAt);
                    return leadDate >= dayStart && leadDate < dayEnd;
                  }
                ).length;
              }),
            },
          ],
        },
      }));
    }
  }, [leads]);

  // Calculate stats
  const activeClients = clients.filter(client => client.status === 'active').length;
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

  // Get recent leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get recent clients
  const recentClients = [...clients]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getSourceIcon = (source: string) => {
    const icons = {
      facebook: '📘',
      instagram: '📷',
      google: '🔍',
      whatsapp: '💬',
      linkedin: '💼',
      meta_ads: '🎯'
    };
    return icons[source as keyof typeof icons] || '🔗';
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'badge badge-info',
      contacted: 'badge badge-warning',
      qualified: 'bg-purple-100 text-purple-800 border border-purple-200',
      converted: 'badge badge-success',
      lost: 'badge badge-danger',
      active: 'badge badge-success',
      inactive: 'badge badge-secondary',
      pending: 'badge badge-warning'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="mobile-card">
              <div className="mobile-card-body">
                <div className="loading-skeleton h-64 w-full"></div>
              </div>
            </div>
            <div className="mobile-card">
              <div className="mobile-card-body">
                <div className="loading-skeleton h-64 w-full"></div>
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
        {/* Header Section */}
        <div className="section-gap">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title text-gray-900">Admin Dashboard</h1>
              <p className="mobile-text text-gray-600 mt-2">Overview of your marketing agency performance</p>
            </div>
            <Link
              to="/admin/clients"
              className="btn-mobile-primary hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Total Clients"
              value={clients.length}
              icon={<Users className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              change={{ value: 12, positive: true }}
              isLoading={clientsLoading}
            />
            <StatCard
              title="Active Clients"
              value={activeClients}
              icon={<UserPlus className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              change={{ value: 8, positive: true }}
              isLoading={clientsLoading}
            />
            <StatCard
              title="Total Leads"
              value={totalLeads}
              icon={<ListFilter className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              change={{ value: 15, positive: true }}
              isLoading={leadsLoading}
            />
            <StatCard
              title="Conversion Rate"
              value={`${conversionRate}%`}
              icon={<TrendingUp className="h-6 w-6" />}
              iconColor="bg-emerald-100 text-emerald-600"
              change={{ value: 3, positive: true }}
              isLoading={leadsLoading}
            />
          </div>
        </div>

        {/* Charts Section */}
        <div className="section-gap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leads Over Time */}
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Leads Over Time</h3>
                <p className="content-description">Last 7 days performance</p>
              </div>
              <div className="content-body">
                <Chart
                  options={chartData.leadsOverTime.options}
                  series={chartData.leadsOverTime.series}
                  type="area"
                  height={300}
                />
              </div>
            </div>

            {/* Leads by Source */}
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Leads by Source</h3>
                <p className="content-description">Distribution across platforms</p>
              </div>
              <div className="content-body">
                <Chart
                  options={chartData.leadsBySource.options}
                  series={chartData.leadsBySource.series}
                  type="donut"
                  height={300}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section-gap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Leads */}
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <h3 className="content-title">Recent Leads</h3>
                  <Link
                    to="/admin/leads"
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
                              <span>{lead.clientName}</span>
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <Link
                            to={`/admin/leads`}
                            className="action-btn-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ListFilter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No leads yet</h3>
                    <p className="text-gray-500">Leads will appear here once clients start receiving them.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Clients */}
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <h3 className="content-title">Recent Clients</h3>
                  <Link
                    to="/admin/clients"
                    className="btn-mobile-ghost text-sm"
                  >
                    View all
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="content-body">
                {recentClients.length > 0 ? (
                  <div className="space-y-3">
                    {recentClients.map((client, index) => (
                      <div 
                        key={client.id} 
                        className="list-item animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="list-item-content">
                          <div className="list-item-avatar">
                            {client.businessName.charAt(0)}
                          </div>
                          <div className="list-item-details">
                            <div className="flex items-center justify-between mb-1">
                              <p className="list-item-title">{client.businessName}</p>
                              {getStatusBadge(client.status)}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{client.name}</span>
                              <span>{client.businessType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="list-item-actions">
                          <Link
                            to={`/admin/clients/${client.id}`}
                            className="action-btn-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
                    <p className="text-gray-500">Add your first client to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="section-gap lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/clients"
              className="btn-mobile-primary"
            >
              <Users className="h-4 w-4 mr-2" />
              Clients
            </Link>
            <Link
              to="/admin/leads"
              className="btn-mobile-secondary"
            >
              <ListFilter className="h-4 w-4 mr-2" />
              Leads
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;