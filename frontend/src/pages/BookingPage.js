import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(location.state?.selectedService || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone: '',
  });
  const [bookingId, setBookingId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  useEffect(() => {
    fetchServices();
    if (sessionId) {
      pollPaymentStatus(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API}/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    }
  };

  const fetchAvailability = async () => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toISOString().split('T')[0];
    try {
      const response = await axios.get(`${API}/bookings/availability?date=${dateStr}`);
      setAvailableSlots(response.data.available_slots);
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout');
      toast.error('Payment verification timeout. Please contact support.');
      return;
    }

    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`);
      if (response.data.payment_status === 'paid') {
        setPaymentStatus('success');
        toast.success('Payment successful! Your booking is confirmed.');
        return;
      }

      setPollingAttempts(attempts + 1);
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), 2000);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select service, date, and time');
      return;
    }

    setLoading(true);
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const bookingResponse = await axios.post(`${API}/bookings`, {
        ...formData,
        service_id: selectedService.service_id,
        date: dateStr,
        time: selectedTime,
      });

      const newBookingId = bookingResponse.data.booking_id;
      setBookingId(newBookingId);

      const origin = window.location.origin;
      const checkoutResponse = await axios.post(`${API}/payments/checkout`, {
        booking_id: newBookingId,
        origin_url: origin,
      });

      window.location.href = checkoutResponse.data.url;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (sessionId && paymentStatus === 'success') {
    return (
      <div data-testid="booking-confirmation" className="min-h-screen pt-20 flex items-center justify-center bg-[#FDFCF8]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full mx-6 bg-white border border-[#E7E5E4]/40 p-12 rounded-xl text-center"
        >
          <CheckCircle2 size={64} className="text-[#E91E63] mx-auto mb-6" />
          <h2 className="font-serif text-4xl tracking-tight text-[#1C1917] mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-lg text-[#78716C] mb-8">
            Your deposit has been received. We'll see you soon!
          </p>
          <button
            onClick={() => navigate('/')}
            data-testid="return-home-button"
            className="bg-[#1C1917] text-[#FDFCF8] rounded-full px-8 py-4 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  if (sessionId && pollingAttempts > 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#FDFCF8]">
        <div className="text-center">
          <Loader2 className="animate-spin text-[#E91E63] mx-auto mb-4" size={48} />
          <p className="text-[#78716C]">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="booking-page" className="min-h-screen pt-20 bg-[#FDFCF8]">
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1C1917] mb-4">
              Book Your{' '}
              <span className="italic text-[#E91E63]">Appointment</span>
            </h1>
            <p className="text-lg text-[#78716C]">
              R100 deposit required to confirm booking
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="bg-white border border-[#E7E5E4]/40 p-8 md:p-12 rounded-xl space-y-8"
          >
            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-3">
                Select Service *
              </label>
              <select
                required
                value={selectedService?.service_id || ''}
                onChange={(e) => {
                  const service = services.find(s => s.service_id === e.target.value);
                  setSelectedService(service);
                }}
                data-testid="service-select"
                className="w-full bg-transparent border-b border-[#E7E5E4] px-0 py-4 rounded-none focus:outline-none focus:border-[#1C1917] text-[#1C1917]"
              >
                <option value="">Choose a service</option>
                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {`${service.name} - R${service.price.toFixed(0)} (${service.duration}min)`}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-3">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="user_name"
                  required
                  value={formData.user_name}
                  onChange={handleInputChange}
                  data-testid="booking-name-input"
                  className="w-full bg-transparent border-b border-[#E7E5E4] px-0 py-4 rounded-none focus:outline-none focus:border-[#1C1917] placeholder:text-[#78716C]/50"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-3">
                  Email *
                </label>
                <input
                  type="email"
                  name="user_email"
                  required
                  value={formData.user_email}
                  onChange={handleInputChange}
                  data-testid="booking-email-input"
                  className="w-full bg-transparent border-b border-[#E7E5E4] px-0 py-4 rounded-none focus:outline-none focus:border-[#1C1917] placeholder:text-[#78716C]/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-3">
                Phone Number *
              </label>
              <input
                type="tel"
                name="user_phone"
                required
                value={formData.user_phone}
                onChange={handleInputChange}
                data-testid="booking-phone-input"
                className="w-full bg-transparent border-b border-[#E7E5E4] px-0 py-4 rounded-none focus:outline-none focus:border-[#1C1917] placeholder:text-[#78716C]/50"
                placeholder="065 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1C1917] mb-3">
                Select Date *
              </label>
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={{ before: new Date() }}
                  className="booking-calendar"
                />
              </div>
            </div>

            {selectedDate && availableSlots.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#1C1917] mb-3">
                  Select Time *
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      data-testid={`time-slot-${slot}`}
                      className={`py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === slot
                          ? 'bg-[#1C1917] text-[#FDFCF8]'
                          : 'bg-[#F2F0E9] text-[#1C1917] hover:bg-[#E6D2C9]'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDate && availableSlots.length === 0 && (
              <p className="text-center text-[#78716C]">No available slots for this date</p>
            )}

            <div className="bg-[#F2F0E9] p-6 rounded-lg">
              <h3 className="font-serif text-lg mb-3 text-[#1C1917]">Booking Policy</h3>
              <ul className="text-sm text-[#78716C] space-y-2">
                <li>• R100 deposit required to confirm booking</li>
                <li>• Late arrivals (15+ minutes) will result in cancellation</li>
                <li>• Rebooking allowed within 7 days</li>
                <li>• Cancellation fees: R50-R100</li>
              </ul>
            </div>

            <a
              href={`https://wa.me/27659839403?text=${encodeURIComponent(
                `Hi! I'd like to book an appointment:\n\nService: ${selectedService?.name || 'Not selected'}\nDate: ${selectedDate ? selectedDate.toLocaleDateString() : 'Not selected'}\nTime: ${selectedTime || 'Not selected'}\n\nName: ${formData.user_name || ''}\nPhone: ${formData.user_phone || ''}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="whatsapp-booking-button"
              className="w-full bg-[#25D366] text-white rounded-full px-8 py-6 text-sm font-medium tracking-widest uppercase transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Book via WhatsApp
            </a>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default BookingPage;