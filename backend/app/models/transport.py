from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class TransportJob(Base):
    __tablename__ = "transport_jobs"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    transporter_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    crop_name = Column(String(100), nullable=False)
    load_quintals = Column(Float, nullable=False)
    vehicle_type = Column(String(100), nullable=False)  # Mini Truck (Tata Ace), Pickup (Bolero), 10-Ton (Eicher), Tractor-Trolley
    pickup_location = Column(String(150), nullable=False)
    drop_location = Column(String(150), nullable=False)
    distance_km = Column(Float, nullable=False)
    base_rate = Column(Float, default=500.0)
    rate_per_km = Column(Float, default=18.0)
    calculated_price = Column(Float, nullable=False)
    status = Column(String(50), default="available")  # available, accepted, pickup_done, in_transit, delivered, completed
    tracking_lat = Column(Float, nullable=True)
    tracking_lng = Column(Float, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    order = relationship("Order", back_populates="transport_job")
    farmer = relationship("User", foreign_keys=[farmer_id])
    transporter = relationship("User", foreign_keys=[transporter_id])
