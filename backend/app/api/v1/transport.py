from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user, require_roles
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
    current_user: User = Depends(require_roles("farmer")),
    db: Session = Depends(get_db)
):
    if book_in.order_id:
        order = db.query(Order).filter(Order.id == book_in.order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
        if order.farmer_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only book transport for your own orders",
            )

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

class JobStatusUpdate(BaseModel):
    status: Optional[str] = None
    new_status: Optional[str] = None

ALLOWED_JOB_STATUSES = {"available", "requested", "accepted", "in_transit", "delivered", "completed", "cancelled"}

@router.get("/jobs", response_model=List[TransportJobOut])
def get_transport_jobs(
    status_filter: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(TransportJob)
    if current_user.role == "transporter":
        # Transporters see their assigned trips AND all unassigned available/requested loads
        query = query.filter(
            (TransportJob.transporter_id == current_user.id) |
            (TransportJob.status.in_(["available", "requested"])) |
            (TransportJob.transporter_id.is_(None))
        )
    elif current_user.role == "farmer":
        query = query.filter(TransportJob.farmer_id == current_user.id)
    
    if status_filter and status_filter != "all":
        query = query.filter(TransportJob.status == status_filter)

    jobs = query.order_by(TransportJob.id.desc()).all()
    return [format_job_out(j, db) for j in jobs]

@router.patch("/jobs/{job_id}/status", response_model=TransportJobOut)
@router.post("/jobs/{job_id}/status", response_model=TransportJobOut)
def update_job_status(
    job_id: int,
    status_in: Optional[JobStatusUpdate] = None,
    new_status: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    target_status = None
    if status_in:
        target_status = status_in.status or status_in.new_status
    if not target_status and new_status:
        target_status = new_status
    if not target_status:
        target_status = "accepted"

    if target_status not in ALLOWED_JOB_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed: {', '.join(sorted(ALLOWED_JOB_STATUSES))}",
        )

    job = db.query(TransportJob).filter(TransportJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transport job not found")

    # Authorization: admin, the owning farmer, or an authorized transporter
    is_assigned_transporter = current_user.role == "transporter" and job.transporter_id == current_user.id
    is_unassigned_job = job.transporter_id is None or job.status in ("available", "requested")
    if (
        current_user.role != "admin"
        and current_user.id != job.farmer_id
        and not is_assigned_transporter
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update this transport job",
        )

    if current_user.role == "transporter":
        # Transporters may self-assign only jobs that are not already taken
        if job.transporter_id is None or job.status in ("available", "requested"):
            job.transporter_id = current_user.id
        elif job.transporter_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This job is already assigned to another transporter",
            )

    job.status = target_status

    # If linked to order, sync order status
    if job.order_id:
        order = db.query(Order).filter(Order.id == job.order_id).first()
        if order:
            if target_status == "in_transit":
                order.status = "in_transit"
            elif target_status == "delivered":
                order.status = "delivered"
                order.payment_status = "released_to_farmer"

    # Notify Farmer
    farmer = db.query(User).filter(User.id == job.farmer_id).first()
    if farmer:
        notif = Notification(
            user_id=farmer.id,
            title=f"📦 Transport Status: {target_status.replace('_', ' ').title()}",
            message=f"Trip for {job.crop_name} is now '{target_status.replace('_', ' ').title()}'. Transporter: {current_user.name}.",
            type="delivery_update",
            is_read=False,
            link="/farmer/transport"
        )
        db.add(notif)

    db.commit()
    db.refresh(job)
    return format_job_out(job, db)

@router.get("/transporters")
def get_verified_transporters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns verified local driver fleet directory with transparent rates, visible to farmers.
    """
    return [
        {
            "id": 1,
            "name": "Jagjit Singh Logistics",
            "driver_name": "Jagjit Singh",
            "phone": "9823456789",
            "vehicle_type": "Mini Truck (Tata Ace / Chota Hathi)",
            "vehicle_number": "MH-15-EG-4412",
            "capacity_quintals": 15.0,
            "base_fare": 350.0,
            "rate_per_km": 12.0,
            "rating": 4.9,
            "trips_completed": 142,
            "verified": True,
            "status": "Available Now",
            "operating_districts": "Nashik, Pune, Thane, Mumbai, Ahmednagar",
            "upi_id": "jagjit.transport@okaxis"
        },
        {
            "id": 2,
            "name": "Kisan Rural Auto Cargo",
            "driver_name": "Sachin Gaikwad",
            "phone": "9765432109",
            "vehicle_type": "3-Wheeler Auto Cargo (Piaggio Ape / Mahindra Alfa)",
            "vehicle_number": "MH-15-BW-8921",
            "capacity_quintals": 5.0,
            "base_fare": 150.0,
            "rate_per_km": 8.0,
            "rating": 4.9,
            "trips_completed": 98,
            "verified": True,
            "status": "Available Now",
            "operating_districts": "Dindori, Nashik, Niphad, Lasalgaon, Sinnar",
            "upi_id": "sachin.gaikwad@paytm"
        },
        {
            "id": 3,
            "name": "Balwinder Maxi Roadlines",
            "driver_name": "Balwinder Singh",
            "phone": "9811223344",
            "vehicle_type": "Pickup Truck (Mahindra Bolero Maxi Truck)",
            "vehicle_number": "MH-15-DM-9901",
            "capacity_quintals": 30.0,
            "base_fare": 650.0,
            "rate_per_km": 16.0,
            "rating": 4.8,
            "trips_completed": 310,
            "verified": True,
            "status": "Available Now",
            "operating_districts": "Nashik, Vashi APMC, Pune APMC, Surat, Dhule",
            "upi_id": "balwinder.freight@ybl"
        },
        {
            "id": 4,
            "name": "Shetkari Krishi Tractor Seva",
            "driver_name": "Pandurang Shinde",
            "phone": "9890123456",
            "vehicle_type": "Tractor-Trolley (Rural Farm-to-Mandi)",
            "vehicle_number": "MH-15-TR-2204",
            "capacity_quintals": 60.0,
            "base_fare": 850.0,
            "rate_per_km": 15.0,
            "rating": 5.0,
            "trips_completed": 215,
            "verified": True,
            "status": "Available Now",
            "operating_districts": "Nashik Rural, Lasalgaon, Yeola, Malegaon",
            "upi_id": "pandurang.tractor@oksbi"
        },
        {
            "id": 5,
            "name": "Sahyadri Cold Chain Express",
            "driver_name": "Vikram Desai",
            "phone": "9845012345",
            "vehicle_type": "Refrigerated Reefer Van (Cold Chain)",
            "vehicle_number": "MH-04-RF-7788",
            "capacity_quintals": 40.0,
            "base_fare": 1500.0,
            "rate_per_km": 26.0,
            "rating": 4.9,
            "trips_completed": 178,
            "verified": True,
            "status": "Available Now",
            "operating_districts": "All Maharashtra, Gujarat, Delhi NCR Corridor",
            "upi_id": "sahyadri.reefer@icici"
        },
        {
            "id": 6,
            "name": "National Highway Mega Haulers",
            "driver_name": "Gurmeet Gill",
            "phone": "9876501234",
            "vehicle_type": "16-Wheeler National Trailer (25-Ton Mega Freight)",
            "vehicle_number": "NL-01-AB-1616",
            "capacity_quintals": 250.0,
            "base_fare": 4500.0,
            "rate_per_km": 38.0,
            "rating": 4.8,
            "trips_completed": 540,
            "verified": True,
            "status": "Available Now",
            "operating_districts": "All India National Permit",
            "upi_id": "gill.nationalfreight@hdfcbank"
        }
    ]

@router.post("/jobs/{job_id}/pay")
def pay_transport_job(
    job_id: int,
    payment_method: str = "phonepe",
    amount: float = 0.0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    job = db.query(TransportJob).filter(TransportJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transport job not found")

    if current_user.role != "admin" and job.farmer_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the farmer who booked this trip can pay for it",
        )

    import uuid
    txn_ref = f"UPI/TR-{uuid.uuid4().hex[:8].upper()}"

    if job.transporter_id:
        notif_msg = f"💰 Freight Payment Received: Farmer {current_user.name} paid ₹{int(amount or job.calculated_price):,} via {payment_method.upper()} (Ref: {txn_ref}) for trip {job.crop_name}."
        db.add(
            Notification(
                user_id=job.transporter_id,
                title="💸 Transport Payout Received!",
                message=notif_msg
            )
        )
        db.commit()

    return {
        "status": "success",
        "job_id": job.id,
        "amount": amount or job.calculated_price,
        "method": payment_method,
        "transaction_ref": txn_ref
    }

