from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class PesticideProduct(Base):
    __tablename__ = "pesticide_products"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(150), nullable=False)
    brand = Column(String(100), nullable=False)
    category = Column(String(100), nullable=False)  # Bio-Fungicide, Bio-Pesticide, Fertilizer, Neem Oil, Certified Seeds, Equipment
    target_crops = Column(String(200), nullable=False)  # "Tomato, Potato, Chilli, Cotton"
    target_pests = Column(String(200), nullable=False)  # "Early Blight, Bollworm, Aphids, Fungal Wilt"
    price = Column(Float, nullable=False)  # ₹
    unit = Column(String(50), nullable=False)  # "1 Litre", "500 gm", "5 kg Pack"
    stock = Column(Integer, default=50)
    is_verified_seller = Column(Boolean, default=True)
    rating = Column(Float, default=4.9)
    image_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    usage_instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    seller = relationship("User", foreign_keys=[seller_id])
    orders = relationship("PesticideOrder", back_populates="product")

class PesticideOrder(Base):
    __tablename__ = "pesticide_orders"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("pesticide_products.id"), nullable=False)
    quantity = Column(Integer, default=1)
    total_price = Column(Float, nullable=False)
    delivery_address = Column(String(255), nullable=False)
    status = Column(String(50), default="ordered")  # ordered, processing, shipped, delivered
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    farmer = relationship("User", foreign_keys=[farmer_id])
    product = relationship("PesticideProduct", back_populates="orders")
