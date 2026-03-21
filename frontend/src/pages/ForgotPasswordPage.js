import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSubmitted(true);
      toast.success('Check your email for reset instructions');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div data-testid="forgot-password-success" className="min-h-screen pt-20 bg-[#FDFCF8] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-[#E7E5E4]/40 p-8 md:p-12 rounded-xl w-full max-w-md text-center"
        >
          <CheckCircle2 size={64} className="text-[#E91E63] mx-auto mb-6" />
          <h2 className="font-serif text-3xl tracking-tight text-[#1C1917] mb-4">
            Check Your Email
          </h2>
          <p className="text-[#78716C] mb-8">
            If an account exists with {email}, you will receive password reset instructions.
          </p>
          <Link
            to="/login"
            className="inline-block bg-[#1C1917] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105"
          >
            Back to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div data-testid="forgot-password-page" className="min-h-screen pt-20 bg-[#FDFCF8] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white border border-[#E7E5E4]/40 p-8 md:p-12 rounded-xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-[#1C1917] mb-2">
            Forgot <span className="italic text-[#E91E63]">Password</span>
          </h1>
          <p className="text-[#78716C]">Enter your email to reset your password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#1C1917] mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716C]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="forgot-email-input"
                placeholder="your@email.com"
                className="w-full bg-transparent border border-[#E7E5E4] pl-12 pr-4 py-4 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            data-testid="forgot-submit-button"
            className="w-full bg-[#1C1917] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-[#78716C]">
          Remember your password?{' '}
          <Link to="/login" className="text-[#E91E63] hover:text-[#1C1917] font-medium">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
