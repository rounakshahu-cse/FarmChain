from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
from backend.app.models.user import User
from backend.app.models.order import Order
from backend.app.models.listing import CropListing
from backend.app.schemas.order import OrderOut

router = APIRouter()

def format_order_out(order: Order, db: Session) -> OrderOut:
    farmer = db.query(User).filter(User.id == order.farmer_id).first()
    merchant = db.query(User).filter(User.id == order.merchant_id).first()
    listing = db.query(CropListing).filter(CropListing.id == order.listing_id).first()

    return OrderOut(
        id=order.id,
        listing_id=order.listing_id,
        winning_bid_id=order.winning_bid_id,
        farmer_id=order.farmer_id,
        farmer_name=farmer.name if farmer else "Farmer",
        merchant_id=order.merchant_id,
        merchant_name=merchant.name if merchant else "Merchant",
        crop_name=listing.crop_name if listing else "Crop",
        agreed_price_per_quintal=order.agreed_price_per_quintal,
        quantity_quintals=order.quantity_quintals,
        total_amount=order.total_amount,
        is_profitable_flag=order.is_profitable_flag,
        profit_margin_pct=order.profit_margin_pct,
        net_profit_amount=order.net_profit_amount,
        status=order.status,
        payment_status=order.payment_status,
        created_at=order.created_at
    )

@router.get("/", response_model=List[OrderOut])
def get_orders(
    role_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Order)
    if current_user.role == "farmer":
        query = query.filter(Order.farmer_id == current_user.id)
    elif current_user.role == "merchant":
        query = query.filter(Order.merchant_id == current_user.id)
    
    orders = query.order_by(Order.id.desc()).all()
    return [format_order_out(o, db) for o in orders]

@router.get("/{order_id}", response_model=OrderOut)
def get_order_by_id(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return format_order_out(order, db)
