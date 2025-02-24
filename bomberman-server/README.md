# Bomberman Server

The __Bomberman Server__ is the backend of the game, built using __Python__ and __FastAPI__. It handles real-time multiplayer communication via __WebSockets__, manages game rooms, synchronizes player actions, and enforces game rules. If you want to understand more about how the Game was writting using Web Technologies, so go and [read about the client too](../bomberman-client/README.md).

## What is FastAPI?

[FastAPI](https://fastapi.tiangolo.com/) is a modern web framework for building APIs with Python. It is designed for high performance, ease of use, and automatic data validation using __Pydantic__. In this project, FastAPI is used to manage WebSocket connections and process game logic in real time.

## Folder Breakdown

- __handlers/__: Processes game-related messages received from WebSocket connections. Each file corresponds to a different action:
    - __bomb_exploded_handler.py__: Manages bomb explosions and detects which players are hit
    - __die_handler.py__: Handles player deaths and broadcasts the event to all players
    - __join_handler.py__: Manages players joining rooms and assigns their initial positions
    - __move_handler.py__: Processes player movement and updates coordinates accordingly
    - __place_bomb_handler.py__: Registers bomb placement actions and synchronizes them across players
    - __request_spawns_handler.py__: Sends player spawn positions when requested
- __services/__: Contains core logic for managing game state and processing commands.
    - __command_dispatcher.py__: Implements the __Command Pattern__, routing WebSocket messages to the appropriate handlers
    - __room_manager.py__: Handles room creation, player connections, and game state tracking
- __entities/__: Defines __data models__ to ensure structured messaging between the client and server
    - __messages.py__: Defines standardized message formats using Pydantic for validation
- __main.py__: The entry point of the server. It:
    - Initializes the FastAPI application.
    - Creates the WebSocket endpoint (`/ws/{room_id}`).
    - Manages incoming messages and dispatches them using the __Command Dispatcher__.

---

## WebSocket Flow

1. **Players Join the Game**
   - Clients send a `"join:playerName"` message.
   - The server assigns initial positions and stores the player in a **RoomManager** instance.

2. **Players Move**
   - Clients send `"move:x,y"` messages.
   - The server updates the player's position and broadcasts it to all players.

3. **Players Place Bombs**
   - Clients send `"place_bomb:x,y"`.
   - The server notifies all players, allowing them to render the bomb.

4. **Bomb Explodes**
   - When a bomb timer expires, an `"bomb_exploded:x,y"` message is sent.
   - The server checks for **collisions** and **player eliminations**.
   - If a player is hit, `"die:playerName"` is broadcast.

5. **Game Ends**
   - When only one player remains, the game state is updated to **Game Over**.

---

## Running the Server

### Running on Machine
#### Installing Packages

```bash
pip install -r requirements.txt
```

#### Running Locally as Development Mode

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Running on Machine with Docker
#### Running with Docker, just the Server 

If you want to run the server and the client together working properly I strongly recommend to go to the [root readme](../README.md) and read about _"how run the `docker-compose`"_;

```bash
docker build -t bomberman-server .
docker run -p 8000:8000 bomberman-server
```