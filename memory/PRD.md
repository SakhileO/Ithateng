# Ithateng By Ale - Beauty Website PRD

## Original Problem Statement
Build a modern, elegant, fully responsive website for **Ithateng By Ale** - a South African beauty brand offering services for weddings, graduations, matric dances, photoshoots, and special occasions.

## User Personas
1. **Primary**: Women aged 18-45 seeking beauty services for special occasions
2. **Secondary**: Event planners looking for reliable beauty service providers
3. **Tertiary**: Brides-to-be and wedding party members

## Core Requirements (Static)
- Luxury aesthetic with cream/beige + gold color scheme
- Mobile-first responsive design
- Service catalog with full pricing
- Online booking with calendar
- Stripe payment integration (R100 deposit)
- Instagram feed integration
- Contact form and business information

## What's Been Implemented (Jan 2026)

### Pages Completed
- ✅ **Homepage**: Hero section, service categories, testimonials, CTAs
- ✅ **About Page**: Brand story, values, mission statement
- ✅ **Services Page**: 23 services across 5 categories with filtering
- ✅ **Booking Page**: Calendar, time slots, Stripe checkout integration
- ✅ **Gallery Page**: 6 video showcases + photo gallery
- ✅ **Contact Page**: Form, business hours, contact info

### Features Implemented
- ✅ Sticky navigation with smooth transitions
- ✅ WhatsApp/Live Chat widget (WhatsApp, Instagram DM, Phone)
- ✅ Stripe payment for R100 booking deposits (ZAR currency)
- ✅ Service category filtering
- ✅ Booking availability system
- ✅ Contact form submission
- ✅ Newsletter subscription
- ✅ Responsive design (mobile-first)
- ✅ Framer Motion animations

### Backend APIs
- GET /api/services - All services
- GET /api/services/{category} - Filter by category
- POST /api/bookings - Create booking
- GET /api/bookings/availability - Check available slots
- POST /api/payments/checkout - Create Stripe session
- GET /api/payments/status/{session_id} - Check payment
- GET /api/instagram/feed - Instagram posts (placeholder)
- POST /api/contact - Submit contact form
- POST /api/newsletter - Subscribe to newsletter

### Design System
- **Typography**: Playfair Display (headings) + Manrope (body)
- **Colors**: Cream #FDFCF8, Gold #D4AF37, Dusty Rose #E6D2C9
- **Buttons**: Pill-shaped, uppercase tracking
- **Cards**: White with subtle borders, no heavy shadows

## Prioritized Backlog

### P0 - Critical (Next Sprint)
- [ ] Add real Instagram API credentials for live feed
- [ ] Add actual video content to Gallery (replace placeholders)
- [ ] Email notifications for new bookings

### P1 - High Priority
- [ ] Admin dashboard for managing bookings
- [ ] SMS confirmation for bookings (Twilio)
- [ ] Customer reviews/testimonials management
- [ ] Service availability calendar management

### P2 - Medium Priority
- [ ] Customer accounts and booking history
- [ ] Loyalty/rewards program
- [ ] Gift vouchers
- [ ] Before/after gallery with tagging

### P3 - Future Enhancements
- [ ] Blog/beauty tips section
- [ ] Multi-language support (English/Afrikaans/Zulu)
- [ ] PWA for mobile app-like experience
- [ ] Integration with Google Business Profile

## Technical Stack
- **Frontend**: React 19, Tailwind CSS, Framer Motion, shadcn/ui
- **Backend**: FastAPI, Motor (MongoDB async)
- **Database**: MongoDB
- **Payments**: Stripe (emergentintegrations)
- **Hosting**: Emergent Platform

## Environment Variables Required
```
# Backend (.env)
MONGO_URL=mongodb://localhost:27017
DB_NAME=test_database
STRIPE_API_KEY=sk_test_emergent
INSTAGRAM_ACCESS_TOKEN=<add-when-available>
INSTAGRAM_BUSINESS_ACCOUNT_ID=<add-when-available>

# Frontend (.env)
REACT_APP_BACKEND_URL=<deployment-url>
```

## Next Tasks List
1. Obtain Instagram API credentials and configure live feed
2. Upload real video content to Gallery section
3. Set up email notifications for booking confirmations
4. Create admin panel for booking management
