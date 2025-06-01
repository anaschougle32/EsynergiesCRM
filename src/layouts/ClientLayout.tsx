import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import {
  LayoutDashboard,
  ListFilter,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  CreditCard,
  Home,
  Users,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';

const ClientLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      mobileIcon: <Home size={24} />,
      href: '/client/dashboard',
    },
    {
      name: 'Leads',
      icon: <ListFilter size={20} />,
      mobileIcon: <Users size={24} />,
      href: '/client/leads',
    },
    {
      name: 'WhatsApp',
      icon: <MessageSquare size={20} />,
      mobileIcon: <MessageSquare size={24} />,
      href: '/client/whatsapp',
    },
    {
      name: 'Billing',
      icon: <CreditCard size={20} />,
      mobileIcon: <CreditCard size={24} />,
      href: '/client/billing',
    },
    {
      name: 'Settings',
      icon: <Settings size={20} />,
      mobileIcon: <Settings size={24} />,
      href: '/client/settings',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-gray-900/50 lg:hidden animate-fade-in"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-white shadow-medium transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <MessageSquare size={18} />
            </div>
            <span className="text-lg font-semibold text-gray-900">LeadSync</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="action-btn-secondary lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 ios-bounce-fix">
          <div className="mb-6 mobile-card p-4">
            <p className="text-sm font-medium text-gray-700">Business</p>
            <p className="text-lg font-semibold text-gray-900">{user?.business_name}</p>
          </div>
          
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={`mobile-nav-item justify-start space-x-3 w-full ${
                    isActiveRoute(item.href) ? 'active' : ''
                  }`}
                  onClick={closeSidebar}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-6">
            <button
              onClick={handleLogout}
              className="mobile-nav-item justify-start space-x-3 w-full text-red-600 hover:bg-red-50 active:bg-red-100"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white/95 backdrop-blur-sm px-4 shadow-sm lg:px-6 safe-area-top">
          <button
            onClick={toggleSidebar}
            className="action-btn-secondary lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Mobile Title */}
          <div className="flex-1 text-center lg:hidden">
            <h1 className="text-lg font-semibold text-gray-900">
              {navigationItems.find(item => isActiveRoute(item.href))?.name || 'LeadSync'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button className="action-btn-secondary relative">
              <Bell size={20} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-indigo-600 animate-pulse"></span>
            </button>

            <div className="relative hidden lg:block">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-2 action-btn-secondary"
              >
                <Avatar
                  name={user?.full_name}
                  size="sm"
                  className="ring-2 ring-white"
                />
                <span className="hidden text-sm font-medium text-gray-700 md:block">
                  {user?.full_name}
                </span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 mobile-card animate-slide-down">
                  <div className="mobile-card-body">
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar
                        name={user?.full_name}
                        size="md"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.full_name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="border-t pt-4">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2 text-left text-sm text-red-600 hover:text-red-800"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] safe-area-bottom">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav lg:hidden">
        <div className="bottom-nav-grid">
          {navigationItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                `mobile-nav-item flex-col space-y-1 ${
                  isActive || isActiveRoute(item.href) ? 'active' : ''
                }`
              }
            >
              <span className="flex-shrink-0">{item.mobileIcon}</span>
              <span className="text-xs font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile Profile Modal */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/50 animate-fade-in" onClick={toggleProfile}></div>
          <div className="fixed bottom-0 left-0 right-0 mobile-card rounded-t-3xl animate-slide-up safe-area-bottom">
            <div className="mobile-card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Account</h3>
                <button onClick={toggleProfile} className="action-btn-secondary">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="mobile-card-body">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar
                  name={user?.full_name}
                  size="lg"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-900">{user?.full_name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">{user?.business_name}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <NavLink
                  to="/client/settings"
                  onClick={toggleProfile}
                  className="flex items-center space-x-3 p-3 rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200"
                >
                  <Settings size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-900">Settings</span>
                </NavLink>
                
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 p-3 rounded-2xl text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors duration-200"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientLayout;