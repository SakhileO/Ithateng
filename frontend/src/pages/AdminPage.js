import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Package, 
  MessageSquare, 
  Calendar, 
  Users, 
  Trash2, 
  Plus,
  X,
  LogOut,
  Edit
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Accessories'
  });

  useEffect(() => {
    const saved = sessionStorage.getItem('adminAuth');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'products') {
        const res = await axios.get(`${API}/admin/products`);
        setProducts(res.data);
      } else if (activeTab === 'contacts') {
        const res = await axios.get(`${API}/admin/contacts`);
        setContacts(res.data);
      } else if (activeTab === 'bookings') {
        const res = await axios.get(`${API}/admin/bookings`);
        setBookings(res.data);
      } else if (activeTab === 'subscribers') {
        const res = await axios.get(`${API}/admin/newsletter`);
        setSubscribers(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/admin/login?password=${password}`);
      if (res.data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('adminAuth', 'true');
        toast.success('Welcome to Admin Dashboard');
      }
    } catch (error) {
      toast.error('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
    toast.success('Logged out successfully');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/admin/products`, {
        ...newProduct,
        price: parseFloat(newProduct.price)
      });
      toast.success('Product added successfully');
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', price: '', image_url: '', category: 'Accessories' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API}/admin/products/${productId}`);
        toast.success('Product deleted');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await axios.delete(`${API}/admin/contacts/${contactId}`);
      toast.success('Message deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (!isAuthenticated) {
    return (
      <div data-testid="admin-login" className="min-h-screen pt-20 bg-[#FDFCF8] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E7E5E4]/40 p-8 rounded-xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#E91E63]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock size={32} className="text-[#E91E63]" />
            </div>
            <h1 className="font-serif text-3xl tracking-tight text-[#1C1917]">Admin Login</h1>
            <p className="text-[#78716C] mt-2">Enter password to access dashboard</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              data-testid="admin-password-input"
              className="w-full bg-transparent border border-[#E7E5E4] px-4 py-4 rounded-lg focus:outline-none focus:border-[#E91E63] mb-4"
            />
            <button
              type="submit"
              data-testid="admin-login-button"
              className="w-full bg-[#1C1917] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen pt-20 bg-[#F2F0E9]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-4xl tracking-tight text-[#1C1917]">
            Admin <span className="italic text-[#E91E63]">Dashboard</span>
          </h1>
          <button
            onClick={handleLogout}
            data-testid="admin-logout-button"
            className="flex items-center gap-2 text-[#78716C] hover:text-[#E91E63] transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: 'products', label: 'Products', icon: Package },
            { id: 'contacts', label: 'Messages', icon: MessageSquare },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
            { id: 'subscribers', label: 'Subscribers', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`admin-tab-${tab.id}`}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1C1917] text-white'
                  : 'bg-white text-[#1C1917] hover:bg-[#E91E63]/10'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white border border-[#E7E5E4]/40 rounded-xl p-6">
          {loading ? (
            <div className="text-center py-12 text-[#78716C]">Loading...</div>
          ) : (
            <>
              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-2xl text-[#1C1917]">Products ({products.length})</h2>
                    <button
                      onClick={() => setShowAddProduct(true)}
                      data-testid="add-product-button"
                      className="flex items-center gap-2 bg-[#E91E63] text-white rounded-full px-6 py-3 text-sm font-medium transition-transform hover:scale-105"
                    >
                      <Plus size={18} />
                      Add Product
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <p className="text-[#78716C] text-center py-8">No products in database. Products are managed in code.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <div key={product.id} className="border border-[#E7E5E4] rounded-lg p-4">
                          <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
                          <h3 className="font-medium text-[#1C1917]">{product.name}</h3>
                          <p className="text-sm text-[#78716C]">{product.category}</p>
                          <p className="text-[#E91E63] font-medium mt-1">R{product.price}</p>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="mt-3 text-red-500 text-sm flex items-center gap-1 hover:text-red-700"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <div>
                  <h2 className="font-serif text-2xl text-[#1C1917] mb-6">Contact Messages ({contacts.length})</h2>
                  {contacts.length === 0 ? (
                    <p className="text-[#78716C] text-center py-8">No messages yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="border border-[#E7E5E4] rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-[#1C1917]">{contact.name}</h3>
                              <p className="text-sm text-[#78716C]">{contact.email}</p>
                              {contact.phone && <p className="text-sm text-[#78716C]">{contact.phone}</p>}
                            </div>
                            <button
                              onClick={() => handleDeleteContact(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="mt-3 text-[#1C1917] bg-[#F2F0E9] p-3 rounded-lg">{contact.message}</p>
                          <p className="text-xs text-[#78716C] mt-2">{new Date(contact.created_at).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div>
                  <h2 className="font-serif text-2xl text-[#1C1917] mb-6">Bookings ({bookings.length})</h2>
                  {bookings.length === 0 ? (
                    <p className="text-[#78716C] text-center py-8">No bookings yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-[#E7E5E4]">
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#78716C]">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#78716C]">Contact</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#78716C]">Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#78716C]">Time</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-[#78716C]">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.booking_id} className="border-b border-[#E7E5E4]/50">
                              <td className="py-3 px-4 text-[#1C1917]">{booking.user_name}</td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-[#1C1917]">{booking.user_email}</p>
                                <p className="text-xs text-[#78716C]">{booking.user_phone}</p>
                              </td>
                              <td className="py-3 px-4 text-[#1C1917]">{booking.date}</td>
                              <td className="py-3 px-4 text-[#1C1917]">{booking.time}</td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {booking.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Subscribers Tab */}
              {activeTab === 'subscribers' && (
                <div>
                  <h2 className="font-serif text-2xl text-[#1C1917] mb-6">Newsletter Subscribers ({subscribers.length})</h2>
                  {subscribers.length === 0 ? (
                    <p className="text-[#78716C] text-center py-8">No subscribers yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {subscribers.map((sub, index) => (
                        <div key={index} className="flex items-center justify-between border border-[#E7E5E4] rounded-lg p-3">
                          <span className="text-[#1C1917]">{sub.email}</span>
                          <span className="text-xs text-[#78716C]">{new Date(sub.subscribed_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl text-[#1C1917]">Add Product</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-[#78716C] hover:text-[#1C1917]">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
                className="w-full border border-[#E7E5E4] px-4 py-3 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                required
                rows={3}
                className="w-full border border-[#E7E5E4] px-4 py-3 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
              <input
                type="number"
                placeholder="Price (R)"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                required
                className="w-full border border-[#E7E5E4] px-4 py-3 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({...newProduct, image_url: e.target.value})}
                required
                className="w-full border border-[#E7E5E4] px-4 py-3 rounded-lg focus:outline-none focus:border-[#E91E63]"
              />
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="w-full border border-[#E7E5E4] px-4 py-3 rounded-lg focus:outline-none focus:border-[#E91E63]"
              >
                <option value="Accessories">Accessories</option>
                <option value="Wig Essentials">Wig Essentials</option>
                <option value="Hair Styling">Hair Styling</option>
                <option value="Home Decor">Home Decor</option>
              </select>
              <button
                type="submit"
                className="w-full bg-[#E91E63] text-white rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105"
              >
                Add Product
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
