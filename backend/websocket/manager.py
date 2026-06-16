"""Gestionnaire de connexions WebSocket, regroupées en 'rooms' par school_id."""
from collections import defaultdict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self) -> None:
        # school_id -> set de WebSockets connectés
        self.rooms: dict[int, set[WebSocket]] = defaultdict(set)

    async def connect(self, school_id: int, websocket: WebSocket) -> None:
        await websocket.accept()
        self.rooms[school_id].add(websocket)

    def disconnect(self, school_id: int, websocket: WebSocket) -> None:
        self.rooms[school_id].discard(websocket)
        if not self.rooms[school_id]:
            self.rooms.pop(school_id, None)

    async def broadcast(self, school_id: int, message: dict) -> None:
        """Diffuse un message JSON à tous les connectés du même établissement."""
        dead: list[WebSocket] = []
        for ws in self.rooms.get(school_id, set()):
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(school_id, ws)


manager = ConnectionManager()
