import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { initMobile } from './utils/mobile';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import AdminLayout from './layouts/AdminLayout';
import ClientLayout from './layouts/ClientLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminClients from './pages/admin/Clients';
import AdminClientDetail from './pages/admin/ClientDetail';
import AdminLeads from './pages/admin/Leads';
import AdminIntegrations from './pages/admin/Integrations';
import AdminWhatsApp from './pages/admin/WhatsApp';
import AdminBilling from './pages/admin/Billing';
import AdminSettings from './pages/admin/Settings';
import ClientDashboard from './pages/client/Dashboard';
import ClientLeads from './pages/client/Leads';
import ClientLeadDetail from './pages/client/LeadDetail';
import ClientWhatsApp from './pages/client/WhatsApp';
import ClientSettings from './pages/client/Settings';
import ClientBilling from './pages/client/Billing';

const App = () => {
  const { user, checkAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
    // Initialize mobile utilities for app-like experience
    initMobile();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard\" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="clients/:id" element={<AdminClientDetail />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="integrations" element={<AdminIntegrations />} />
        <Route path="whatsapp" element={<AdminWhatsApp />} />
        <Route path="billing" element={<AdminBilling />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Client Routes */}
      <Route 
        path="/client" 
        element={
          <ProtectedRoute role="client">
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/client/dashboard\" replace />} />
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="leads" element={<ClientLeads />} />
        <Route path="leads/:id" element={<ClientLeadDetail />} />
        <Route path="whatsapp" element={<ClientWhatsApp />} />
        <Route path="settings" element={<ClientSettings />} />
        <Route path="billing" element={<ClientBilling />} />
      </Route>

      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/client/dashboard') : '/login'} replace />} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
};

interface ProtectedRouteProps {
  role: 'admin' | 'client';
  children: React.ReactNode;
}

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== role) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/client/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default App;