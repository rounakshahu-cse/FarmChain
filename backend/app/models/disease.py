from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from backend.app.core.database import Base

class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    image_url = Column(String(255), nullable=False)
    crop_name = Column(String(100), nullable=False)
    detected_disease = Column(String(150), nullable=False)
    confidence = Column(Float, nullable=False)  # 0 to 100%
    severity = Column(String(50), default="Moderate")  # Low, Moderate, High, Critical
    symptoms = Column(Text, nullable=False)
    organic_remedy = Column(Text, nullable=False)
    chemical_treatment = Column(Text, nullable=False)
    recommended_product_id = Column(Integer, ForeignKey("pesticide_products.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    farmer = relationship("User", foreign_keys=[farmer_id])
    recommended_product = relationship("PesticideProduct", foreign_keys=[recommended_product_id])
