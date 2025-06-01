import React, { useState } from 'react';
import { 
  Settings,
  Key,
  User,
  Building,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Upload,
  Globe,
  Mail,
  Phone,
  MapPin,
  Lock,
  Smartphone
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'api' | 'notifications' | 'security'>('profile');
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  
  const [profileData, setProfileData] = useState({
    fullName: 'John Smith',
    email: 'admin@marketingagency.com',
    phone: '+1234567890',
    timezone: 'America/New_York'
  });

  const [businessData, setBusinessData] = useState({
    businessName: 'Digital Marketing Pro',
    businessLogo: '',
    address: '123 Business St, City, State 12345',
    website: 'https://digitalmarketingpro.com',
    description: 'Leading digital marketing agency specializing in lead generation'
  });

  const [apiKeys, setApiKeys] = useState({
    razorpayKeyId: 'rzp_test_1234567890',
    razorpayKeySecret: '••••••••••••••••',
    facebookAppId: '1234567890123456',
    facebookAppSecret: '••••••••••••••••',
    googleClientId: '1234567890-abcdefghijklmnop.apps.googleusercontent.com',
    googleClientSecret: '••••••••••••••••',
    linkedinClientId: '1234567890',
    linkedinClientSecret: '••••••••••••••••'
  });

  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailSyncFailed: true,
    emailPaymentDue: true,
    emailLoginAttempts: false,
    whatsappNewLead: false,
    whatsappSyncFailed: true,
    whatsappPaymentDue: true
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: false,
    sessionTimeout: '30'
  });

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleProfileSave = () => {
    console.log('Profile saved:', profileData);
    // Show success message
  };

  const handleBusinessSave = () => {
    console.log('Business saved:', businessData);
    // Show success message
  };

  const handleApiSave = () => {
    console.log('API keys saved');
    // Show success message
  };

  const handleNotificationsSave = () => {
    console.log('Notifications saved:', notifications);
    // Show success message
  };

  const handleSecuritySave = () => {
    console.log('Security settings saved:', securityData);
    // Show success message
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="h-5 w-5" /> },
    { id: 'business', name: 'Business', icon: <Building className="h-5 w-5" /> },
    { id: 'api', name: 'API Keys', icon: <Key className="h-5 w-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { id: 'security', name: 'Security', icon: <Shield className="h-5 w-5" /> }
  ];

  return (
    <div className="dashboard-container">
      <div className="section-spacing">
        {/* Header Section */}
        <div className="section-gap">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mobile-title text-gray-900">Settings</h1>
              <p className="mobile-text text-gray-600 mt-2">Manage your account and application settings</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-header">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Profile Information</h3>
                <p className="content-description">Update your personal information and preferences</p>
              </div>
              
              <div className="content-body">
                <div className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-indigo-600" />
                    </div>
                    <div>
                      <button className="btn-mobile-secondary">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </button>
                      <p className="text-sm text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="h-4 w-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                        className="form-input"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="form-input"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="form-input"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Timezone
                      </label>
                      <select
                        value={profileData.timezone}
                        onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                        className="form-select"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleProfileSave}
                      className="btn-mobile-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Business Tab */}
        {activeTab === 'business' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Business Information</h3>
                <p className="content-description">Manage your business details and branding</p>
              </div>
              
              <div className="content-body">
                <div className="space-y-6">
                  {/* Business Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">Business Logo</label>
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <button className="btn-mobile-secondary">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </button>
                        <p className="text-sm text-gray-500 mt-2">PNG or SVG. 2MB max.</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Building className="h-4 w-4 inline mr-2" />
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={businessData.businessName}
                        onChange={(e) => setBusinessData({...businessData, businessName: e.target.value})}
                        className="form-input"
                        placeholder="Enter business name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Business Address
                      </label>
                      <input
                        type="text"
                        value={businessData.address}
                        onChange={(e) => setBusinessData({...businessData, address: e.target.value})}
                        className="form-input"
                        placeholder="Enter business address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Globe className="h-4 w-4 inline mr-2" />
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={businessData.website}
                        onChange={(e) => setBusinessData({...businessData, website: e.target.value})}
                        className="form-input"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Description
                      </label>
                      <textarea
                        value={businessData.description}
                        onChange={(e) => setBusinessData({...businessData, description: e.target.value})}
                        rows={4}
                        className="form-input"
                        placeholder="Describe your business..."
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleBusinessSave}
                      className="btn-mobile-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'api' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">API Keys & Integrations</h3>
                <p className="content-description">Manage your third-party service integrations</p>
              </div>
              
              <div className="content-body">
                <div className="space-y-8">
                  {/* Razorpay */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">💳 Razorpay Payment Gateway</h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
                          <input
                            type="text"
                            value={apiKeys.razorpayKeyId}
                            onChange={(e) => setApiKeys({...apiKeys, razorpayKeyId: e.target.value})}
                            className="form-input"
                            placeholder="rzp_test_..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
                          <div className="relative">
                            <input
                              type={showPasswords.razorpaySecret ? "text" : "password"}
                              value={apiKeys.razorpayKeySecret}
                              onChange={(e) => setApiKeys({...apiKeys, razorpayKeySecret: e.target.value})}
                              className="form-input pr-10"
                              placeholder="Enter secret key"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('razorpaySecret')}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPasswords.razorpaySecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Facebook */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">📘 Facebook/Instagram</h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">App ID</label>
                          <input
                            type="text"
                            value={apiKeys.facebookAppId}
                            onChange={(e) => setApiKeys({...apiKeys, facebookAppId: e.target.value})}
                            className="form-input"
                            placeholder="Enter App ID"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">App Secret</label>
                          <div className="relative">
                            <input
                              type={showPasswords.facebookSecret ? "text" : "password"}
                              value={apiKeys.facebookAppSecret}
                              onChange={(e) => setApiKeys({...apiKeys, facebookAppSecret: e.target.value})}
                              className="form-input pr-10"
                              placeholder="Enter App Secret"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('facebookSecret')}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPasswords.facebookSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Google */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">🔍 Google Ads</h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                          <input
                            type="text"
                            value={apiKeys.googleClientId}
                            onChange={(e) => setApiKeys({...apiKeys, googleClientId: e.target.value})}
                            className="form-input"
                            placeholder="Enter Client ID"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                          <div className="relative">
                            <input
                              type={showPasswords.googleSecret ? "text" : "password"}
                              value={apiKeys.googleClientSecret}
                              onChange={(e) => setApiKeys({...apiKeys, googleClientSecret: e.target.value})}
                              className="form-input pr-10"
                              placeholder="Enter Client Secret"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('googleSecret')}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPasswords.googleSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* LinkedIn */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">💼 LinkedIn</h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                          <input
                            type="text"
                            value={apiKeys.linkedinClientId}
                            onChange={(e) => setApiKeys({...apiKeys, linkedinClientId: e.target.value})}
                            className="form-input"
                            placeholder="Enter Client ID"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Client Secret</label>
                          <div className="relative">
                            <input
                              type={showPasswords.linkedinSecret ? "text" : "password"}
                              value={apiKeys.linkedinClientSecret}
                              onChange={(e) => setApiKeys({...apiKeys, linkedinClientSecret: e.target.value})}
                              className="form-input pr-10"
                              placeholder="Enter Client Secret"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('linkedinSecret')}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPasswords.linkedinSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleApiSave}
                      className="btn-mobile-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save API Keys
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Notification Preferences</h3>
                <p className="content-description">Choose how you want to be notified about important events</p>
              </div>
              
              <div className="content-body">
                <div className="space-y-8">
                  {/* Email Notifications */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">
                        <Mail className="h-5 w-5 mr-2" />
                        Email Notifications
                      </h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="space-y-4">
                        {[
                          { key: 'emailNewLead', label: 'New Lead Received', description: 'Get notified when a new lead is captured' },
                          { key: 'emailSyncFailed', label: 'Sync Failed', description: 'Alert when platform sync encounters errors' },
                          { key: 'emailPaymentDue', label: 'Payment Due', description: 'Reminder for upcoming client payments' },
                          { key: 'emailLoginAttempts', label: 'Login Attempts', description: 'Security alerts for login activities' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications[item.key as keyof typeof notifications]}
                                onChange={(e) => setNotifications({
                                  ...notifications,
                                  [item.key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Notifications */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">
                        <Smartphone className="h-5 w-5 mr-2" />
                        WhatsApp Notifications
                      </h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="space-y-4">
                        {[
                          { key: 'whatsappNewLead', label: 'New Lead Received', description: 'WhatsApp alert for new leads' },
                          { key: 'whatsappSyncFailed', label: 'Sync Failed', description: 'WhatsApp alert for sync errors' },
                          { key: 'whatsappPaymentDue', label: 'Payment Due', description: 'WhatsApp reminder for payments' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.label}</p>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications[item.key as keyof typeof notifications]}
                                onChange={(e) => setNotifications({
                                  ...notifications,
                                  [item.key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleNotificationsSave}
                      className="btn-mobile-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="section-gap">
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">Security Settings</h3>
                <p className="content-description">Manage your account security and access controls</p>
              </div>
              
              <div className="content-body">
                <div className="space-y-8">
                  {/* Password Change */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">
                        <Lock className="h-5 w-5 mr-2" />
                        Change Password
                      </h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.currentPassword ? "text" : "password"}
                              value={securityData.currentPassword}
                              onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                              className="form-input pr-10"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('currentPassword')}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPasswords.currentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.newPassword ? "text" : "password"}
                              value={securityData.newPassword}
                              onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                              className="form-input pr-10"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('newPassword')}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPasswords.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirmPassword ? "text" : "password"}
                              value={securityData.confirmPassword}
                              onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                              className="form-input pr-10"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility('confirmPassword')}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPasswords.confirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">
                        <Shield className="h-5 w-5 mr-2" />
                        Two-Factor Authentication
                      </h4>
                    </div>
                    <div className="mobile-card-body">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                          <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={securityData.twoFactorEnabled}
                            onChange={(e) => setSecurityData({...securityData, twoFactorEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Session Settings */}
                  <div className="mobile-card">
                    <div className="mobile-card-header">
                      <h4 className="mobile-card-title">Session Settings</h4>
                    </div>
                    <div className="mobile-card-body">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                        <select
                          value={securityData.sessionTimeout}
                          onChange={(e) => setSecurityData({...securityData, sessionTimeout: e.target.value})}
                          className="form-select"
                        >
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="60">1 hour</option>
                          <option value="120">2 hours</option>
                          <option value="480">8 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={handleSecuritySave}
                      className="btn-mobile-primary"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Update Security
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings; 