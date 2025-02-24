import asyncio
from typing import Dict, Tuple, List
from fastapi import WebSocket

class RoomState:
    def __init__(self):
        self.connections: List[Tuple[WebSocket, str]] = []
        self.players: Dict[str, Dict[str, int]] = {}
        self.started: bool = False

    async def broadcast(self, message: str):
        for (ws, _) in self.connections:
            await ws.send_text(message)

    def is_full(self) -> bool:
        return len(self.connections) == 2

    async def broadcast_spawns(self):
        for name, pos in self.players.items():
            msg = f"spawn:{name}:{pos['x']}:{pos['y']}"
            print("Broadcasting spawn:", msg)
            await self.broadcast(msg)

    async def start_countdown(self):
        for i in range(3, 0, -1):
            await self.broadcast(f"countdown:{i}")
            await asyncio.sleep(1)
        await self.broadcast("start_game")
        self.started = True

class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, RoomState] = {}

    def get_or_create_room(self, room_id: str) -> RoomState:
        if room_id not in self.rooms:
            self.rooms[room_id] = RoomState()
        return self.rooms[room_id]

    def remove_room(self, room_id: str):
        self.rooms.pop(room_id, None)
