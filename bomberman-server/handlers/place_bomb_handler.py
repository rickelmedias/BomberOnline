from fastapi import WebSocket
from services.room_manager import RoomState

async def handle_place_bomb(ws: WebSocket, room: RoomState, data: str) -> None:
    await room.broadcast(data)
