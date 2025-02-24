# Bomberman Client

The __Bomberman Client__ is the front-end part of the Bomberman Online study project, so it means that in this part you can find the coding of the game. It is built with TypeScript using the Phaser framework. If you want to understand more about how the Multiplayer Works, so go and [read about the server too](../bomberman-server/README.md).

## What is Phaser?

[Phaser](https://phaser.io/) is a popular framework for building **HTML5 games**. It provides a game loop, physics engine, sprite management, and an extensive animation system.

## Folder Breakdown

- __public/assets/__: Contains all static assets such as __spritesheets, images, and fonts__ used in the game.
- __src/animations/__: __Loading and creation of animations__. It ensures that all game objects (players, bombs, explosions).
- __src/entities/__: Defines the __main game objects__:
    - __Player.ts__: Manages player movement, animations, and interactions
    - __Bomb.ts__: Controls bomb placement and detonation timing
    - __Explosion.ts__: Handles explosion propagation and collision effects
    - __Box.ts__: Object that can be destroyed
    - __Block.ts__: Object that cannot be destroyed
-  __src/handlers/__: Handles messages sent via WebSocket, processing game actions received from the server
    - __BombExplosionHandler.ts__: Manages explosion effects and player elimination logic
    - __BombPlacementHandler.ts__: Handles bomb placement by remote players
    - __DieHandler.ts__: Updates the game when a player dies
    - __InputHandler.ts__: Captures player input for movement and bomb placement
    - __MovementHandler.ts__: Updates player positions and animations based on WebSocket messages
    - __SocketMessageDispatcher.ts__: Implements the __Command Pattern__ to manage WebSocket messages
    - __SpawnHandler.ts__: Handles player spawning and rejoining logic
- __src/interfaces/__: Defines __TypeScript interfaces__ for integration and modularization of game
- __src/managers/__: Manages different aspects of the game:
    - __CollisionManager.ts__: Manage object collisions
    - __GameStateManager.ts__: Tracks game progress (e.g., "Playing", "Game Over")
    - __LevelBuilder.ts__: Generates the game map based on a predefined grid
    - __UIManager.ts__: Controls user interface elements such as menus and game over screens
- __src/network/__: Implements the __WebSocket client__ for real-time communication with the __FastAPI server__
- __src/scenes/__: Defines game __scenes__:
    - __LobbyScene.ts__: The lobby where players enter their username and room code
    - __GameScene.ts__: The main game scene where all gameplay happens
__constants.ts__: Stores global constants like grid size, movement speed, and animation configurations
__env.d.ts__: Defines __environment variables__ used in the game, such as the __server URL__
__main.ts__: The __entry point of the game__, responsible for initializing Phaser, loading assets, and setting up scenes

---

## Running the Client

### Running on Machine
#### Installing Dependencies

```bash
npm install
```

#### Running Locally as Development Mode

```bash
npm run dev
```

### Running on Machine with Docker
#### Running with Docker, just the Client

If you want to run the server and the client together working properly I strongly recommend to go to the [root readme](../README.md) and read about _"how run the `docker-compose`"_;

```bash
docker build -t bomberman-client .
docker run -p 80:80 bomberman-client
```