from fastapi import WebSocket
from services.room_manager import RoomState

async def handle_move(ws: WebSocket, room: RoomState, data: str) -> None:
    try:
        dxdy = data.split(":", 1)[1]
        dx_str, dy_str = dxdy.split(",")
        dx = int(dx_str)
        dy = int(dy_str)
    except Exception as e:
        print("Error processing move:", e)
        return
    sender_name = None
    for (w, nm) in room.connections:
        if w == ws:
            sender_name = nm
            break
    if sender_name:
        room.players[sender_name]["x"] += dx
        room.players[sender_name]["y"] += dy
        pos = room.players[sender_name]
        await room.broadcast(f"player_position:{sender_name}:{pos['x']}:{pos['y']}")
