from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class OrderOut(BaseModel):
    id: int
    listing_id: int
    winning_bid_id: int
    farmer_id: int
    farmer_name: Optional[str] = None
    merchant_id: int
    merchant_name: Optional[str] = None
    crop_name: Optional[str] = None
    agreed_price_per_quintal: float
    quantity_quintals: float
    total_amount: float
    is_profitable_flag: bool
    profit_margin_pct: float
    net_profit_amount: float
    status: str
    payment_status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AcceptBidRequest(BaseModel):
    bid_id: int
