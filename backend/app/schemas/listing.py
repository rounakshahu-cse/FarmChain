from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class BidOut(BaseModel):
    id: int
    listing_id: int
    merchant_id: int
    merchant_name: Optional[str] = None
    merchant_trust_score: Optional[float] = None
    amount_per_quintal: float
    total_amount: float
    note: Optional[str] = None
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class CropListingBase(BaseModel):
    crop_name: str
    variety: Optional[str] = None
    quantity_quintals: float
    quality_grade: str  # Grade A, Grade B, Grade C
    base_price: float
    cost_of_production: float
    farm_location: str
    district: str
    state: str
    schedule_for_tomorrow: Optional[bool] = False
    notes: Optional[str] = None
    image_url: Optional[str] = None

class CropListingCreate(CropListingBase):
    pass

class CropListingOut(CropListingBase):
    id: int
    farmer_id: int
    farmer_name: Optional[str] = None
    farmer_trust_score: Optional[float] = None
    status: str
    bidding_opens_at: datetime
    bidding_closes_at: datetime
    previous_closing_price: Optional[float] = None
    highest_bid_amount: Optional[float] = None
    total_bids_count: Optional[int] = 0
    bids: Optional[List[BidOut]] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BidCreate(BaseModel):
    amount_per_quintal: float
    note: Optional[str] = None
