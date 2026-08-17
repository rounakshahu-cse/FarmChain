from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class Bid(Base):
    __tablename__ = "bids"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("crop_listings.id"), nullable=False)
    merchant_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount_per_quintal = Column(Float, nullable=False)  # ₹ / quintal
    total_amount = Column(Float, nullable=False)  # amount * listing quantity
    note = Column(String(255), nullable=True)
    status = Column(String(50), default="active")  # active, accepted, outbid, rejected
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    listing = relationship("CropListing", back_populates="bids")
    merchant = relationship("User", back_populates="bids", foreign_keys=[merchant_id])
