from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user, require_roles
from backend.app.models.user import User
from backend.app.models.order import Order
from backend.app.models.listing import CropListing
from backend.app.models.notification import Notification
from backend.app.schemas.order import OrderOut
import uuid

router = APIRouter()

class OrderPaymentRequest(BaseModel):
    payment_method: str = "phonepe"  # phonepe, gpay, paytm, card, cod
    upi_id: Optional[str] = "merchant@okhdfcbank"
    amount: float
    notes: Optional[str] = None

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
def get_order_by_id(
    order_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    # Only participants (farmer/merchant) or admins may view an order
    if (
        current_user.role != "admin"
        and current_user.id not in (order.farmer_id, order.merchant_id)
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot view this order")
    return format_order_out(order, db)

@router.post("/{order_id}/pay")
def pay_order(
    order_id: int,
    pay_in: OrderPaymentRequest,
    current_user: User = Depends(require_roles("merchant")),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    if order.merchant_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the merchant on this order can make the payment",
        )

    # Amount is server-authoritative from the agreed order total
    if pay_in.amount != order.total_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Amount must match the order total of ₹{order.total_amount}",
        )
    
    farmer = db.query(User).filter(User.id == order.farmer_id).first()
    listing = db.query(CropListing).filter(CropListing.id == order.listing_id).first()
    crop_title = listing.crop_name if listing else "Crop Produce"

    txn_ref = f"UPI/{uuid.uuid4().hex[:10].upper()}"

    if pay_in.payment_method == "cod":
        order.payment_status = "cod_pending"
        order.status = "confirmed"
        notif_msg = f"🤝 Merchant {current_user.name} selected Cash on Delivery for {crop_title} (Order #{order.id}). Cash ₹{int(pay_in.amount):,} to be collected at Mandi unloading gate."
    else:
        order.payment_status = "escrow_deposited"
        order.status = "confirmed"
        notif_msg = f"💰 ₹{int(pay_in.amount):,} received from Merchant {current_user.name} via {pay_in.payment_method.upper()} UPI (Ref: {txn_ref}) for {crop_title} (Order #{order.id}). Funds safely held in Smart Escrow."

    db.add(
        Notification(
            user_id=order.farmer_id,
            title=f"💸 Payment Updated: Order #{order.id}",
            message=notif_msg
        )
    )
    db.commit()
    db.refresh(order)

    return {
        "status": "success",
        "order_id": order.id,
        "payment_status": order.payment_status,
        "transaction_ref": txn_ref,
        "amount": pay_in.amount,
        "method": pay_in.payment_method,
        "beneficiary": farmer.name if farmer else "Farmer Ramesh Patil"
    }

