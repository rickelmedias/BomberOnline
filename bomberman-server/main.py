from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio

from services.room_manager import RoomManager
from services.command_dispatcher import CommandDispatcher

from handlers.join_handler import handle_join
from handlers.move_handler import handle_move
from handlers.place_bomb_handler import handle_place_bomb
from handlers.bomb_exploded_handler import handle_bomb_exploded
from handlers.die_handler import handle_die
from handlers.request_spawns_handler import handle_request_spawns

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

room_manager = RoomManager()

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await websocket.accept()
    room = room_manager.get_or_create_room(room_id)

    dispatcher = CommandDispatcher()
    dispatcher.register("join", lambda data: handle_join(websocket, room, data))
    dispatcher.register("move", lambda data: handle_move(websocket, room, data))
    dispatcher.register("place_bomb", lambda data: handle_place_bomb(websocket, room, data))
    dispatcher.register("bomb_exploded", lambda data: handle_bomb_exploded(websocket, room, data))
    dispatcher.register("die", lambda data: handle_die(websocket, room, data))
    dispatcher.register("request_spawns", lambda data: handle_request_spawns(websocket, room, data))

    try:
        while True:
            data = await websocket.receive_text()
            print("Received data:", data)
            await dispatcher.dispatch(data)
    except WebSocketDisconnect:
        for i, (ws, nm) in enumerate(room.connections):
            if ws == websocket:
                print(f"{nm} disconnected from room {room_id}")
                room.connections.pop(i)
                room.players.pop(nm, None)
                break
        if len(room.connections) == 0:
            room_manager.remove_room(room_id)