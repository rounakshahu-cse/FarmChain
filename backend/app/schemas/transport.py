from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class VehicleQuoteOption(BaseModel):
    vehicle_type: str
    capacity_quintals: float
    base_rate: float
    rate_per_km: float
    estimated_cost: float
    is_recommended: bool
    description: str

class TransportQuoteRequest(BaseModel):
    crop_name: str
    load_quintals: float
    pickup_location: str
    drop_location: str
    distance_km: float

class TransportQuoteResponse(BaseModel):
    crop_name: str
    load_quintals: float
    pickup_location: str
    drop_location: str
    distance_km: float
    recommended_vehicle: str
    recommended_cost: float
    options: List[VehicleQuoteOption]

class TransportBookRequest(BaseModel):
    order_id: Optional[int] = None
    crop_name: str
    load_quintals: float
    vehicle_type: str
    pickup_location: str
    drop_location: str
    distance_km: float
    calculated_price: float

class TransportJobOut(BaseModel):
    id: int
    order_id: Optional[int] = None
    farmer_id: int
    farmer_name: Optional[str] = None
    farmer_phone: Optional[str] = None
    transporter_id: Optional[int] = None
    transporter_name: Optional[str] = None
    crop_name: str
    load_quintals: float
    vehicle_type: str
    pickup_location: str
    drop_location: str
    distance_km: float
    calculated_price: float
    status: str
    tracking_lat: Optional[float] = None
    tracking_lng: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
