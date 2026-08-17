from typing import Dict, List, Any
from fastapi import WebSocket
import json

class ConnectionManager:
    def __init__(self):
        # listing_id -> list of active websockets
        self.listing_rooms: Dict[int, List[WebSocket]] = {}
        # user_id -> list of active websockets
        self.user_notifications: Dict[int, List[WebSocket]] = {}

    async def connect_listing(self, listing_id: int, websocket: WebSocket):
        await websocket.accept()
        if listing_id not in self.listing_rooms:
            self.listing_rooms[listing_id] = []
        self.listing_rooms[listing_id].append(websocket)

    def disconnect_listing(self, listing_id: int, websocket: WebSocket):
        if listing_id in self.listing_rooms:
            if websocket in self.listing_rooms[listing_id]:
                self.listing_rooms[listing_id].remove(websocket)
            if not self.listing_rooms[listing_id]:
                del self.listing_rooms[listing_id]

    async def broadcast_to_listing(self, listing_id: int, message: Dict[str, Any]):
        if listing_id in self.listing_rooms:
            payload = json.dumps(message)
            for connection in list(self.listing_rooms[listing_id]):
                try:
                    await connection.send_text(payload)
                except Exception:
                    self.disconnect_listing(listing_id, connection)

    async def connect_user(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        if user_id not in self.user_notifications:
            self.user_notifications[user_id] = []
        self.user_notifications[user_id].append(websocket)

    def disconnect_user(self, user_id: int, websocket: WebSocket):
        if user_id in self.user_notifications:
            if websocket in self.user_notifications[user_id]:
                self.user_notifications[user_id].remove(websocket)
            if not self.user_notifications[user_id]:
                del self.user_notifications[user_id]

    async def send_user_notification(self, user_id: int, notification: Dict[str, Any]):
        if user_id in self.user_notifications:
            payload = json.dumps(notification)
            for connection in list(self.user_notifications[user_id]):
                try:
                    await connection.send_text(payload)
                except Exception:
                    self.disconnect_user(user_id, connection)

ws_manager = ConnectionManager()
