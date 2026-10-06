from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class DiseaseDetectResponse(BaseModel):
    id: Optional[int] = None
    is_valid_plant: Optional[bool] = True
    crop_name: str
    botanical_name: Optional[str] = None
    crop_confidence: Optional[float] = 98.5
    detected_disease: str
    pathogen_type: Optional[str] = None
    causal_organism: Optional[str] = None
    confidence: float
    severity: str
    infection_stage: Optional[str] = None
    yield_risk: Optional[str] = None
    symptoms: str
    diagnostic_markers: Optional[List[str]] = None
    organic_remedy: str
    chemical_treatment: str
    spray_dosage: Optional[str] = None
    preventive_measures: Optional[str] = None
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
