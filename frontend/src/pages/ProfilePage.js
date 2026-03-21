import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Edit, Save, LogOut, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
    fetchBookings();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${API}/auth/profile/${user.user_id}`);
      setProfile(response.data);
      setEditData({ name: response.data.name, phone: response.data.phone });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (user.user_id === 'admin') return;
    try {
      const response = await axios.get(`${API}/auth/user-bookings/${user.user_id}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await axios.put(`${API}/auth/profile/${user.user_id}`, editData);
      setProfile({ ...profile, ...editData });
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-[#FDFCF8] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E91E63]" size={32} />
      </div>
    );
  }

  return (
    <div data-testid="profile-page" className="min-h-screen pt-20 bg-[#F2F0E9]">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Header */}
          <div className="bg-white border border-[#E7E5E4]/40 rounded-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-serif text-4xl tracking-tight text-[#1C1917]">
                My <span className="italic text-[#E91E63]">Profile</span>
              </h1>
              <div className="flex items-center gap-3">
                {isAdmin() && (
                  <button
                    onClick={() => navigate('/admin')}
                    data-testid="admin-dashboard-link"
                    className="text-[#E91E63] hover:text-[#1C1917] text-sm font-medium"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  data-testid="logout-button"
                  className="flex items-center gap-2 text-[#78716C] hover:text-[#E91E63] transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-[#E91E63]/10 rounded-full flex items-center justify-center">
                <User size={36} className="text-[#E91E63]" />
              </div>
              
              <div className="flex-1">
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#78716C] mb-1">Name</label>
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                        className="w-full border border-[#E7E5E4] px-4 py-2 rounded-lg focus:outline-none focus:border-[#E91E63]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#78716C] mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full border border-[#E7E5E4] px-4 py-2 rounded-lg focus:outline-none focus:border-[#E91E63]"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 bg-[#E91E63] text-white rounded-full px-6 py-2 text-sm font-medium"
                      >
                        <Save size={16} /> Save
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="text-[#78716C] hover:text-[#1C1917]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-serif text-2xl text-[#1C1917]">{profile?.name}</h2>
                      {profile?.role === 'admin' && (
                        <span className="bg-[#E91E63] text-white text-xs px-3 py-1 rounded-full">Admin</span>
                      )}
                    </div>
                    <div className="space-y-2 text-[#78716C]">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{profile?.email}</span>
                      </div>
                      {profile?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          <span>{profile?.phone}</span>
                        </div>
                      )}
                    </div>
                    {!isAdmin() && (
                      <button
                        onClick={() => setEditing(true)}
                        data-testid="edit-profile-button"
                        className="mt-4 flex items-center gap-2 text-[#E91E63] hover:text-[#1C1917] text-sm font-medium"
                      >
                        <Edit size={16} /> Edit Profile
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bookings */}
          {!isAdmin() && (
            <div className="bg-white border border-[#E7E5E4]/40 rounded-xl p-8">
              <h2 className="font-serif text-2xl text-[#1C1917] mb-6">My Bookings</h2>
              
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar size={48} className="text-[#E7E5E4] mx-auto mb-4" />
                  <p className="text-[#78716C] mb-4">No bookings yet</p>
                  <button
                    onClick={() => navigate('/booking')}
                    className="bg-[#E91E63] text-white rounded-full px-6 py-3 text-sm font-medium"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.booking_id}
                      className="border border-[#E7E5E4] rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-[#1C1917]">{booking.date} at {booking.time}</p>
                        <p className="text-sm text-[#78716C]">Service ID: {booking.service_id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
