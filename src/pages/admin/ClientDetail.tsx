import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useClientStore } from '../../stores/clientStore';
import { ArrowLeft, Building, Mail, Phone, Calendar, Check, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/dateUtils';

const AdminClientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedClient, fetchClient, isLoading } = useClientStore();

  useEffect(() => {
    if (id) {
      fetchClient(id);
    }
  }, [id, fetchClient]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="h-32 w-32 animate-pulse rounded-full bg-gray-200"></div>
          </div>
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  if (!selectedClient) {
    return (
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">Client not found</h2>
        <p className="mt-2 text-gray-600">The client you're looking for doesn't exist or has been removed.</p>
        <Button
          as={Link}
          to="/admin/clients"
          variant="primary"
          className="mt-4"
        >
          Back to Clients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/admin/clients"
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{selectedClient.businessName}</h1>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Edit Client</Button>
          <Button variant="danger">Delete Client</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <Building size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Business Name</p>
                    <p className="font-medium text-gray-900">{selectedClient.businessName}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-900">{selectedClient.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{selectedClient.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedClient.createdAt, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      selectedClient.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedClient.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {selectedClient.status === 'active' ? (
                      <Check size={12} className="mr-1" />
                    ) : selectedClient.status === 'inactive' ? (
                      <X size={12} className="mr-1" />
                    ) : null}
                    {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Current Plan</p>
                  <p className="font-medium text-gray-900">
                    {selectedClient.planName || 'No active plan'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium text-gray-900">
                    {selectedClient.lastLogin
                      ? formatDate(selectedClient.lastLogin, 'PPp')
                      : 'Never logged in'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetail;