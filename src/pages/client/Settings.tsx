import React, { useState } from 'react';
import { 
  UserIcon,
  KeyIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const ClientSettings = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'notifications' | 'support'>('profile');
  
  const [profileData, setProfileData] = useState({
    fullName: 'Maria Garcia',
    email: 'client1@restaurant.com',
    businessName: 'Bella Vista Restaurant',
    businessType: 'Restaurant',
    phone: '+1234567891',
    address: '123 Main St, City, State 12345'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailWeeklyReport: true,
    emailMonthlyReport: false,
    smsNewLead: false
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleProfileSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile saved:', profileData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password changed');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const handleNotificationsSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Notifications saved:', notifications);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'password', name: 'Password', icon: KeyIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'support', name: 'Support', icon: QuestionMarkCircleIcon },
  ];

  return (
    <div className="dashboard-container">
      <div className="section-spacing">
        {/* Header Section */}
        <div className="section-gap">
          <div>
            <h1 className="mobile-title text-gray-900">Account Settings</h1>
            <p className="mobile-text text-gray-600 mt-2">Manage your account preferences and security settings</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="section-gap">
          <div className="content-section">
            <div className="content-body">
              <nav className="flex space-x-1 bg-gray-100 rounded-xl p-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-indigo-600 shadow-soft'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="section-gap">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="content-title">Profile Information</h3>
                  </div>
                  {saveStatus === 'saved' && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Saved successfully
                    </div>
                  )}
                </div>
              </div>
              
              <div className="content-body">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                          className="pl-10 w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <EnvelopeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="pl-10 w-full border border-gray-300 rounded-xl px-3 py-2.5 bg-gray-50 text-gray-500"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Name
                      </label>
                      <div className="relative">
                        <BuildingOfficeIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.businessName}
                          onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                          className="pl-10 w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                      </label>
                      <select
                        value={profileData.businessType}
                        onChange={(e) => setProfileData({...profileData, businessType: e.target.value})}
                        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Beauty Salon">Beauty Salon</option>
                        <option value="Fitness Center">Fitness Center</option>
                        <option value="Retail">Retail</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <PhoneIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          className="pl-10 w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPinIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                      <textarea
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        rows={3}
                        className="pl-10 w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                        placeholder="Enter your business address..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleProfileSave}
                      disabled={saveStatus === 'saving'}
                      className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-soft"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <KeyIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="content-title">Change Password</h3>
                  </div>
                  {saveStatus === 'saved' && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Password updated
                    </div>
                  )}
                </div>
              </div>
              
              <div className="content-body">
                <div className="max-w-md space-y-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800">Password Requirements</h4>
                        <ul className="text-sm text-amber-700 mt-1 space-y-1">
                          <li>• At least 8 characters long</li>
                          <li>• Include uppercase and lowercase letters</li>
                          <li>• Include at least one number</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full border border-gray-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handlePasswordChange}
                      disabled={saveStatus === 'saving' || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-soft"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <KeyIcon className="h-4 w-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BellIcon className="h-5 w-5 text-gray-500 mr-2" />
                    <h3 className="content-title">Notification Preferences</h3>
                  </div>
                  {saveStatus === 'saved' && (
                    <div className="flex items-center text-green-600 text-sm">
                      <CheckIcon className="h-4 w-4 mr-1" />
                      Preferences saved
                    </div>
                  )}
                </div>
              </div>
              
              <div className="content-body">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Email Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">New Lead Alerts</p>
                          <p className="text-sm text-gray-500">Get notified immediately when new leads come in</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailNewLead}
                            onChange={(e) => setNotifications({...notifications, emailNewLead: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Weekly Reports</p>
                          <p className="text-sm text-gray-500">Receive weekly summary of your leads and performance</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailWeeklyReport}
                            onChange={(e) => setNotifications({...notifications, emailWeeklyReport: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Monthly Reports</p>
                          <p className="text-sm text-gray-500">Receive detailed monthly analytics and insights</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailMonthlyReport}
                            onChange={(e) => setNotifications({...notifications, emailMonthlyReport: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-4">SMS Notifications</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">New Lead SMS</p>
                          <p className="text-sm text-gray-500">Get SMS alerts for urgent new leads</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.smsNewLead}
                            onChange={(e) => setNotifications({...notifications, smsNewLead: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleNotificationsSave}
                      disabled={saveStatus === 'saving'}
                      className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-soft"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <BellIcon className="h-4 w-4 mr-2" />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === 'support' && (
            <div className="content-section">
              <div className="content-header">
                <div className="flex items-center">
                  <QuestionMarkCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                  <h3 className="content-title">Support & Help</h3>
                </div>
              </div>
              
              <div className="content-body">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <EnvelopeIcon className="h-6 w-6 text-blue-600 mr-3" />
                        <h4 className="text-lg font-medium text-blue-900">Email Support</h4>
                      </div>
                      <p className="text-blue-700 mb-4">Get help via email. We typically respond within 24 hours.</p>
                      <a
                        href="mailto:support@marketingagency.com"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
                      >
                        <EnvelopeIcon className="h-4 w-4 mr-2" />
                        Contact Support
                      </a>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <PhoneIcon className="h-6 w-6 text-green-600 mr-3" />
                        <h4 className="text-lg font-medium text-green-900">Phone Support</h4>
                      </div>
                      <p className="text-green-700 mb-4">Call us for immediate assistance during business hours.</p>
                      <a
                        href="tel:+1234567890"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors duration-200"
                      >
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        Call Support
                      </a>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Account Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Account ID:</span>
                        <span className="ml-2 text-gray-600">CLIENT-001</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Plan:</span>
                        <span className="ml-2 text-gray-600">Professional</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Account Created:</span>
                        <span className="ml-2 text-gray-600">January 15, 2024</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Login:</span>
                        <span className="ml-2 text-gray-600">Today at 2:30 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSettings; 