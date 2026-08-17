from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime, timezone
from backend.app.core.database import Base

class MandiPrice(Base):
    __tablename__ = "mandi_prices"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(100), nullable=False, index=True)
    variety = Column(String(100), nullable=True)
    mandi_name = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    modal_price = Column(Float, nullable=False)  # ₹ / quintal
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    distance_km = Column(Float, default=25.0)  # Distance from reference farming hub
    price_trend = Column(String(20), default="up")  # up, down, stable
    trend_pct = Column(Float, default=2.5)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
