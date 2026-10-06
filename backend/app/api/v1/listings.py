from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user, require_roles
from backend.app.models.user import User
from backend.app.models.listing import CropListing
from backend.app.models.bid import Bid
from backend.app.models.mandi import MandiPrice
from backend.app.models.notification import Notification
from backend.app.schemas.listing import CropListingCreate, CropListingOut, BidOut

router = APIRouter()

def format_listing_out(listing: CropListing, db: Session) -> CropListingOut:
    bids = db.query(Bid).filter(Bid.listing_id == listing.id).order_by(Bid.amount_per_quintal.desc()).all()
    highest_bid = bids[0].amount_per_quintal if bids else None

    # Batch-load merchants in a single query instead of one per bid
    merchant_ids = {b.merchant_id for b in bids}
    merchants = {}
    if merchant_ids:
        merchants = {
            m.id: m
            for m in db.query(User).filter(User.id.in_(merchant_ids)).all()
        }

    bids_out = []
    for b in bids:
        merchant = merchants.get(b.merchant_id)
        bids_out.append(BidOut(
            id=b.id,
            listing_id=b.listing_id,
            merchant_id=b.merchant_id,
            merchant_name=merchant.name if merchant else "Merchant",
            merchant_trust_score=merchant.trust_score if merchant else 4.8,
            amount_per_quintal=b.amount_per_quintal,
            total_amount=b.total_amount,
            note=b.note,
            status=b.status,
            created_at=b.created_at
        ))

    farmer = db.query(User).filter(User.id == listing.farmer_id).first()

    return CropListingOut(
        id=listing.id,
        farmer_id=listing.farmer_id,
        farmer_name=farmer.name if farmer else "Farmer",
        farmer_trust_score=farmer.trust_score if farmer else 4.8,
        crop_name=listing.crop_name,
        variety=listing.variety,
        quantity_quintals=listing.quantity_quintals,
        quality_grade=listing.quality_grade,
        base_price=listing.base_price,
        cost_of_production=listing.cost_of_production,
        farm_location=listing.farm_location,
        district=listing.district,
        state=listing.state,
        status=listing.status,
        bidding_opens_at=listing.bidding_opens_at,
        bidding_closes_at=listing.bidding_closes_at,
        previous_closing_price=listing.previous_closing_price,
        image_url=listing.image_url,
        notes=listing.notes,
        highest_bid_amount=highest_bid,
        total_bids_count=len(bids),
        bids=bids_out,
        created_at=listing.created_at
    )

@router.get("/", response_model=List[CropListingOut])
def get_listings(
    crop: Optional[str] = None,
    status_filter: Optional[str] = None,
    farmer_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(CropListing)
    if crop:
        query = query.filter(CropListing.crop_name.ilike(f"%{crop}%"))
    if status_filter and status_filter != "all":
        query = query.filter(CropListing.status == status_filter)
    if farmer_id:
        query = query.filter(CropListing.farmer_id == farmer_id)
    
    listings = query.order_by(CropListing.id.desc()).all()
    return [format_listing_out(l, db) for l in listings]

@router.get("/{listing_id}", response_model=CropListingOut)
def get_listing_by_id(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(CropListing).filter(CropListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found")
    return format_listing_out(listing, db)

@router.post("/", response_model=CropListingOut)
def create_listing(
    listing_in: CropListingCreate,
    current_user: User = Depends(require_roles("farmer")),
    db: Session = Depends(get_db)
):
    now = datetime.now(timezone.utc)
    
    # Check if previous closing price exists in mandi data for reference
    mandi_ref = db.query(MandiPrice).filter(
        MandiPrice.crop_name.ilike(f"%{listing_in.crop_name}%")
    ).first()
    prev_close = mandi_ref.modal_price if mandi_ref else listing_in.base_price * 1.05

    # Scheduled bidding logic: Opens tomorrow (next day) or immediate if not selected
    if listing_in.schedule_for_tomorrow:
        listing_status = "scheduled_tomorrow"
        opens_at = now + timedelta(hours=14)
        closes_at = opens_at + timedelta(hours=24)
    else:
        listing_status = "bidding_open"
        opens_at = now
        closes_at = now + timedelta(hours=24)

    # Fallback crop image if none provided
    crop_images = {
        "soybean": "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400",
        "wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
        "cotton": "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400",
        "tomato": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
        "onion": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400",
        "rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"
    }
    selected_img = listing_in.image_url
    if not selected_img:
        for k, v in crop_images.items():
            if k in listing_in.crop_name.lower():
                selected_img = v
                break
        if not selected_img:
            selected_img = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400"

    new_listing = CropListing(
        farmer_id=current_user.id,
        crop_name=listing_in.crop_name,
        variety=listing_in.variety or "Standard High Quality",
        quantity_quintals=listing_in.quantity_quintals,
        quality_grade=listing_in.quality_grade,
        base_price=listing_in.base_price,
        cost_of_production=listing_in.cost_of_production,
        farm_location=listing_in.farm_location,
        district=listing_in.district,
        state=listing_in.state,
        status=listing_status,
        bidding_opens_at=opens_at,
        bidding_closes_at=closes_at,
        previous_closing_price=round(prev_close, 2),
        image_url=selected_img,
        notes=listing_in.notes
    )
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    # Notify all registered merchants about the new listing
    merchants = db.query(User).filter(User.role == "merchant").all()
    for m in merchants:
        notification = Notification(
            user_id=m.id,
            title=f"🔔 New {new_listing.crop_name} Listing Available!",
            message=f"{current_user.name} posted {new_listing.quantity_quintals} Qtl {new_listing.crop_name} ({new_listing.quality_grade}) from {new_listing.farm_location}. Base: ₹{int(new_listing.base_price)}/Qtl. Last Mandi Close: ₹{int(prev_close)}/Qtl.",
            type="bidding_reminder" if listing_status == "scheduled_tomorrow" else "new_bid",
            is_read=False,
            link=f"/merchant/marketplace"
        )
        db.add(notification)
    db.commit()

    return format_listing_out(new_listing, db)
