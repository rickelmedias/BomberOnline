from fastapi import WebSocket
from services.room_manager import RoomState

async def handle_request_spawns(ws: WebSocket, room: RoomState, data: str) -> None:
    await room.broadcast_spawns()
