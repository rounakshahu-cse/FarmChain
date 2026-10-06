from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from backend.app.core.config import settings
from backend.app.core.database import Base, engine, SessionLocal
from backend.app.core.security import decode_access_token
from backend.app.models.user import User
from backend.app.services.seed_data import seed_database
from backend.app.services.websocket_manager import ws_manager

# API Routers
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.listings import router as listings_router
from backend.app.api.v1.bids import router as bids_router
from backend.app.api.v1.orders import router as orders_router
from backend.app.api.v1.transport import router as transport_router
from backend.app.api.v1.mandi import router as mandi_router
from backend.app.api.v1.pesticides import router as pesticides_router
from backend.app.api.v1.disease import router as disease_router
from backend.app.api.v1.chatbot import router as chatbot_router
from backend.app.api.v1.notifications import router as notifications_router
from backend.app.api.v1.admin import router as admin_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB Tables & Seed Initial Agri Data
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# Enable CORS for React frontend (Vite dev server default 5173, 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 Routers
app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["Auth"])
app.include_router(listings_router, prefix=f"{settings.API_V1_STR}/listings", tags=["Listings"])
app.include_router(bids_router, prefix=f"{settings.API_V1_STR}", tags=["Bids"])
app.include_router(orders_router, prefix=f"{settings.API_V1_STR}/orders", tags=["Orders"])
app.include_router(transport_router, prefix=f"{settings.API_V1_STR}/transport", tags=["Transport"])
app.include_router(mandi_router, prefix=f"{settings.API_V1_STR}/mandi", tags=["Mandi Intelligence"])
app.include_router(pesticides_router, prefix=f"{settings.API_V1_STR}/pesticides", tags=["Pesticide Marketplace"])
app.include_router(disease_router, prefix=f"{settings.API_V1_STR}/disease", tags=["AI Disease Detection"])
app.include_router(chatbot_router, prefix=f"{settings.API_V1_STR}/chatbot", tags=["Krishi Sahayak Chatbot"])
app.include_router(notifications_router, prefix=f"{settings.API_V1_STR}/notifications", tags=["Notifications"])
app.include_router(admin_router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])

def _ws_user_or_reject(websocket: WebSocket) -> int:
    """Authenticate a WebSocket connection via ?token= query param.
    Returns the authenticated user id, or -1 if unauthenticated."""
    token = websocket.query_params.get("token", "")
    payload = decode_access_token(token) if token else None
    if not payload or "sub" not in payload:
        return -1
    try:
        return int(payload["sub"])
    except (TypeError, ValueError):
        return -1

def _ws_user_exists(user_id: int) -> bool:
    db = SessionLocal()
    try:
        return db.query(User).filter(User.id == user_id).first() is not None
    finally:
        db.close()

# Live WebSockets
@app.websocket("/ws/bids/{listing_id}")
async def websocket_bidding_room(websocket: WebSocket, listing_id: int):
    if _ws_user_or_reject(websocket) < 0:
        await websocket.close(code=4401, reason="Authentication required")
        return
    await ws_manager.connect_listing(listing_id, websocket)
    try:
        while True:
            # Keep-alive receive
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_listing(listing_id, websocket)

@app.websocket("/ws/notifications/{user_id}")
async def websocket_notifications(websocket: WebSocket, user_id: int):
    authed_user_id = _ws_user_or_reject(websocket)
    # Users may only subscribe to their own notification stream
    if authed_user_id != user_id or not _ws_user_exists(user_id):
        await websocket.close(code=4403, reason="Forbidden")
        return
    await ws_manager.connect_user(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect_user(user_id, websocket)

@app.get("/")
def root():
    return {
        "app": "Smart Krishi Connect (FarmChain) API",
        "tagline": "Empowering Farmers, Connecting Opportunities",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
