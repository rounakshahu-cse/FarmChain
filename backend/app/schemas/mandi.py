from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class MandiPriceOut(BaseModel):
    id: int
    crop_name: str
    variety: Optional[str] = None
    mandi_name: str
    district: str
    state: str
    modal_price: float  # ₹ / quintal
    min_price: float
    max_price: float
    distance_km: float
    arrivals_tonnes: Optional[float] = 120.0
    price_trend: str
    trend_pct: float
    market_status: Optional[str] = "Open & Trading"
    updated_at: datetime
    estimated_transport_cost: Optional[float] = None
    net_realized_price: Optional[float] = None
    is_best_mandi: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)

class MandiAnalysisResponse(BaseModel):
    crop_name: str
    farmer_location: str
    total_quantity_quintals: float
    best_mandi: Optional[MandiPriceOut] = None
    all_mandis: List[MandiPriceOut]
