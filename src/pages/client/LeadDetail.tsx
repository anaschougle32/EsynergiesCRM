import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  CheckIcon,
  UserIcon,
  CalendarIcon,
  LinkIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  createdAt: string;
  notes: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

interface WhatsAppMessage {
  id: string;
  templateName: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
}

const ClientLeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [whatsappMessages, setWhatsappMessages] = useState<WhatsAppMessage[]>([]);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockLead: Lead = {
      id: id || '1',
      fullName: 'Alice Brown',
      email: 'alice@email.com',
      phone: '+1234567894',
      source: 'Meta Ads',
      status: 'new',
      createdAt: new Date().toISOString(),
      notes: 'Interested in dinner reservations for anniversary. Prefers weekend slots.',
      sourceUrl: 'https://facebook.com/ad/12345',
      utmSource: 'facebook',
      utmMedium: 'cpc',
      utmCampaign: 'anniversary_dinner'
    };

    const mockMessages: WhatsAppMessage[] = [
      {
        id: '1',
        templateName: 'Welcome Message',
        content: 'Hi Alice, thank you for your interest! We will contact you shortly.',
        status: 'read',
        sentAt: new Date(Date.now() - 3600000).toISOString(),
        deliveredAt: new Date(Date.now() - 3500000).toISOString(),
        readAt: new Date(Date.now() - 3000000).toISOString()
      },
      {
        id: '2',
        templateName: 'Follow Up',
        content: 'Hi Alice, we noticed you were interested in our anniversary dinner packages. Would you like to schedule a consultation?',
        status: 'delivered',
        sentAt: new Date(Date.now() - 1800000).toISOString(),
        deliveredAt: new Date(Date.now() - 1700000).toISOString()
      }
    ];

    setTimeout(() => {
      setLead(mockLead);
      setNotes(mockLead.notes);
      setWhatsappMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      new: 'badge badge-info',
      contacted: 'badge badge-warning',
      qualified: 'bg-purple-100 text-purple-800',
      converted: 'badge badge-success',
      lost: 'badge badge-danger'
    };

    return (
      <span className={`${statusStyles[status as keyof typeof statusStyles]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getMessageStatusBadge = (status: string) => {
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

  const getSourceIcon = (source: string) => {
    const icons = {
      'Meta Ads': '🎯',
      'Google Ads': '🔍',
      'LinkedIn': '💼',
      'WhatsApp': '💬'
    };
    return icons[source as keyof typeof icons] || '🔗';
  };

  const handleSaveNotes = () => {
    if (lead) {
      setLead({ ...lead, notes });
      setIsEditingNotes(false);
      // Here you would make an API call to save the notes
    }
  };

  const handleStatusChange = (newStatus: Lead['status']) => {
    if (lead) {
      setLead({ ...lead, status: newStatus });
      // Here you would make an API call to update the status
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="dashboard-container">
        <div className="content-section">
          <div className="content-body">
            <div className="text-center py-12">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Lead not found</h3>
              <p className="text-gray-500 mb-6">The lead you're looking for doesn't exist.</p>
              <Link
                to="/client/leads"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-soft"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Leads
              </Link>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to="/client/leads"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Leads
              </Link>
              <div>
                <h1 className="mobile-title text-gray-900">{lead.fullName}</h1>
                <p className="mobile-text text-gray-600 mt-1">Lead Details & Communication History</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(lead.status)}
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value as Lead['status'])}
                className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="content-title">Contact Information</h3>
                </div>
              </div>
              
              <div className="content-body">
                <div className="space-y-4">
                  <div className="list-item">
                    <div className="list-item-content">
                      <div className="stat-card-icon bg-blue-100 text-blue-600">
                        <EnvelopeIcon className="h-5 w-5" />
                      </div>
                      <div className="list-item-details">
                        <p className="list-item-title">Email Address</p>
                        <a href={`mailto:${lead.email}`} className="list-item-subtitle text-indigo-600 hover:text-indigo-800">
                          {lead.email}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="list-item">
                    <div className="list-item-content">
                      <div className="stat-card-icon bg-green-100 text-green-600">
                        <PhoneIcon className="h-5 w-5" />
                      </div>
                      <div className="list-item-details">
                        <p className="list-item-title">Phone Number</p>
                        <a href={`tel:${lead.phone}`} className="list-item-subtitle text-indigo-600 hover:text-indigo-800">
                          {lead.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lead Source */}
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <LinkIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="content-title">Lead Source</h3>
                </div>
              </div>
              
              <div className="content-body">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getSourceIcon(lead.source)}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Platform</p>
                        <p className="text-sm text-gray-600">{lead.source}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lead.utmSource && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">UTM Source:</span>
                        <span className="text-sm text-gray-900">{lead.utmSource}</span>
                      </div>
                    )}
                    {lead.utmMedium && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">UTM Medium:</span>
                        <span className="text-sm text-gray-900">{lead.utmMedium}</span>
                      </div>
                    )}
                    {lead.utmCampaign && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">UTM Campaign:</span>
                        <span className="text-sm text-gray-900">{lead.utmCampaign}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Created:</span>
                      <span className="text-sm text-gray-900">{format(new Date(lead.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TagIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="content-title">Notes</h3>
                  </div>
                  {!isEditingNotes && (
                    <button
                      onClick={() => setIsEditingNotes(true)}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  )}
                </div>
              </div>
              
              <div className="content-body">
                {isEditingNotes ? (
                  <div className="space-y-4">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Add notes about this lead..."
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={handleSaveNotes}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-soft"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Save Notes
                      </button>
                      <button
                        onClick={() => {
                          setNotes(lead.notes);
                          setIsEditingNotes(false);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                      {lead.notes || 'No notes added yet.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* WhatsApp Messages */}
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500 mr-2" />
                  <h3 className="content-title">WhatsApp Messages</h3>
                </div>
              </div>
              
              <div className="content-body">
                {whatsappMessages.length > 0 ? (
                  <div className="space-y-4">
                    {whatsappMessages.map((message) => (
                      <div key={message.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-900">{message.templateName}</h4>
                          {getMessageStatusBadge(message.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{message.content}</p>
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            Sent: {format(new Date(message.sentAt), 'MMM dd, HH:mm')}
                          </div>
                          {message.deliveredAt && (
                            <div className="flex items-center">
                              <CheckIcon className="h-3 w-3 mr-1" />
                              Delivered: {format(new Date(message.deliveredAt), 'MMM dd, HH:mm')}
                            </div>
                          )}
                          {message.readAt && (
                            <div className="flex items-center">
                              <CheckIcon className="h-3 w-3 mr-1 text-green-500" />
                              Read: {format(new Date(message.readAt), 'MMM dd, HH:mm')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h4 className="text-sm font-medium text-gray-900 mb-2">No messages sent</h4>
                    <p className="text-sm text-gray-500">WhatsApp messages will appear here when sent.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Quick Actions</h3>
              </div>
              
              <div className="content-body">
                <div className="space-y-3">
                  <a
                    href={`mailto:${lead.email}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 shadow-soft"
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Send Email
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 shadow-soft"
                  >
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    Call Lead
                  </a>
                  <button
                    onClick={() => handleStatusChange('converted')}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200 shadow-soft"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Mark as Converted
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLeadDetail; 