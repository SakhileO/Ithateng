import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/register`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      const userData = response.data.user;
      login(userData);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="signup-page" className="min-h-screen pt-20 bg-[#FDFCF8] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-[#E7E5E4]/40 p-8 md:p-12 rounded-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-[#1C1917] mb-2">
            Create <span className="italic text-[#E91E63]">Account</span>
          </h1>
          <p className="text-[#78716C]">Join Ithateng By Ale</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-2">Full Name</label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                data-testid="signup-name-input"
                placeholder="Your full name"
                className="w-full bg-transparent border border-[#E7E5E4] pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                data-testid="signup-email-input"
                placeholder="your@email.com"
                className="w-full bg-transparent border border-[#E7E5E4] pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-2">Phone Number</label>
            <div className="relative">
              <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                data-testid="signup-phone-input"
                placeholder="065 123 4567"
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
                data-testid="signup-password-input"
                placeholder="Min 6 characters"
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

          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-2">Confirm Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                data-testid="signup-confirm-password-input"
                placeholder="Confirm your password"
                className="w-full bg-transparent border border-[#E7E5E4] pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="signup-submit-button"
            className="w-full bg-[#1C1917] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[#78716C]">
          Already have an account?{' '}
          <Link to="/login" data-testid="login-link" className="text-[#E91E63] hover:text-[#1C1917] font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignupPage;
