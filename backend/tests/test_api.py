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
    assert data["recommended_vehicle"] == "Pickup Truck (Mahindra Bolero Maxi)"
    assert data["recommended_cost"] > 0
    assert len(data["options"]) >= 4

def test_mandi_intelligence():
    response = client.get("/api/v1/mandi/prices?crop=Soybean&quantity_quintals=50")
    assert response.status_code == 200
    data = response.json()
    assert data["best_mandi"] is not None
    assert "net_realized_price" in data["best_mandi"]
    assert len(data["all_mandis"]) >= 2

def test_disease_detection():
    response = client.post("/api/v1/disease/detect", data={
        "crop_name": "Tomato",
        "image_url": "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["detected_disease"] != ""
    assert data["confidence"] > 80.0
    assert data["organic_remedy"] != ""
    assert data["chemical_treatment"] != ""

def test_krishi_sahayak_chatbot():
    response = client.post("/api/v1/chatbot/ask", json={
        "query": "What is the live mandi price for Soybean?",
        "language": "en"
    })
    assert response.status_code == 200
    data = response.json()
    assert "Soybean" in data["answer"] or "Mandi" in data["answer"]
    assert len(data["suggested_actions"]) > 0


