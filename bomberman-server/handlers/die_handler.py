from fastapi import WebSocket
from services.room_manager import RoomState

async def handle_die(ws: WebSocket, room: RoomState, data: str) -> None:
    await room.broadcast(data)
