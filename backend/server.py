from fastapi import FastAPI, APIRouter, HTTPException, Request, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Ithateng By Ale API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ===== MODELS =====

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    service_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    category: str
    description: str
    price: float
    duration: int
    image_url: Optional[str] = None

class BookingCreate(BaseModel):
    user_name: str
    user_email: EmailStr
    user_phone: str
    service_id: str
    date: str
    time: str

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    booking_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_name: str
    user_email: str
    user_phone: str
    service_id: str
    date: str
    time: str
    status: str = "pending"
    payment_status: str = "unpaid"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    transaction_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    booking_id: Optional[str] = None
    amount: float
    currency: str
    status: str
    payment_status: str
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class NewsletterSubscribe(BaseModel):
    email: EmailStr

class CheckoutRequest(BaseModel):
    booking_id: str
    origin_url: str

class InstagramMedia(BaseModel):
    id: str
    caption: Optional[str] = ""
    media_type: str
    media_url: str
    permalink: str
    timestamp: str
    like_count: int = 0
    comments_count: int = 0

# ===== SERVICES ENDPOINTS =====

@api_router.get("/services", response_model=List[Service])
async def get_all_services():
    services = await db.services.find({}, {"_id": 0}).to_list(1000)
    return services

@api_router.get("/services/{category}", response_model=List[Service])
async def get_services_by_category(category: str):
    services = await db.services.find({"category": category}, {"_id": 0}).to_list(1000)
    return services

# ===== BOOKING ENDPOINTS =====

@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    booking = Booking(**booking_data.model_dump())
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    return booking

@api_router.get("/bookings/availability")
async def get_availability(date: str):
    bookings = await db.bookings.find({"date": date, "status": {"$ne": "cancelled"}}, {"_id": 0}).to_list(1000)
    booked_times = [b['time'] for b in bookings]
    
    all_slots = [f"{h:02d}:00" for h in range(9, 17)]
    available = [slot for slot in all_slots if slot not in booked_times]
    
    return {"date": date, "available_slots": available, "booked_slots": booked_times}

# ===== PAYMENT ENDPOINTS =====

PACKAGES = {"booking_deposit": 100.0}

@api_router.post("/payments/checkout")
async def create_checkout_session(request: CheckoutRequest, http_request: Request):
    try:
        booking = await db.bookings.find_one({"booking_id": request.booking_id}, {"_id": 0})
        if not booking:
            raise HTTPException(status_code=404, detail="Booking not found")
        
        stripe_api_key = os.getenv("STRIPE_API_KEY")
        if not stripe_api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")
        
        host_url = request.origin_url
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        amount = PACKAGES["booking_deposit"]
        success_url = f"{host_url}/booking/confirmation?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{host_url}/booking"
        
        checkout_request = CheckoutSessionRequest(
            amount=amount,
            currency="zar",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"booking_id": request.booking_id}
        )
        
        session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)
        
        transaction = PaymentTransaction(
            session_id=session.session_id,
            booking_id=request.booking_id,
            amount=amount,
            currency="zar",
            status="initiated",
            payment_status="pending",
            metadata={"booking_id": request.booking_id}
        )
        
        trans_doc = transaction.model_dump()
        trans_doc['created_at'] = trans_doc['created_at'].isoformat()
        await db.payment_transactions.insert_one(trans_doc)
        
        return {"url": session.url, "session_id": session.session_id}
    
    except Exception as e:
        logger.error(f"Error creating checkout session: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    try:
        stripe_api_key = os.getenv("STRIPE_API_KEY")
        host_url = os.getenv("REACT_APP_BACKEND_URL", "http://localhost:8001")
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)
        
        transaction = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        
        if transaction and status.payment_status == "paid" and transaction["payment_status"] != "paid":
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"status": "complete", "payment_status": "paid"}}
            )
            
            booking_id = transaction.get("booking_id")
            if booking_id:
                await db.bookings.update_one(
                    {"booking_id": booking_id},
                    {"$set": {"payment_status": "paid", "status": "confirmed"}}
                )
        
        return {
            "session_id": session_id,
            "status": status.status,
            "payment_status": status.payment_status,
            "amount_total": status.amount_total,
            "currency": status.currency
        }
    
    except Exception as e:
        logger.error(f"Error checking payment status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    try:
        body = await request.body()
        stripe_api_key = os.getenv("STRIPE_API_KEY")
        host_url = os.getenv("REACT_APP_BACKEND_URL", "http://localhost:8001")
        webhook_url = f"{host_url}/api/webhook/stripe"
        stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
        
        webhook_response = await stripe_checkout.handle_webhook(body, stripe_signature)
        
        logger.info(f"Webhook received: {webhook_response.event_type}")
        return {"status": "success"}
    
    except Exception as e:
        logger.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

# ===== INSTAGRAM ENDPOINTS =====

@api_router.get("/instagram/feed")
async def get_instagram_feed(limit: int = 12):
    try:
        access_token = os.getenv("INSTAGRAM_ACCESS_TOKEN")
        business_account_id = os.getenv("INSTAGRAM_BUSINESS_ACCOUNT_ID")
        
        if not access_token or not business_account_id:
            cached = await db.instagram_cache.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
            if cached:
                return {"data": cached, "source": "cache"}
            return {"data": [], "source": "none", "message": "Instagram API not configured"}
        
        api_version = "v18.0"
        endpoint = f"https://graph.instagram.com/{api_version}/{business_account_id}/media"
        
        params = {
            "fields": "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count",
            "limit": limit,
            "access_token": access_token
        }
        
        async with httpx.AsyncClient(timeout=30.0) as http_client:
            response = await http_client.get(endpoint, params=params)
            response.raise_for_status()
            data = response.json()
            media_list = data.get("data", [])
            
            for media in media_list:
                await db.instagram_cache.update_one(
                    {"id": media["id"]},
                    {"$set": media},
                    upsert=True
                )
            
            return {"data": media_list, "source": "api"}
    
    except httpx.HTTPStatusError as e:
        logger.error(f"Instagram API error: {e.response.status_code}")
        cached = await db.instagram_cache.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
        return {"data": cached, "source": "cache"}
    
    except Exception as e:
        logger.error(f"Error fetching Instagram feed: {str(e)}")
        cached = await db.instagram_cache.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
        return {"data": cached, "source": "cache"}

# ===== CONTACT & NEWSLETTER ENDPOINTS =====

@api_router.post("/contact")
async def submit_contact(message: ContactMessage):
    doc = message.model_dump()
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['id'] = str(uuid.uuid4())
    
    await db.contact_messages.insert_one(doc)
    return {"message": "Message received successfully"}

@api_router.post("/newsletter")
async def subscribe_newsletter(subscription: NewsletterSubscribe):
    existing = await db.newsletter_subscribers.find_one({"email": subscription.email})
    if existing:
        return {"message": "Already subscribed"}
    
    doc = {
        "email": subscription.email,
        "subscribed_at": datetime.now(timezone.utc).isoformat(),
        "id": str(uuid.uuid4())
    }
    
    await db.newsletter_subscribers.insert_one(doc)
    return {"message": "Subscribed successfully"}

# ===== SEED DATA =====

@api_router.post("/seed-services")
async def seed_services():
    services_data = [
        {"service_id": str(uuid.uuid4()), "name": "Full Tips (French)", "category": "Nails", "description": "Complete French tip manicure", "price": 230.0, "duration": 90, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/b09vt5oo_nail_2.png"},
        {"service_id": str(uuid.uuid4()), "name": "Gel on Natural Nails", "category": "Nails", "description": "Gel polish on natural nails", "price": 180.0, "duration": 60, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/cxrcq4tb_nail_5.png"},
        {"service_id": str(uuid.uuid4()), "name": "Gel on Natural Nails (French)", "category": "Nails", "description": "French gel polish on natural nails", "price": 200.0, "duration": 70, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/b09vt5oo_nail_2.png"},
        {"service_id": str(uuid.uuid4()), "name": "Acrylic/Polygel", "category": "Nails", "description": "Acrylic or polygel application", "price": 220.0, "duration": 120, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/o0mz3m4e_nail_1.png"},
        {"service_id": str(uuid.uuid4()), "name": "Buff & Shine", "category": "Nails", "description": "Natural nail buffing and shine", "price": 80.0, "duration": 30, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/cxrcq4tb_nail_5.png"},
        {"service_id": str(uuid.uuid4()), "name": "Nail Removal", "category": "Nails", "description": "Safe removal of gel/acrylic", "price": 65.0, "duration": 30, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/rabcff4u_nail_3.png"},
        {"service_id": str(uuid.uuid4()), "name": "Toes (Gel)", "category": "Nails", "description": "Gel pedicure", "price": 100.0, "duration": 45, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/txlezt8p_nail_4.png"},
        {"service_id": str(uuid.uuid4()), "name": "Toes (French)", "category": "Nails", "description": "French pedicure", "price": 150.0, "duration": 60, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/b09vt5oo_nail_2.png"},
        
        {"service_id": str(uuid.uuid4()), "name": "Lash Extensions (Cluster)", "category": "Lashes", "description": "Cluster lash extensions for fuller look", "price": 150.0, "duration": 60, "image_url": "https://images.unsplash.com/photo-1645735123314-d11fcfdd0000?crop=entropy&cs=srgb&fm=jpg&q=85"},
        {"service_id": str(uuid.uuid4()), "name": "Lash Wash", "category": "Lashes", "description": "Professional lash cleaning", "price": 50.0, "duration": 20, "image_url": "https://images.unsplash.com/photo-1645735123314-d11fcfdd0000?crop=entropy&cs=srgb&fm=jpg&q=85"},
        {"service_id": str(uuid.uuid4()), "name": "Lash Removal", "category": "Lashes", "description": "Safe lash extension removal", "price": 50.0, "duration": 20, "image_url": "https://images.unsplash.com/photo-1645735123314-d11fcfdd0000?crop=entropy&cs=srgb&fm=jpg&q=85"},
        
        {"service_id": str(uuid.uuid4()), "name": "Wig Making", "category": "Wigs", "description": "Custom wig creation", "price": 250.0, "duration": 180, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Wig Installation", "category": "Wigs", "description": "Professional wig installation", "price": 250.0, "duration": 90, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Wig Wash", "category": "Wigs", "description": "Deep cleaning for wigs", "price": 250.0, "duration": 60, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Wig Treatment", "category": "Wigs", "description": "Conditioning treatment", "price": 300.0, "duration": 75, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Wig Styling", "category": "Wigs", "description": "Custom styling service", "price": 100.0, "duration": 45, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Wig Plucking", "category": "Wigs", "description": "Natural hairline plucking", "price": 100.0, "duration": 30, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Wig Bleaching", "category": "Wigs", "description": "Knot bleaching for realistic look", "price": 100.0, "duration": 60, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Wig Detangling", "category": "Wigs", "description": "Gentle detangling service", "price": 50.0, "duration": 30, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/9okehty4_wig.jpeg"},
        
        {"service_id": str(uuid.uuid4()), "name": "Simple Makeup Look", "category": "Makeup", "description": "Natural everyday makeup", "price": 150.0, "duration": 45, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/mmr1dd7a_head.jpeg"},
        {"service_id": str(uuid.uuid4()), "name": "Full Glam Makeup", "category": "Makeup", "description": "Full glam with cluster lashes", "price": 200.0, "duration": 90, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/b37bdic1_makeup.jpeg"},
        
        {"service_id": str(uuid.uuid4()), "name": "Single Polaroid", "category": "Photography", "description": "1 polaroid photo", "price": 40.0, "duration": 10, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/lo6fpv6a_Single%20Polaroid.png"},
        {"service_id": str(uuid.uuid4()), "name": "Polaroid Bundle (2+)", "category": "Photography", "description": "R30 per photo for 2 or more", "price": 30.0, "duration": 10, "image_url": "https://customer-assets.emergentagent.com/job_ithateng-beauty/artifacts/27pdy9sv_Polaroid%20Bundle.png"},
    ]
    
    await db.services.delete_many({})
    await db.services.insert_many(services_data)
    return {"message": f"Seeded {len(services_data)} services"}

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()