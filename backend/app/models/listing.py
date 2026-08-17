from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class CropListing(Base):
    __tablename__ = "crop_listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String(100), nullable=False, index=True)
    variety = Column(String(100), nullable=True)
    quantity_quintals = Column(Float, nullable=False)
    quality_grade = Column(String(50), nullable=False)  # Grade A, Grade B, Grade C
    base_price = Column(Float, nullable=False)  # Reserve price ₹/quintal
    cost_of_production = Column(Float, nullable=False)  # Farmer's cost ₹/quintal
    farm_location = Column(String(150), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    status = Column(String(50), default="bidding_open")  # scheduled_tomorrow, bidding_open, finalized, completed, cancelled
    bidding_opens_at = Column(DateTime, nullable=False)
    bidding_closes_at = Column(DateTime, nullable=False)
    previous_closing_price = Column(Float, nullable=True)  # Mandi closing benchmark
    image_url = Column(String(255), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    farmer = relationship("User", back_populates="listings", foreign_keys=[farmer_id])
    bids = relationship("Bid", back_populates="listing", cascade="all, delete-orphan")
    order = relationship("Order", back_populates="listing", uselist=False)
