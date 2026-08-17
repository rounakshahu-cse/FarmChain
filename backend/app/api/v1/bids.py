from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
from backend.app.models.user import User
from backend.app.models.listing import CropListing
from backend.app.models.bid import Bid
from backend.app.models.order import Order
from backend.app.models.notification import Notification
from backend.app.schemas.listing import BidCreate, BidOut
from backend.app.schemas.order import OrderOut, AcceptBidRequest
from backend.app.services.profitability import calculate_profitability
from backend.app.services.websocket_manager import ws_manager

router = APIRouter()

@router.post("/listings/{listing_id}/bids", response_model=BidOut)
async def place_bid(
    listing_id: int,
    bid_in: BidCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    listing = db.query(CropListing).filter(CropListing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Crop listing not found")

    if listing.status != "bidding_open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bidding is not open for this listing (Current status: {listing.status})"
        )

    if bid_in.amount_per_quintal < listing.base_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bid amount must be at least the reserve price of ₹{listing.base_price}/Qtl"
        )

    # Check highest existing bid
    existing_bids = db.query(Bid).filter(Bid.listing_id == listing_id).order_by(Bid.amount_per_quintal.desc()).all()
    previous_highest = existing_bids[0] if existing_bids else None

    total_amount = round(bid_in.amount_per_quintal * listing.quantity_quintals, 2)

    new_bid = Bid(
        listing_id=listing_id,
        merchant_id=current_user.id,
        amount_per_quintal=bid_in.amount_per_quintal,
        total_amount=total_amount,
        note=bid_in.note,
        status="active"
    )
    db.add(new_bid)
    db.commit()
    db.refresh(new_bid)

    # Notify Farmer
    farmer = db.query(User).filter(User.id == listing.farmer_id).first()
    if farmer:
        notif_farmer = Notification(
            user_id=farmer.id,
            title=f"💰 New Competitive Bid on {listing.crop_name}!",
            message=f"{current_user.name} placed a bid of ₹{int(new_bid.amount_per_quintal)}/Qtl (Total ₹{int(total_amount)}).",
            type="new_bid",
            is_read=False,
            link=f"/farmer/listings"
        )
        db.add(notif_farmer)

    # If previous highest bidder is different merchant, notify them they were outbid
    if previous_highest and previous_highest.merchant_id != current_user.id:
        notif_outbid = Notification(
            user_id=previous_highest.merchant_id,
            title=f"⚠️ You've been outbid on {listing.crop_name}!",
            message=f"A new leading bid of ₹{int(new_bid.amount_per_quintal)}/Qtl was placed on {listing.crop_name} ({listing.quantity_quintals} Qtl). Place a higher bid now!",
            type="outbid",
            is_read=False,
            link=f"/merchant/marketplace"
        )
        db.add(notif_outbid)

    db.commit()

    # Broadcast via WebSocket
    await ws_manager.broadcast_to_listing(listing_id, {
        "event": "NEW_BID",
        "listing_id": listing_id,
        "bid": {
            "id": new_bid.id,
            "merchant_id": current_user.id,
            "merchant_name": current_user.name,
            "merchant_trust_score": current_user.trust_score,
            "amount_per_quintal": new_bid.amount_per_quintal,
            "total_amount": new_bid.total_amount,
            "created_at": new_bid.created_at.isoformat()
        }
    })

    return BidOut(
        id=new_bid.id,
        listing_id=new_bid.listing_id,
        merchant_id=new_bid.merchant_id,
        merchant_name=current_user.name,
        merchant_trust_score=current_user.trust_score,
        amount_per_quintal=new_bid.amount_per_quintal,
        total_amount=new_bid.total_amount,
        note=new_bid.note,
        status=new_bid.status,
        created_at=new_bid.created_at
    )

@router.post("/bids/accept", response_model=OrderOut)
async def accept_bid(
    payload: AcceptBidRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    bid = db.query(Bid).filter(Bid.id == payload.bid_id).first()
    if not bid:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bid not found")

    listing = db.query(CropListing).filter(CropListing.id == bid.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated listing not found")

    if listing.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the farmer who listed this crop can accept bids"
        )

    if listing.status == "finalized":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This deal has already been finalized"
        )

    # Compute Profitability Breakdown
    profit_metrics = calculate_profitability(
        bid_price_per_quintal=bid.amount_per_quintal,
        cost_of_production_per_quintal=listing.cost_of_production,
        mandi_benchmark_price=listing.previous_closing_price or listing.base_price,
        quantity_quintals=listing.quantity_quintals
    )

    # Mark bid as accepted and other bids as rejected
    bid.status = "accepted"
    other_bids = db.query(Bid).filter(Bid.listing_id == listing.id, Bid.id != bid.id).all()
    for ob in other_bids:
        ob.status = "rejected"

    listing.status = "finalized"

    # Create Order
    new_order = Order(
        listing_id=listing.id,
        winning_bid_id=bid.id,
        farmer_id=listing.farmer_id,
        merchant_id=bid.merchant_id,
        agreed_price_per_quintal=bid.amount_per_quintal,
        quantity_quintals=listing.quantity_quintals,
        total_amount=bid.total_amount,
        is_profitable_flag=profit_metrics["is_profitable_flag"],
        profit_margin_pct=profit_metrics["profit_margin_pct"],
        net_profit_amount=profit_metrics["net_profit_amount"],
        status="confirmed",
        payment_status="escrow_held"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Notify Winning Merchant
    merchant = db.query(User).filter(User.id == bid.merchant_id).first()
    if merchant:
        notif_merchant = Notification(
            user_id=merchant.id,
            title=f"🎉 Deal Confirmed! Your bid won for {listing.crop_name}!",
            message=f"Farmer {current_user.name} accepted your winning bid of ₹{int(bid.amount_per_quintal)}/Qtl for {listing.quantity_quintals} Qtl {listing.crop_name}. Order #{new_order.id} generated.",
            type="bid_won",
            is_read=False,
            link=f"/merchant/orders"
        )
        db.add(notif_merchant)

    # Notify Farmer of success
    notif_farmer = Notification(
        user_id=current_user.id,
        title=f"✅ Deal Finalized for {listing.crop_name}!",
        message=f"Deal confirmed with {merchant.name if merchant else 'Merchant'} at ₹{int(bid.amount_per_quintal)}/Qtl. Net Profit: ₹{int(profit_metrics['net_profit_amount'])} ({profit_metrics['profit_margin_pct']}% Margin). Connect to transport now!",
        type="deal_finalized",
        is_read=False,
        link=f"/farmer/listings"
    )
    db.add(notif_farmer)
    db.commit()

    # Broadcast deal finalized to WebSocket
    await ws_manager.broadcast_to_listing(listing.id, {
        "event": "DEAL_FINALIZED",
        "listing_id": listing.id,
        "order_id": new_order.id,
        "winning_bid_id": bid.id,
        "agreed_price": bid.amount_per_quintal,
        "total_amount": bid.total_amount,
        "merchant_name": merchant.name if merchant else "Merchant"
    })

    return OrderOut(
        id=new_order.id,
        listing_id=new_order.listing_id,
        winning_bid_id=new_order.winning_bid_id,
        farmer_id=new_order.farmer_id,
        farmer_name=current_user.name,
        merchant_id=new_order.merchant_id,
        merchant_name=merchant.name if merchant else "Merchant",
        crop_name=listing.crop_name,
        agreed_price_per_quintal=new_order.agreed_price_per_quintal,
        quantity_quintals=new_order.quantity_quintals,
        total_amount=new_order.total_amount,
        is_profitable_flag=new_order.is_profitable_flag,
        profit_margin_pct=new_order.profit_margin_pct,
        net_profit_amount=new_order.net_profit_amount,
        status=new_order.status,
        payment_status=new_order.payment_status,
        created_at=new_order.created_at
    )
