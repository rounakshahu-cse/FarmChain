import os
# pyrefly: ignore [missing-import]
import pytest
# pyrefly: ignore [missing-import]
from fastapi.testclient import TestClient
# Set test database path before imports
os.environ["DATABASE_URL"] = "sqlite:///./test_farmchain.db"

from backend.app.main import app
from backend.app.core.database import Base, engine, SessionLocal
from backend.app.services.seed_data import seed_database
from backend.app.models.listing import CropListing
client = TestClient(app)

def login_headers(phone: str, password: str = "password123"):
    """Logs in a demo user and returns Authorization headers."""
    resp = client.post("/api/v1/auth/login", json={"phone_or_email": phone, "password": password})
    assert resp.status_code == 200
    return {"Authorization": f"Bearer {resp.json()['access_token']}"}

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    if os.path.exists("./test_farmchain.db"):
        os.remove("./test_farmchain.db")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    seed_database(db)
    db.close()
    yield
    if os.path.exists("./test_farmchain.db"):
        try:
            os.remove("./test_farmchain.db")
        except Exception:
            pass

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Smart Krishi Connect" in response.json()["app"]

def test_auth_demo_users():
    response = client.get("/api/v1/auth/demo-users")
    assert response.status_code == 200
    users = response.json()
    assert len(users) >= 5
    roles = {u["role"] for u in users}
    assert "farmer" in roles
    assert "merchant" in roles
    assert "transporter" in roles

def test_get_listings():
    response = client.get("/api/v1/listings")
    assert response.status_code == 200
    listings = response.json()
    assert len(listings) >= 3
    first = listings[0]
    assert "crop_name" in first
    assert "base_price" in first
    assert "cost_of_production" in first

def test_place_bid_and_accept():
    # Login as Farmer Ramesh Patil
    farmer_login = client.post("/api/v1/auth/login", json={
        "phone_or_email": "9876543210",
        "password": "password123"
    })
    assert farmer_login.status_code == 200
    farmer_token = farmer_login.json()["access_token"]
    farmer_headers = {"Authorization": f"Bearer {farmer_token}"}

    # Create fresh open listing
    create_resp = client.post("/api/v1/listings/", json={
        "crop_name": "Mustard",
        "variety": "Pusa Bold",
        "quantity_quintals": 40.0,
        "quality_grade": "Grade A",
        "base_price": 5000.0,
        "cost_of_production": 3900.0,
        "farm_location": "Dindori, Nashik",
        "district": "Nashik",
        "state": "Maharashtra",
        "schedule_for_tomorrow": False
    }, headers=farmer_headers)
    assert create_resp.status_code == 200
    listing_id = create_resp.json()["id"]

    # Login as Suresh Traders (Merchant)
    login_resp = client.post("/api/v1/auth/login", json={
        "phone_or_email": "9876543220",
        "password": "password123"
    })
    assert login_resp.status_code == 200
    merchant_token = login_resp.json()["access_token"]
    merchant_headers = {"Authorization": f"Bearer {merchant_token}"}

    # Place bid on fresh Mustard listing
    bid_resp = client.post(f"/api/v1/listings/{listing_id}/bids", json={
        "amount_per_quintal": 5400.0,
        "note": "Top grade bid for express delivery"
    }, headers=merchant_headers)
    assert bid_resp.status_code == 200
    bid_data = bid_resp.json()
    assert bid_data["amount_per_quintal"] == 5400.0
    bid_id = bid_data["id"]

    # Farmer accepts the bid
    accept_resp = client.post("/api/v1/bids/accept", json={
        "bid_id": bid_id
    }, headers=farmer_headers)
    assert accept_resp.status_code == 200
    order_data = accept_resp.json()
    assert order_data["is_profitable_flag"] is True
    assert order_data["profit_margin_pct"] > 0
    assert order_data["total_amount"] == 5400.0 * 40.0

def test_transport_quote_and_booking():
    quote_resp = client.post("/api/v1/transport/quote", json={
        "crop_name": "Soybean",
        "load_quintals": 25.0,
        "pickup_location": "Dindori, Nashik",
        "drop_location": "Vashi APMC, Mumbai",
        "distance_km": 175.0
    })
    assert quote_resp.status_code == 200
    data = quote_resp.json()
    assert "Mahindra Bolero Maxi" in data["recommended_vehicle"]
    assert data["recommended_cost"] > 0
    assert len(data["options"]) >= 4

def test_mandi_intelligence():
    response = client.get("/api/v1/mandi/prices?crop=Soybean&quantity_quintals=50")
    assert response.status_code == 200
    data = response.json()
    assert data["best_mandi"] is not None
    assert "net_realized_price" in data["best_mandi"]
    assert len(data["all_mandis"]) >= 2

def test_auth_requires_token():
    """Protected endpoints must reject unauthenticated requests."""
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401
    resp = client.get("/api/v1/admin/stats")
    assert resp.status_code == 401
    resp = client.get("/api/v1/orders/1")
    assert resp.status_code == 401

def test_disease_detection():
    headers = login_headers("9876543210")
    response = client.post("/api/v1/disease/detect", data={
        "crop_name": "Tomato",
        "image_url": "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400"
    }, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["crop_name"] == "Tomato"
    assert data["botanical_name"] == "Solanum lycopersicum"
    assert data["crop_confidence"] >= 90.0
    assert data["detected_disease"] != ""
    assert data["confidence"] > 80.0
    assert data["organic_remedy"] != ""
    assert data["chemical_treatment"] != ""
    assert data["spray_dosage"] is not None
    assert len(data.get("diagnostic_markers", [])) > 0

def test_disease_detection_file_upload_and_auto_crop():
    # Test uploading a raw image file with Auto-Detect crop
    headers = login_headers("9876543210")
    dummy_image_bytes = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00"
    response = client.post(
        "/api/v1/disease/detect",
        data={"crop_name": "Auto-Detect"},
        files={"file": ("leaf_cotton_sample.jpg", dummy_image_bytes, "image/jpeg")},
        headers=headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["crop_name"] == "Cotton"
    assert data["botanical_name"] == "Gossypium hirsutum"
    assert data["detected_disease"] != ""
    assert data["confidence"] > 80.0
    assert "data:image/jpeg;base64," in data["image_url"]

def test_disease_detection_rejects_non_image():
    headers = login_headers("9876543210")
    response = client.post(
        "/api/v1/disease/detect",
        data={"crop_name": "Tomato"},
        files={"file": ("evil.txt", b"not an image at all", "text/plain")},
        headers=headers
    )
    assert response.status_code == 400


def test_krishi_sahayak_chatbot():
    headers = login_headers("9876543210")
    response = client.post("/api/v1/chatbot/ask", json={
        "query": "What is the live mandi price for Soybean?",
        "language": "en"
    }, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert "Soybean" in data["answer"] or "Mandi" in data["answer"]
    assert len(data["suggested_actions"]) > 0

def test_pesticides_and_order():
    # 1. Get pesticides
    resp = client.get("/api/v1/pesticides/")
    assert resp.status_code == 200
    products = resp.json()
    assert len(products) > 0
    first_p = products[0]

    # 2. Order pesticide (farmers only)
    headers = login_headers("9876543210")
    order_resp = client.post("/api/v1/pesticides/order", json={
        "product_id": first_p["id"],
        "quantity": 2,
        "delivery_address": "Farm House #4, Nashik"
    }, headers=headers)
    assert order_resp.status_code == 200
    order_data = order_resp.json()
    assert order_data["quantity"] == 2
    assert order_data["total_price"] == first_p["price"] * 2

def test_notifications_lifecycle():
    headers = login_headers("9876543210")
    # Get notifications
    resp = client.get("/api/v1/notifications/", headers=headers)
    assert resp.status_code == 200
    notifs = resp.json()
    assert isinstance(notifs, list)

    if len(notifs) > 0:
        nid = notifs[0]["id"]
        read_resp = client.post(f"/api/v1/notifications/{nid}/read", headers=headers)
        assert read_resp.status_code == 200

    read_all = client.post("/api/v1/notifications/read-all", headers=headers)
    assert read_all.status_code == 200

def test_admin_stats_and_users():
    admin_headers = login_headers("9999999999")

    stats_resp = client.get("/api/v1/admin/stats", headers=admin_headers)
    assert stats_resp.status_code == 200
    stats = stats_resp.json()
    assert "platform_gmv" in stats
    assert "total_farmers" in stats

    users_resp = client.get("/api/v1/admin/users", headers=admin_headers)
    assert users_resp.status_code == 200
    users = users_resp.json()
    assert len(users) >= 5

def test_admin_endpoints_deny_non_admin():
    farmer_headers = login_headers("9876543210")
    stats_resp = client.get("/api/v1/admin/stats", headers=farmer_headers)
    assert stats_resp.status_code == 403
    users_resp = client.get("/api/v1/admin/users", headers=farmer_headers)
    assert users_resp.status_code == 403

def test_transport_booking_and_status():
    farmer_headers = login_headers("9876543210")
    book_resp = client.post("/api/v1/transport/book", json={
        "crop_name": "Wheat",
        "load_quintals": 30.0,
        "vehicle_type": "Pickup Truck (Mahindra Bolero Maxi)",
        "pickup_location": "Dindori, Nashik",
        "drop_location": "Vashi APMC",
        "distance_km": 160.0,
        "calculated_price": 4200.0
    }, headers=farmer_headers)
    assert book_resp.status_code == 200
    job = book_resp.json()
    job_id = job["id"]

    status_resp = client.post(f"/api/v1/transport/jobs/{job_id}/status?new_status=in_transit", headers=farmer_headers)
    assert status_resp.status_code == 200
    assert status_resp.json()["status"] == "in_transit"

    # A different farmer must not be able to touch someone else's job
    other_farmer_headers = login_headers("9876543211")
    denied = client.post(f"/api/v1/transport/jobs/{job_id}/status?new_status=delivered", headers=other_farmer_headers)
    assert denied.status_code == 403

def test_auth_register_and_me():
    reg_resp = client.post("/api/v1/auth/register", json={
        "name": "Test Farmer Ganesh",
        "phone": "9998887776",
        "email": "ganesh.test@farmchain.in",
        "password": "securepassword123",
        "role": "farmer",
        "location": "Pimpalgaon, Nashik",
        "district": "Nashik",
        "state": "Maharashtra"
    })
    assert reg_resp.status_code == 200
    token = reg_resp.json()["access_token"]

    me_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["name"] == "Test Farmer Ganesh"

def test_chatbot_trained_knowledge_domains():
    headers = login_headers("9876543210")
    queries_and_expected = [
        ("What is FarmChain and how does it help farmers?", "Smart Krishi Connect"),
        ("What is the formula for net profit margin and Cost-of-Production?", "Profitability"),
        ("How does live bidding and real-time auctions work?", "Cost-of-Production"),
        ("Tell me about Ramesh Patil and demo password", "Ramesh Patil"),
        ("How to cure Tomato Early Blight?", "Early Blight"),
        ("What is the price and stock of Kavach Chlorothalonil?", "Kavach"),
        ("What is the capacity and rate of Tata Ace Chota Hathi?", "Mini Truck"),
        ("What are the color hex codes of the Calm Luxury palette?", "#F2EFEA"),
        ("What is the live rate of Soybean in Nashik?", "Soybean"),
        ("Calculate transport freight for 35 quintal over 60 km", "35.0 Qtl"),
        ("सोयाबीन का ताज़ा मंडी भाव क्या है?", "सोयाबीन"),
        ("टोमॅटो करपा रोगावर काय उपाय आहे?", "Early Blight"),
        ("लिलाव कसा होतो आणि थेट बोली कशी लावायची?", "लिलाव"),
    ]

    for q, expected_substr in queries_and_expected:
        resp = client.post("/api/v1/chatbot/ask", json={"query": q, "language": "en"}, headers=headers)
        assert resp.status_code == 200
        data = resp.json()
        assert "answer" in data
        assert len(data["answer"]) > 20
        assert expected_substr.lower() in data["answer"].lower(), f"Failed for query: '{q}'\nAnswer: {data['answer']}"
