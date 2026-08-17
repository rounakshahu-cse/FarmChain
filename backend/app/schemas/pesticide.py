from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class PesticideProductBase(BaseModel):
    name: str
    brand: str
    category: str
    target_crops: str
    target_pests: str
    price: float
    unit: str
    stock: int
    image_url: Optional[str] = None
    description: Optional[str] = None
    usage_instructions: Optional[str] = None

class PesticideProductCreate(PesticideProductBase):
    pass

class PesticideProductOut(PesticideProductBase):
    id: int
    seller_id: int
    seller_name: Optional[str] = None
    seller_location: Optional[str] = None
    is_verified_seller: bool
    rating: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class PesticideOrderCreate(BaseModel):
    product_id: int
    quantity: int = 1
    delivery_address: str

class PesticideOrderOut(BaseModel):
    id: int
    farmer_id: int
    product_id: int
    product_name: Optional[str] = None
    quantity: int
    total_price: float
    delivery_address: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
