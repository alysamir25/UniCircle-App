import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    
    // Validate Solent University email format
    if (!email.endsWith('@solent.ac.uk')) {
      setError('Please use your Solent University email (@solent.ac.uk)');
      return;
    }

    try {
      await login(email, password);
      // Navigate based on role (handled by ProtectedRoute)
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  // For demo purposes only - hidden admin login form
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(adminEmail, adminPassword);
      navigate('/admin');
    } catch (err) {
      alert('Admin login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* University Logo/Header */}
      <div className="text-center mb-8">
        <div className="text-2xl font-bold text-gray-900 mb-2">
          Southampton Solent University
        </div>
        <div className="text-lg text-gray-700 mb-6">
          Computing Society Portal
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-gray-600 mt-2">
            Use your Solent University credentials
          </p>
        </div>

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              University Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="someone@solent.ac.uk"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="text-right">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Can't access your account?
            </a>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              disabled={isLoading}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {/* Demo Info (only in development) */}
        {import.meta.env.VITE_USE_MOCK_AUTH === 'true' && (
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-gray-700 text-sm font-medium mb-2">
              🔧 Development Mode
            </p>
            <p className="text-gray-600 text-xs mb-3">
              Using mock authentication. For testing:
            </p>
            <div className="space-y-2 text-xs">
              <p><span className="font-medium">Regular Member:</span> any @solent.ac.uk email</p>
              <p><span className="font-medium">Committee Member:</span> add "committee" to email</p>
              <p><span className="font-medium">Admin:</span> admin@solent.ac.uk</p>
            </div>
          </div>
        )}

        {/* Hidden Admin Login Trigger (for development only) */}
        {import.meta.env.DEV && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {showAdminLogin ? 'Hide Admin Login' : 'Admin Access'}
            </button>
            
            {showAdminLogin && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@solent.ac.uk"
                    className="w-full p-2 border border-red-300 rounded text-sm"
                  />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Admin password"
                    className="w-full p-2 border border-red-300 rounded text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
                  >
                    Login as Admin
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <div className="text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Southampton Solent University</p>
          <p className="mt-1">Computing Society • UniCircle Platform</p>
          <p className="mt-2 text-xs">
            {import.meta.env.VITE_USE_MOCK_AUTH === 'true' 
              ? 'Development Environment' 
              : 'Production Environment'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;