from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
from backend.app.models.user import User
from backend.app.models.transport import TransportJob
from backend.app.models.order import Order
from backend.app.models.notification import Notification
from backend.app.schemas.transport import (
    TransportQuoteRequest, TransportQuoteResponse,
    TransportBookRequest, TransportJobOut
)
from backend.app.services.transport_engine import calculate_transport_options

router = APIRouter()

def format_job_out(job: TransportJob, db: Session) -> TransportJobOut:
    farmer = db.query(User).filter(User.id == job.farmer_id).first()
    transporter = db.query(User).filter(User.id == job.transporter_id).first() if job.transporter_id else None

    return TransportJobOut(
        id=job.id,
        order_id=job.order_id,
        farmer_id=job.farmer_id,
        farmer_name=farmer.name if farmer else "Farmer",
        farmer_phone=farmer.phone if farmer else "9876543210",
        transporter_id=job.transporter_id,
        transporter_name=transporter.name if transporter else "Available for Assignment",
        crop_name=job.crop_name,
        load_quintals=job.load_quintals,
        vehicle_type=job.vehicle_type,
        pickup_location=job.pickup_location,
        drop_location=job.drop_location,
        distance_km=job.distance_km,
        calculated_price=job.calculated_price,
        status=job.status,
        tracking_lat=job.tracking_lat,
        tracking_lng=job.tracking_lng,
        created_at=job.created_at
    )

@router.post("/quote", response_model=TransportQuoteResponse)
def get_transport_quote(quote_in: TransportQuoteRequest):
    """
    Computes freight quotes across vehicle classes and auto-selects the optimal vehicle.
    """
    res = calculate_transport_options(
        load_quintals=quote_in.load_quintals,
        distance_km=quote_in.distance_km
    )
    return TransportQuoteResponse(
        crop_name=quote_in.crop_name,
        load_quintals=quote_in.load_quintals,
        pickup_location=quote_in.pickup_location,
        drop_location=quote_in.drop_location,
        distance_km=quote_in.distance_km,
        recommended_vehicle=res["recommended_vehicle"],
        recommended_cost=res["recommended_cost"],
        options=res["options"]
    )

@router.post("/book", response_model=TransportJobOut)
def book_transport(
    book_in: TransportBookRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Auto-assign to available transporter or set status available for transporter bidding
    first_transporter = db.query(User).filter(User.role == "transporter").first()
    
    new_job = TransportJob(
        order_id=book_in.order_id,
        farmer_id=current_user.id,
        transporter_id=first_transporter.id if first_transporter else None,
        crop_name=book_in.crop_name,
        load_quintals=book_in.load_quintals,
        vehicle_type=book_in.vehicle_type,
        pickup_location=book_in.pickup_location,
        drop_location=book_in.drop_location,
        distance_km=book_in.distance_km,
        calculated_price=book_in.calculated_price,
        status="accepted" if first_transporter else "available"
    )
    db.add(new_job)

    if book_in.order_id:
        order = db.query(Order).filter(Order.id == book_in.order_id).first()
        if order:
            order.status = "transport_assigned"

    db.commit()
    db.refresh(new_job)

    # Notify Transporter
    if first_transporter:
        notif_t = Notification(
            user_id=first_transporter.id,
            title="🚚 New Transport Load Booked!",
            message=f"New trip: {new_job.crop_name} ({new_job.load_quintals} Qtl) from {new_job.pickup_location} to {new_job.drop_location} ({new_job.distance_km} km). Guaranteed Payout: ₹{int(new_job.calculated_price)}.",
            type="transport_assigned",
            is_read=False,
            link="/transporter/jobs"
        )
        db.add(notif_t)
        db.commit()

    return format_job_out(new_job, db)

@router.get("/jobs", response_model=List[TransportJobOut])
def get_transport_jobs(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(TransportJob)
    if current_user.role == "transporter":
        query = query.filter((TransportJob.transporter_id == current_user.id) | (TransportJob.status == "available"))
    elif current_user.role == "farmer":
        query = query.filter(TransportJob.farmer_id == current_user.id)
    
    if status_filter and status_filter != "all":
        query = query.filter(TransportJob.status == status_filter)

    jobs = query.order_by(TransportJob.id.desc()).all()
    return [format_job_out(j, db) for j in jobs]

@router.post("/jobs/{job_id}/status", response_model=TransportJobOut)
def update_job_status(
    job_id: int,
    new_status: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(TransportJob).filter(TransportJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transport job not found")

    job.status = new_status
    if current_user.role == "transporter" and not job.transporter_id:
        job.transporter_id = current_user.id

    # If linked to order, sync order status
    if job.order_id:
        order = db.query(Order).filter(Order.id == job.order_id).first()
        if order:
            if new_status == "in_transit":
                order.status = "in_transit"
            elif new_status == "delivered":
                order.status = "delivered"
                order.payment_status = "released_to_farmer"

    # Notify Farmer
    farmer = db.query(User).filter(User.id == job.farmer_id).first()
    if farmer:
        notif = Notification(
            user_id=farmer.id,
            title=f"📦 Transport Status: {new_status.replace('_', ' ').title()}",
            message=f"Trip for {job.crop_name} is now '{new_status.replace('_', ' ').title()}'. Transporter: {current_user.name}.",
            type="delivery_update",
            is_read=False,
            link="/farmer/transport"
        )
        db.add(notif)

    db.commit()
    db.refresh(job)
    return format_job_out(job, db)
