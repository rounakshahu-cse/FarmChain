from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class DiseaseDetectResponse(BaseModel):
    id: Optional[int] = None
    crop_name: str
    detected_disease: str
    confidence: float
    severity: str
    symptoms: str
    organic_remedy: str
    chemical_treatment: str
    recommended_product_id: Optional[int] = None
    recommended_product_name: Optional[str] = None
    recommended_product_price: Optional[float] = None
    image_url: str
    created_at: Optional[datetime] = None

class DiseaseReportOut(BaseModel):
    id: int
    farmer_id: int
    crop_name: str
    detected_disease: str
    confidence: float
    severity: str
    symptoms: str
    organic_remedy: str
    chemical_treatment: str
    recommended_product_id: Optional[int] = None
    image_url: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
