import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, formData);
      const userData = response.data.user;
      
      login(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      
      // Redirect admin to admin page, others to where they came from
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="login-page" className="min-h-screen pt-20 bg-[#FDFCF8] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-[#E7E5E4]/40 p-8 md:p-12 rounded-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-[#1C1917] mb-2">
            Welcome <span className="italic text-[#E91E63]">Back</span>
          </h1>
          <p className="text-[#78716C]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                data-testid="login-email-input"
                placeholder="your@email.com"
                className="w-full bg-transparent border border-[#E7E5E4] pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                data-testid="login-password-input"
                placeholder="Enter your password"
                className="w-full bg-transparent border border-[#E7E5E4] pl-12 pr-12 py-4 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#78716C] hover:text-[#1C1917]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              data-testid="forgot-password-link"
              className="text-sm text-[#E91E63] hover:text-[#1C1917] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="login-submit-button"
            className="w-full bg-[#1C1917] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[#78716C]">
          Don't have an account?{' '}
          <Link to="/signup" data-testid="signup-link" className="text-[#E91E63] hover:text-[#1C1917] font-medium">
            Sign up
          </Link>
        </p>

        <div className="mt-6 pt-6 border-t border-[#E7E5E4] text-center">
          <p className="text-xs text-[#78716C]">
            Admin? Use admin@ithatengbyale.com
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
