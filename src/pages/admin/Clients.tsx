import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClientStore } from '../../stores/clientStore';
import { formatDate } from '../../utils/dateUtils';
import { Plus, Search, MoreHorizontal, User, Mail, Phone, Calendar, Check, X, Eye, ArrowUpRight, Filter } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';

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

const AdminClients: React.FC = () => {
  const { clients, fetchClients, isLoading } = useClientStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' || client.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleAddClient = () => {
    setIsAddClientModalOpen(true);
  };

  // Calculate stats
  const activeClients = clients.filter(client => client.status === 'active').length;
  const pendingClients = clients.filter(client => client.status === 'pending').length;
  const totalClients = clients.length;

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'badge badge-success',
      pending: 'badge badge-warning',
      inactive: 'badge badge-secondary'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium`}>
        {status === 'active' ? (
          <Check size={12} className="mr-1" />
        ) : status === 'inactive' ? (
          <X size={12} className="mr-1" />
        ) : null}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
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
              <h1 className="mobile-title text-gray-900">Clients</h1>
              <p className="mobile-text text-gray-600 mt-2">Manage your marketing agency clients</p>
            </div>
            <button
              onClick={handleAddClient}
              className="btn-mobile-primary hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="section-gap">
          <div className="stats-grid">
            <StatCard
              title="Total Clients"
              value={totalClients}
              icon={<User className="h-6 w-6" />}
              iconColor="bg-blue-100 text-blue-600"
              isLoading={isLoading}
            />
            <StatCard
              title="Active Clients"
              value={activeClients}
              icon={<Check className="h-6 w-6" />}
              iconColor="bg-green-100 text-green-600"
              isLoading={isLoading}
            />
            <StatCard
              title="Pending Clients"
              value={pendingClients}
              icon={<Calendar className="h-6 w-6" />}
              iconColor="bg-yellow-100 text-yellow-600"
              isLoading={isLoading}
            />
            <StatCard
              title="This Month"
              value={clients.filter(client => {
                const clientDate = new Date(client.createdAt);
                const now = new Date();
                return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear();
              }).length}
              icon={<Plus className="h-6 w-6" />}
              iconColor="bg-purple-100 text-purple-600"
              isLoading={isLoading}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="form-input pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="form-select"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              {/* Filter Summary */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredClients.length} of {clients.length} clients
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

        {/* Clients List */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <h3 className="content-title">All Clients</h3>
            </div>
            
            <div className="content-body">
              {filteredClients.length === 0 ? (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center">
                    <User className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                    <p className="text-gray-500 mb-6">
                      {searchTerm || statusFilter !== 'all'
                        ? 'Try adjusting your search criteria or filters.'
                        : 'Get started by adding your first client.'}
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <button
                        onClick={handleAddClient}
                        className="btn-mobile-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Client
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredClients.map((client, index) => (
                    <div 
                      key={client.id} 
                      className="list-item animate-slide-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="list-item-content">
                        <div className="list-item-avatar">
                          {client.businessName.charAt(0)}
                        </div>
                        <div className="list-item-details">
                          <div className="flex items-center justify-between mb-2">
                            <p className="list-item-title">{client.businessName}</p>
                            {getStatusBadge(client.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-1">
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {client.name}
                            </span>
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {client.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {client.businessType}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatDate(client.createdAt, 'MMM dd, yyyy')}
                            </span>
                          </div>
                          {client.planName && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {client.planName}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="list-item-actions">
                        <Link
                          to={`/admin/clients/${client.id}`}
                          className="action-btn-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button className="action-btn-secondary">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
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
                      <th>Client</th>
                      <th>Status</th>
                      <th>Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.slice(0, 5).map((client) => (
                      <tr key={client.id}>
                        <td>
                          <div className="flex items-center space-x-3">
                            <div className="list-item-avatar text-sm">
                              {client.businessName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{client.businessName}</p>
                              <p className="text-xs text-gray-500">{client.name}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(client.status)}
                        </td>
                        <td>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {client.businessType}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/admin/clients/${client.id}`}
                              className="action-btn-primary"
                            >
                              <Eye className="h-3 w-3" />
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

        {/* Mobile Add Client Button */}
        <div className="section-gap lg:hidden">
          <button
            onClick={handleAddClient}
            className="btn-mobile-primary w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminClients;