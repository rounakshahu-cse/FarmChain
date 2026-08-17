from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.api.v1.auth import get_current_user
from backend.app.models.user import User
from backend.app.schemas.chatbot import ChatbotRequest, ChatbotResponse
from backend.app.services.chatbot_engine import process_krishi_chat

router = APIRouter()

@router.post("/ask", response_model=ChatbotResponse)
def ask_krishi_sahayak(
    chat_in: ChatbotRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Krishi Sahayak AI Assistant: Grounded responses in live Mandi rates, Orders, Transport & Pathology.
    """
    res = process_krishi_chat(
        query=chat_in.query,
        language=chat_in.language or "en",
        user_id=current_user.id if current_user else None,
        db=db
    )
    return ChatbotResponse(
        answer=res["answer"],
        language=res["language"],
        suggested_actions=res["suggested_actions"],
        grounded_data=res["grounded_data"]
    )
