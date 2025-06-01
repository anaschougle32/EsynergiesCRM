import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleDemoCredentials = () => {
    setShowDemoCredentials(!showDemoCredentials);
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        toast.success('Login successful');
        
        // Redirect based on role, handled by the router in App.tsx
        navigate('/');
      } catch (error) {
        toast.error('Invalid email or password');
      }
    },
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <div className="flex items-center space-x-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-primary-600">
              <Moon size={24} />
            </div>
            <span className="text-2xl font-bold">LeadSync</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to LeadSync CRM</h1>
          <p className="text-lg mb-8 opacity-90 max-w-md text-center">
            The complete platform for marketing agencies to manage clients and leads from multiple platforms.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Streamlined Lead Management</h3>
              <p className="text-sm opacity-90">Collect and organize leads from multiple platforms in one dashboard.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Client Portal</h3>
              <p className="text-sm opacity-90">Give your clients access to their leads with a dedicated portal.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">WhatsApp Integration</h3>
              <p className="text-sm opacity-90">Automate follow-ups and send messages directly from the platform.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Multi-platform Support</h3>
              <p className="text-sm opacity-90">Connect Facebook, Instagram, Google, LinkedIn, and more.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-600 text-white">
                <Moon size={24} />
              </div>
              <span className="text-2xl font-bold text-gray-900">LeadSync</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Sign in to your account</h2>
            <p className="text-gray-600">
              Manage your marketing agency leads and clients
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email address"
              placeholder="your@email.com"
              leftIcon={<Mail size={18} />}
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : undefined
              }
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : undefined
              }
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Sign in
            </Button>
          </form>

          <div className="mt-8">
            <button
              type="button"
              onClick={handleDemoCredentials}
              className="text-sm text-center w-full text-gray-500 hover:text-gray-700"
            >
              {showDemoCredentials ? "Hide demo credentials" : "Show demo credentials"}
            </button>
            
            {showDemoCredentials && (
              <div className="mt-3 space-y-3 rounded-md bg-gray-50 p-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Admin login:</p>
                  <p className="text-gray-600">Email: admin@example.com</p>
                  <p className="text-gray-600">Password: password</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Client login:</p>
                  <p className="text-gray-600">Email: client@example.com</p>
                  <p className="text-gray-600">Password: password</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;