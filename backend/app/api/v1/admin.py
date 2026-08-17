from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
from backend.app.models.user import User
from backend.app.models.listing import CropListing
from backend.app.models.bid import Bid
from backend.app.models.order import Order
from backend.app.models.transport import TransportJob
from backend.app.models.pesticide import PesticideProduct, PesticideOrder
from backend.app.models.disease import DiseaseReport

router = APIRouter()

@router.get("/stats")
def get_admin_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    total_farmers = db.query(User).filter(User.role == "farmer").count()
    total_merchants = db.query(User).filter(User.role == "merchant").count()
    total_transporters = db.query(User).filter(User.role == "transporter").count()
    total_sellers = db.query(User).filter(User.role == "seller").count()
    
    total_listings = db.query(CropListing).count()
    active_bidding_listings = db.query(CropListing).filter(CropListing.status == "bidding_open").count()
    total_bids = db.query(Bid).count()

    orders = db.query(Order).all()
    total_gmv = sum(o.total_amount for o in orders)
    total_delivered_orders = sum(1 for o in orders if o.status in ["delivered", "completed", "in_transit"])

    total_transport_trips = db.query(TransportJob).count()
    total_disease_diagnoses = db.query(DiseaseReport).count()

    # Sample risk/dispute monitor
    disputes = [
        {
            "id": "DSP-104",
            "crop": "Red Onion (85 Qtl)",
            "farmer": "Ramesh Patil",
            "merchant": "Vijay Mehra",
            "type": "Moisture Assessment Dispute",
            "status": "Resolved (Auto-Arbitrated by APMC Grade Benchmark)",
            "severity": "Low"
        },
        {
            "id": "DSP-109",
            "crop": "Tomato (35 Qtl)",
            "farmer": "Ramesh Patil",
            "transporter": "Mahendra Shinde",
            "type": "Delay in Route Loading (+45 mins)",
            "status": "In Mediation",
            "severity": "Moderate"
        }
    ]

    return {
        "platform_gmv": round(total_gmv, 2),
        "total_farmers": total_farmers,
        "total_merchants": total_merchants,
        "total_transporters": total_transporters,
        "total_sellers": total_sellers,
        "total_listings": total_listings,
        "active_bidding_listings": active_bidding_listings,
        "total_bids": total_bids,
        "total_orders": len(orders),
        "total_delivered_orders": total_delivered_orders,
        "total_transport_trips": total_transport_trips,
        "total_disease_diagnoses": total_disease_diagnoses,
        "average_trust_score": 4.88,
        "disputes": disputes
    }

@router.get("/users")
def get_all_users(
    role: str = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    q = db.query(User)
    if role and role != "all":
        q = q.filter(User.role == role)
    users = q.order_by(User.id.asc()).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "phone": u.phone,
            "email": u.email,
            "role": u.role,
            "location": u.location,
            "state": u.state,
            "trust_score": u.trust_score,
            "total_deals": u.total_deals,
            "verified": u.verified
        }
        for u in users
    ]
