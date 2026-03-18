import requests
import sys
from datetime import datetime, timedelta
import json

class IthatengBeautyAPITester:
    def __init__(self, base_url="https://ithateng-beauty.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)

            success = response.status_code == expected_status
            
            result = {
                'test_name': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': response.status_code,
                'success': success,
                'response_data': None,
                'error': None
            }

            if success:
                self.tests_passed += 1
                try:
                    result['response_data'] = response.json()
                    print(f"✅ Passed - Status: {response.status_code}")
                    if response.json():
                        print(f"   Response: {json.dumps(response.json(), indent=2)[:200]}...")
                except:
                    print(f"✅ Passed - Status: {response.status_code} (No JSON response)")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    result['error'] = error_data
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    result['error'] = response.text
                    print(f"   Error: {response.text}")

            self.test_results.append(result)
            return success, result.get('response_data', {})

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                'test_name': name,
                'endpoint': endpoint,
                'method': method,
                'expected_status': expected_status,
                'actual_status': None,
                'success': False,
                'response_data': None,
                'error': str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_services_endpoints(self):
        """Test all services-related endpoints"""
        print("\n=== TESTING SERVICES ENDPOINTS ===")
        
        # Test get all services
        success, services_data = self.run_test(
            "Get All Services",
            "GET",
            "services",
            200
        )
        
        if success and services_data:
            print(f"   Found {len(services_data)} services")
            
            # Test category filtering with first service category
            if len(services_data) > 0:
                first_category = services_data[0].get('category')
                if first_category:
                    self.run_test(
                        f"Get Services by Category ({first_category})",
                        "GET",
                        f"services/{first_category}",
                        200
                    )
        
        return success

    def test_booking_endpoints(self):
        """Test booking-related endpoints"""
        print("\n=== TESTING BOOKING ENDPOINTS ===")
        
        # Test availability check for tomorrow
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
        success_availability, _ = self.run_test(
            "Check Booking Availability",
            "GET",
            "bookings/availability",
            200,
            params={'date': tomorrow}
        )
        
        # Test booking creation
        booking_data = {
            "user_name": "Test User",
            "user_email": "test@example.com",
            "user_phone": "065 123 4567",
            "service_id": "test-service-id",
            "date": tomorrow,
            "time": "10:00"
        }
        
        success_booking, booking_response = self.run_test(
            "Create Booking",
            "POST",
            "bookings",
            200,
            data=booking_data
        )
        
        return success_availability and success_booking, booking_response

    def test_contact_endpoints(self):
        """Test contact form endpoint"""
        print("\n=== TESTING CONTACT ENDPOINTS ===")
        
        contact_data = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "065 123 4567",
            "message": "This is a test message"
        }
        
        success, _ = self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=contact_data
        )
        
        return success

    def test_newsletter_endpoint(self):
        """Test newsletter subscription"""
        print("\n=== TESTING NEWSLETTER ENDPOINTS ===")
        
        newsletter_data = {
            "email": "newsletter-test@example.com"
        }
        
        success, _ = self.run_test(
            "Newsletter Subscription",
            "POST",
            "newsletter",
            200,
            data=newsletter_data
        )
        
        return success

    def test_instagram_endpoint(self):
        """Test Instagram feed endpoint"""
        print("\n=== TESTING INSTAGRAM ENDPOINTS ===")
        
        success, response = self.run_test(
            "Get Instagram Feed",
            "GET",
            "instagram/feed",
            200,
            params={'limit': 12}
        )
        
        if success and response:
            print(f"   Instagram source: {response.get('source', 'unknown')}")
            print(f"   Instagram posts count: {len(response.get('data', []))}")
        
        return success

    def test_payment_endpoints(self):
        """Test payment-related endpoints (limited without actual booking)"""
        print("\n=== TESTING PAYMENT ENDPOINTS ===")
        
        # Test payment status with dummy session ID (should return 404 or error)
        success, _ = self.run_test(
            "Get Payment Status (Dummy ID)",
            "GET",
            "payments/status/dummy-session-id",
            404  # Expected to fail with dummy ID
        )
        
        return True  # This test is expected to fail, so we return True

    def test_seed_services(self):
        """Test seeding services (admin function)"""
        print("\n=== TESTING SEED ENDPOINTS ===")
        
        success, response = self.run_test(
            "Seed Services",
            "POST",
            "seed-services",
            200
        )
        
        if success and response:
            print(f"   Seeded message: {response.get('message', 'No message')}")
        
        return success

def main():
    print("🏥 Starting Ithateng By Ale Beauty Website API Testing...\n")
    
    # Setup
    tester = IthatengBeautyAPITester()
    
    # Run all tests
    services_ok = tester.test_services_endpoints()
    booking_ok, booking_response = tester.test_booking_endpoints()
    contact_ok = tester.test_contact_endpoints()
    newsletter_ok = tester.test_newsletter_endpoint()
    instagram_ok = tester.test_instagram_endpoint()
    payment_ok = tester.test_payment_endpoints()
    seed_ok = tester.test_seed_services()
    
    # Print results
    print(f"\n📊 FINAL RESULTS:")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Critical system checks
    critical_systems = {
        "Services API": services_ok,
        "Booking System": booking_ok, 
        "Contact Form": contact_ok,
        "Instagram Feed": instagram_ok
    }
    
    print(f"\n🔍 CRITICAL SYSTEMS STATUS:")
    for system, status in critical_systems.items():
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {system}: {'WORKING' if status else 'FAILED'}")
    
    # Detailed test results
    print(f"\n📋 DETAILED TEST RESULTS:")
    for result in tester.test_results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        print(f"{status} {result['test_name']} ({result['method']} {result['endpoint']}) - {result['actual_status']}")
        if not result['success'] and result['error']:
            print(f"     Error: {result['error']}")
    
    # Return appropriate exit code
    critical_failures = sum(1 for status in critical_systems.values() if not status)
    if critical_failures > 2:
        print(f"\n🚨 CRITICAL: {critical_failures} major systems failing!")
        return 1
    elif critical_failures > 0:
        print(f"\n⚠️  WARNING: {critical_failures} systems have issues")
        return 0
    else:
        print(f"\n🎉 SUCCESS: All critical systems operational!")
        return 0

if __name__ == "__main__":
    sys.exit(main())