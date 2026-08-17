from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    role: str  # farmer, merchant, transporter, seller, admin
    location: str
    district: Optional[str] = None
    state: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    phone_or_email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"

class UserOut(UserBase):
    id: int
    trust_score: float
    total_deals: int
    verified: bool
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

Token.model_rebuild()
