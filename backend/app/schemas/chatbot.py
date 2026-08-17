from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict, Any

class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str

class ChatbotRequest(BaseModel):
    query: str
    language: Optional[str] = "en"  # en, hi, mr
    conversation_history: Optional[List[ChatMessage]] = []

class ChatbotResponse(BaseModel):
    answer: str
    language: str
    suggested_actions: Optional[List[str]] = []
    grounded_data: Optional[Dict[str, Any]] = None

class NotificationOut(BaseModel):
    id: int
    user_id: int
    title: str
    message: str
    type: str
    is_read: bool
    link: Optional[str] = None
    created_at: str

    model_config = ConfigDict(from_attributes=True)

class NotificationMarkRead(BaseModel):
    notification_id: int
