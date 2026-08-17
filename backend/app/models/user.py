from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)  # farmer, merchant, transporter, seller, admin
    location = Column(String(150), nullable=False)
    district = Column(String(100), nullable=True)
    state = Column(String(100), nullable=False)
    trust_score = Column(Float, default=4.8)
    total_deals = Column(Integer, default=0)
    verified = Column(Boolean, default=True)
    avatar_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    listings = relationship("CropListing", back_populates="farmer", foreign_keys="CropListing.farmer_id")
    bids = relationship("Bid", back_populates="merchant", foreign_keys="Bid.merchant_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
