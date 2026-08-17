from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("crop_listings.id"), nullable=False, unique=True)
    winning_bid_id = Column(Integer, ForeignKey("bids.id"), nullable=False)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    merchant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    agreed_price_per_quintal = Column(Float, nullable=False)
    quantity_quintals = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    is_profitable_flag = Column(Boolean, default=True)  # True = profitable, False = below margin
    profit_margin_pct = Column(Float, default=0.0)  # e.g., 18.5%
    net_profit_amount = Column(Float, default=0.0)  # (agreed_price - cost_of_production) * qty
    status = Column(String(50), default="confirmed")  # confirmed, transport_assigned, in_transit, delivered, completed, cancelled
    payment_status = Column(String(50), default="escrow_held")  # escrow_held, released_to_farmer, refunded
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    listing = relationship("CropListing", back_populates="order")
    winning_bid = relationship("Bid")
    farmer = relationship("User", foreign_keys=[farmer_id])
    merchant = relationship("User", foreign_keys=[merchant_id])
    transport_job = relationship("TransportJob", back_populates="order", uselist=False)
