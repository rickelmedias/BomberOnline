from fastapi import WebSocket
from services.room_manager import RoomState

async def handle_join(ws: WebSocket, room: RoomState, data: str) -> None:
    try:
        name = data.split(":", 1)[1]
    except Exception as e:
        print("Error processing join:", e)
        return
    print(f"{name} joined the room")
    if len(room.connections) < 2:
        room.connections.append((ws, name))
        if not room.players:
            room.players[name] = {"x": 50, "y": 50}
        else:
            room.players[name] = {"x": 700, "y": 500}
        await room.broadcast(f"player_joined:{name}")
        if room.is_full() and not room.started:
            await room.broadcast_spawns()
            await room.start_countdown()
